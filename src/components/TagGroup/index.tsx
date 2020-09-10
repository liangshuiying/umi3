import EventEmitter from '@/helpers/EventEmitter';
import IconFont from '@/components/IconFont';
import PopoverDropdown from '@/components/PopoverDropdown';
import InputModal from '../InputModal';
import * as styles from './index.module.less';
import { Tree, Modal } from 'antd';
import React from 'react';
import {
  CaretDownOutlined,
  PlusSquareOutlined,
  EditOutlined,
  MinusSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { TreeNodeNormal } from 'antd/es/tree/Tree';
import cls from 'classnames';
import { cloneDeep } from 'lodash';

/**
 * NOTE:
 * anthor: liyao
 * actions: 编辑, 删除, 添加, 三个行为采用事件通知的机制向调用者通知
 * usage: 传入如下数据结构, 渲染出 tree 分组结构,
 *   props:
 *        treeData: 主要的渲染数据结构,
 *        // 触发编辑行为的处理函数, key 为当前编辑项的 key, value: 为编辑之后新的 value
 *        onEdit: (data: { key: string; value: string }) => void;
 *        // 删除的处理函数
 *        onDelete: (key: string) => void;
 *        // 添加的处理函数
 *        onAdd: (data: { key: string; value: string }) => void;
 *
 * eg:
 *   <TagGroup
 *    treeData={treeData}
 *    onAdd={(data) => {console.log(data);}}
 *    onEdit={(data) => {console.log(data);}}
 *    onDelete={(data) => {console.log(data);}}
 *  />
 */

export let treeData: TreeNodeData[] = [
  {
    key: '1',
    title: 'title1',
    isShowAddIcon: true,
    isShowEditDelIcon: false,
    children: [
      {
        key: '2',
        title: 'title2',
        isShowAddIcon: false,
        count: 2,
        isShowEditDelIcon: true,
        children: [
          {
            key: '3',
            title: 'title2',
            isShowAddIcon: false,
            isShowEditDelIcon: false,
          },
          {
            key: '4',
            title: 'title3',
            isShowAddIcon: false,
            isShowEditDelIcon: false,
          },
        ],
      },
      {
        key: '5',
        title: 'title3',
        isShowAddIcon: false,
        isShowEditDelIcon: true,
        count: 2,
        children: [
          {
            key: '6',
            title: 'title2',
            isShowAddIcon: false,
            isShowEditDelIcon: false,
          },
          {
            key: '7',
            title: 'title3',
            isShowAddIcon: false,
            isShowEditDelIcon: false,
          },
        ],
      },
    ],
  },
];

export interface TreeNodeData extends TreeNodeNormal {
  // NOTE: isTree 这个字段控制是否显示右边的删除和编辑图标
  isShowEditDelIcon: boolean;
  // NOTE: isTree 这个字段控制是否显示右边的添加图标
  isShowAddIcon: boolean;
  count?: number;
  isActive?: boolean;
  children?: TreeNodeData[];
}

interface InternalEventTables {
  edit: { key: string };
  delete: { key: string };
  add: { key: string };
  click: { key: string };
}

export type ExternalEventEmitterType = EventEmitter<{ cancel: null }>;

export interface TagGroupProps {
  treeData: TreeNodeData[];
  // 树型结构默认展的节点
  defaultExpandedKeys?: string[];
  // NOTE: 使用事件 通讯的机制是为了避免将 弹框的控制权完全交出，
  // 因为 InputModal 这个组件在内部使用，同时也没有将弹框的 "确定"， "取消" 等行为向外抛出，
  // 为了这一决策，只采用事件通知的形式来将 hide modal 这一个主动行为向外抛出
  // 显示和modal 上的内容还是内部管理
  defaultExpandAll?: boolean;
  // NOTE: 采用属性来控制， 不能很好的控制单一的控制权
  modalTitle?: string;
  modalInputLabel?: string;
  modalplaceholderText?: string;
  eventEmit?: ExternalEventEmitterType;
  leafClassName?: string;
  onEdit?: (data: { key: string; value: string; oldValue: string }) => Promise<void>;
  onDelete?: (key: string) => Promise<void>;
  onAdd?: (data: { key: string; value: string }) => Promise<void>;
  onClick?: (key: string) => void;
}

interface TagGroupState {
  treeData: TreeNodeData[];
  lock: boolean;
  modalTitle: string;
  modalInputValue: string;
  modalVisable: boolean;
}

export class TagGroup extends React.PureComponent<TagGroupProps, TagGroupState> {
  private currentKey = '';

  private actionType: 'edit' | 'delete' | 'add' | undefined = undefined;

  private static eventEmit = new EventEmitter<InternalEventTables>();

  private static keyTitleMap: { [key: string]: string } = {};

  static getDerivedStateFromProps(props, state) {
    return TagGroup.parserRawTreeData(props, state);
  }

  private static parserRawTreeData(props: TagGroupProps, state) {
    const { treeData, modalTitle } = props;
    const data: TreeNodeData[] = cloneDeep(treeData);
    TagGroup.doParser(data, props, state.lock);
    // eslint-disable-next-line react/no-direct-mutation-state
    return {
      modalInputValue: '',
      modalTitle: modalTitle || '',
      modalVisable: false,
      ...state,
      treeData: data,
    };
  }

  private static doParser(data: TreeNodeData[], config: TagGroupProps, lock: boolean) {
    for (let item of data) {
      const title = item.title as string;
      this.keyTitleMap[item.key] = title;
      const key = item.key;
      item.title = TagGroup.renderTitleRC(
        {
          count: item.count,
          id: `${key}`,
          isShowAddIcon: item.isShowAddIcon,
          isShowEditDelIcon: item.isShowEditDelIcon,
          title,
          isActive: item.isActive || false,
          lock,
        },
        config,
      );
      if (Array.isArray(item.children) && item.children.length > 0) {
        TagGroup.doParser(item.children, config, lock);
      }
    }
  }

  private static renderTitleRC(props: TreeNodeTitleProps, config: TagGroupProps) {
    return <TreeNodeTitleRC {...props} eventEmit={TagGroup.eventEmit} className={config.leafClassName} />;
  }

  state = {
    treeData: [],
    modalInputValue: '',
    modalTitle: this.props.modalTitle || '',
    modalVisable: false,
    lock: false,
  };

  constructor(props: TagGroupProps) {
    super(props);
    this.init();
    this.listenExternalEvent();
  }

  componentWillUnmount() {
    TagGroup.eventEmit.removeAllListeners();
  }

  private init() {
    const { onClick, onDelete, modalTitle = '标签分组' } = this.props;
    TagGroup.eventEmit.on('add', ({ key }) => {
      console.log('add');
      this.currentKey = key;
      this.actionType = 'add';
      this.setState({
        modalTitle: `添加${modalTitle}`,
        modalVisable: true,
        modalInputValue: '',
      });
    });

    TagGroup.eventEmit.on('click', ({ key }) => {
      console.log('click', key);
      onClick && onClick(key);
    });

    TagGroup.eventEmit.on('delete', ({ key }) => {
      console.log('delete', key);
      this.setState({ lock: true });
      this.currentKey = key;
      this.actionType = 'delete';
      Modal.confirm({
        title: '您确定要删除选中的记录吗？',
        icon: <ExclamationCircleOutlined />,
        content: '删除后无法恢复',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          onDelete && onDelete(key);
          this.setState({ lock: false });
        },
        onCancel: () => {
          this.setState({ lock: false });
        },
      });
    });

    TagGroup.eventEmit.on('edit', ({ key }) => {
      this.currentKey = key;
      console.log('edit', key);
      this.actionType = 'edit';
      this.setState({
        modalTitle: `编辑${modalTitle}`,
        modalVisable: true,
        modalInputValue: TagGroup.keyTitleMap[key],
      });
    });
  }

  private listenExternalEvent() {
    const { eventEmit } = this.props;
    if (eventEmit) {
      eventEmit.on('cancel', () => {
        this.setState({
          modalVisable: false,
        });
      });
    }
  }

  private handleInputModalConfirm = (value: string) => {
    value = value && value.trim();
    const { onAdd, onEdit } = this.props;
    const callback: any = this.actionType === 'edit' ? onEdit : onAdd;

    callback({ value, key: this.currentKey, oldValue: this.state.modalInputValue }).then(() => {
      this.setState({
        modalVisable: false,
      });
    });
  };
  private handleInputModalCancel = () => {
    this.setState({
      modalVisable: false,
    });
  };

  render() {
    const {
      defaultExpandedKeys,
      modalplaceholderText = '请输入中文、字母、数字、下划线',
      modalInputLabel = '分组名称',
      defaultExpandAll = true,
    } = this.props;
    const { modalTitle, modalVisable, modalInputValue } = this.state;
    return (
      <>
        <Tree
          defaultExpandAll={defaultExpandAll}
          switcherIcon={<CaretDownOutlined />}
          defaultExpandedKeys={defaultExpandedKeys || []}
          showIcon
          selectable={false}
          treeData={this.state.treeData as any}
          className={styles.tagGroupPanel}
        />
        <InputModal
          title={modalTitle}
          placeholderText={modalplaceholderText}
          inputLabel={modalInputLabel}
          modelVisable={modalVisable}
          value={modalInputValue}
          handleCancel={this.handleInputModalCancel}
          handleOk={this.handleInputModalConfirm}
          handleLoading={false}
        />
      </>
    );
  }
}

interface TreeNodeTitleProps {
  id: string;
  title: string;
  // NOTE: isTree 这个字段控制是否显示右边的删除和编辑图标
  isShowEditDelIcon: boolean;
  isActive: boolean;
  // NOTE: isTree 这个字段控制是否显示右边的添加图标
  isShowAddIcon: boolean;
  count?: number;
  className?: string; // 提供样式变更能力
  lock: boolean;
}

const TreeNodeTitleRC: React.FC<TreeNodeTitleProps & {
  eventEmit: EventEmitter<InternalEventTables>;
}> = props => {
  // const [isActive, setValue] = useState(false);
  const { isActive, title, isShowAddIcon, isShowEditDelIcon, eventEmit, id, count, className, lock } = props;

  return (
    <div
      title={count ? `${title}(${count})` : `${title}`}
      className={cls(styles.titleBox, className)}
      // NOTE: 产品需求, 去掉鼠标进入出现 icon
      // onMouseEnter={() => {
      //   setValue(true);
      // }}
      // onMouseLeave={() => {
      //   setValue(false);
      // }}
    >
      <span
        className={cls(styles.text, isActive ? styles.active : '')}
        onClick={e => {
          e.stopPropagation();
          eventEmit.emit('click', { key: id });
        }}
      >
        {id === '-10' ? <em className={styles.first}>{title}</em> : <pre className={styles.title}>{title}</pre>}
        {count ? <em>({count})</em> : <em>{+id >= 0 ? '(0)' : ''}</em>}
      </span>
      {isShowAddIcon ? (
        <span className={cls(styles.iconBox, isActive ? styles.active : '')}>
          <IconFont
            type={isActive ? 'iconAddto_2' : 'iconAddto_1'}
            onClick={e => {
              e.stopPropagation();
              eventEmit.emit('add', { key: id });
            }}
          />
        </span>
      ) : null}
      {isShowEditDelIcon ? (
        <span className={cls(styles.iconBox, isActive ? styles.active : '')}>
          <PopoverDropdown
            onEdit={() => {
              eventEmit.emit('edit', { key: id });
            }}
            onDelete={() => {
              if (lock) {
                return;
              }
              eventEmit.emit('delete', { key: id });
            }}
          />
          {/* <>
            <EditOutlined
              onClick={e => {
                e.stopPropagation();
                eventEmit.emit('edit', { key: id });
              }}
            />
          </>
          <MinusSquareOutlined
            onClick={e => {
              e.stopPropagation();
              if (lock) {
                return;
              }
              eventEmit.emit('delete', { key: id });
            }}
          /> */}
        </span>
      ) : (
        ''
      )}
    </div>
  );
};
