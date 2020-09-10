import React from 'react';
import { noop as _noop } from 'lodash';
import { CheckOutlined } from '@ant-design/icons';
import { arrayTreeFilter } from '../util';
import styles from './Menus.module.less';
import { CascaderOption, CascaderFieldNames } from './Cascader';

interface MenusProps {
  value?: string[];
  options?: CascaderOption[];
  prefixCls?: string;
  expandTrigger?: string;
  onSelect?: (targetOption: CascaderOption, index: number, e: React.KeyboardEvent<HTMLElement>) => void;
  visible?: boolean;
  dropdownMenuColumnStyle?: React.CSSProperties;
  defaultFieldNames?: CascaderFieldNames;
  fieldNames?: CascaderFieldNames;
  expandIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  onItemDoubleClick?: (targetOption: CascaderOption, index: number, e: React.MouseEvent<HTMLElement>) => void;
}

interface MenuItems {
  [index: number]: HTMLLIElement;
}
class Menus extends React.Component<MenusProps> {
  menuItems: MenuItems = {};

  delayTimer: number | null;

  constructor(props: MenusProps) {
    super(props);
    this.delayTimer = null;
  }

  static defaultProps: MenusProps = {
    options: [],
    value: [],
    onSelect: _noop,
    onItemDoubleClick: _noop,
    prefixCls: 'rc-cascader-menus',
    visible: false,
    expandTrigger: 'click',
  };

  componentDidMount() {
    this.scrollActiveItemToView();
  }

  componentDidUpdate(prevProps: MenusProps) {
    if (!prevProps.visible && this.props.visible) {
      this.scrollActiveItemToView();
    }
  }

  getFieldName = (name: string) => {
    const {
      fieldNames,
      defaultFieldNames = {
        label: 'label',
        value: 'value',
        children: 'children',
      },
    } = this.props;
    // 防止只设置单个属性的名字
    if (fieldNames) {
      return fieldNames[name];
    }
    return defaultFieldNames[name];
  };

  getOption = (option: CascaderOption, menuIndex: number, deep: number) => {
    const {
      prefixCls,
      expandTrigger,
      expandIcon,
      loadingIcon,
      onSelect: propOnSelect = _noop,
      onItemDoubleClick: propOnItemDoubleClick = _noop,
    } = this.props;
    const onSelect = (e: React.KeyboardEvent<HTMLElement>) => propOnSelect(option, menuIndex, e);
    const onItemDoubleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
      propOnItemDoubleClick(option, menuIndex, e);
    let expandProps: any = {
      onClick: onSelect,
      onDoubleClick: onItemDoubleClick,
    };
    let menuItemCls = `${prefixCls}-menu-item ${styles.menuItem}`;
    let expandIconNode: React.ReactNode = null;
    const hasChildren = option[this.getFieldName('children')] && option[this.getFieldName('children')].length > 0;
    if (hasChildren || option.isLeaf === false) {
      menuItemCls += ` ${prefixCls}-menu-item-expand`;
      if (!option.loading) {
        expandIconNode = <span className={`${prefixCls}-menu-item-expand-icon`}>{expandIcon}</span>;
      }
    }
    if (expandTrigger === 'hover' && (hasChildren || option.isLeaf === false)) {
      expandProps = {
        onMouseEnter: () => this.delayOnSelect(onSelect),
        onMouseLeave: this.delayOnSelect,
        onClick: onSelect,
      };
    }
    let selectedIconNode: React.ReactNode = null;
    if (this.isActiveOption(option, menuIndex)) {
      menuItemCls += ` ${prefixCls}-menu-item-active`;
      expandProps.ref = this.saveMenuItem(menuIndex);
      if (menuIndex === deep) {
        selectedIconNode = <CheckOutlined />;
      }
    }
    if (option.disabled) {
      menuItemCls += ` ${prefixCls}-menu-item-disabled`;
    }

    let loadingIconNode: React.ReactNode = null;
    if (option.loading) {
      menuItemCls += ` ${prefixCls}-menu-item-loading`;
      loadingIconNode = loadingIcon || null;
    }

    let title = '';
    if ('title' in option) {
      // eslint-disable-next-line prefer-destructuring
      title = option.title;
    } else if (typeof option[this.getFieldName('label')] === 'string') {
      title = option[this.getFieldName('label')];
    }

    return (
      <li
        key={option[this.getFieldName('value')]}
        className={menuItemCls}
        title={title}
        {...expandProps}
        role="menuitem"
        onMouseDown={e => e.preventDefault()}
      >
        {option[this.getFieldName('label')]}
        {expandIconNode}
        {loadingIconNode}
        {selectedIconNode}
      </li>
    );
  };

  getActiveOptions = (values?: CascaderOption[]): CascaderOption[] => {
    const { options = [] } = this.props;
    const activeValue = values || this.props.value || [];
    return arrayTreeFilter(options, (o, level) => o[this.getFieldName('value')] === activeValue[level], {
      childrenKeyName: this.getFieldName('children'),
    });
  };

  getShowOptions = (): CascaderOption[][] => {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption[this.getFieldName('children')])
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
  };

  delayOnSelect = (onSelect, ...args) => {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    if (typeof onSelect === 'function') {
      this.delayTimer = window.setTimeout(() => {
        onSelect(args);
        this.delayTimer = null;
      }, 150);
    }
  };

  scrollActiveItemToView = () => {
    // scroll into view
    const optionsLength = this.getShowOptions().length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < optionsLength; i++) {
      const itemComponent = this.menuItems[i];
      if (itemComponent && itemComponent.parentElement) {
        itemComponent.parentElement.scrollTop = itemComponent.offsetTop;
      }
    }
  };

  isActiveOption = (option: CascaderOption, menuIndex: number) => {
    const { value = [] } = this.props;
    return value[menuIndex] === option[this.getFieldName('value')];
  };

  saveMenuItem = (index: number) => (node: HTMLLIElement) => {
    this.menuItems[index] = node;
  };

  render() {
    const { prefixCls, dropdownMenuColumnStyle } = this.props;
    const optionsArr = this.getShowOptions();
    return (
      <div>
        {optionsArr.map((options, menuIndex) => (
          <ul className={`${prefixCls}-menu`} key={menuIndex} style={dropdownMenuColumnStyle}>
            {options.map(option => this.getOption(option, menuIndex, optionsArr.length - 1))}
          </ul>
        ))}
      </div>
    );
  }
}

export default Menus;
