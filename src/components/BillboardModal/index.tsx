/* eslint-disable no-undef */
import IconFont from '@/components/IconFont';
import { isAscendingArray } from '@/utils/utils';
import { EnumCharType } from '@/components/ColumnAndAnnularChart/charts';
import MultiSelect from './MultiSelect';
import IntervalInputByEdit from './IntervalInputByEdit';
import styles from './style.module.less';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import { noop as _noop } from 'lodash';
import cls from 'classnames';
const { Option } = Select;

function getFrequencyType(list, key) {
  if (!key) return false;
  let resultItem = list.find(item => item.id === key);
  return resultItem.paramType;
}

// eslint-disable-next-line no-undef
const BoardOptions = ({ onChange = _noop, value = EnumCharType.Bar }) => {
  const [type, setType] = useState(value);

  const triggerChange = value => {
    setType(value);
  };

  useEffect(() => {
    onChange(type);
  }, [type]);

  return (
    <div className={styles.boardOptions}>
      <div
        className={cls('boardOptions_item', { active: type === EnumCharType.Bar })}
        onClick={triggerChange.bind(null, 2)}
      >
        <IconFont type={type === 2 ? 'icon-Histogram' : 'icon-Histogram1'} style={{ fontSize: 24, marginBottom: 8 }} />
        柱状图
      </div>
      <div
        className={cls('boardOptions_item', { active: type === EnumCharType.Pie })}
        onClick={triggerChange.bind(null, 1)}
      >
        <IconFont type={type === 1 ? 'icon-Piechart1' : 'icon-Piechart'} style={{ fontSize: 24, marginBottom: 8 }} />
        环形图
      </div>
    </div>
  );
};

export interface Options {
  key: number | string;
  value: string;
}

export interface ModalFormValues {
  name: string;
  frequency: number;
  range: number[];
  chartType: EnumCharType;
  tags: number[];
}

interface IProps {
  title: string;
  id: number;
  handleOk: (values: ModalFormValues) => void;
  handleCancel: () => void;
  frequencyList: EventParam[];
  tagsList: TagGroupDataItem[];
  visible: boolean;
  type?: 'add' | 'edit';
  initialValues?: ModalFormValues;
  loading?: boolean;
  confirmLoading?: boolean;
  checkNameApi?: any;
  flag?: 1 | 2;
}

const BillBoardModal: React.FC<IProps> = ({
  type = 'add',
  title,
  handleOk,
  handleCancel,
  initialValues,
  visible = false,
  frequencyList = [],
  tagsList = [],
  loading,
  confirmLoading,
  checkNameApi,
  id,
  flag,
}) => {
  const [form] = Form.useForm();
  let tagsSelect = useRef();
  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        if (!values.tags) values.tags = [];

        values.tags = values.tags.map(tag => {
          if (typeof tag === 'number') return tag;
          return tag.value;
        });
        values.name = values.name.trim();
        handleOk(values as ModalFormValues);
        // form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const onCancel = () => {
    // form.resetFields();
    handleCancel && handleCancel();
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  if (type === 'edit') {
    // initialValues.tags = getLabelNames(tagsList, initialValues?.tags);
    layout['initialValues'] = initialValues;
  }

  const checkRange = (rule, value) => {
    console.log(value);
    if (value.some(item => item === '' || item === null || typeof item !== 'number')) {
      return Promise.reject('请输入有效数字，区间输入框请保持数字递增');
    }

    if (!isAscendingArray(value)) {
      return Promise.reject('请输入有效数字，区间输入框请保持数字递增');
    }

    return Promise.resolve();
  };

  const checkName = async (rule, value) => {
    value = value.trim();
    const validatorExp = /^[\u4e00-\u9fa5a-zA-Z0-9_\s]{1,15}$/;

    if (!validatorExp.test(value)) {
      return Promise.reject('仅支持15字符以内字母，中文，数字，下划线和空格');
    }

    const res = await checkNameApi({ name: value, id: type === 'edit' ? id : 0 });

    if (res.status === 1) {
      return Promise.resolve();
    } else {
      return Promise.reject(res.error.message || '名称必须唯一');
    }
  };

  const frequencyLabel = flag ? ['分析属性', '分析指标'][flag - 1] : '分析属性';

  // const tagsChange = labels => {
  //   let dom = findDOMNode(tagsSelect.current)!.children![0];
  //   setTimeout(() => {
  //     dom.scrollTop = 24 * dom.children.length - dom.clientHeight;
  //   });
  // };

  return (
    <Modal
      // title={`${title}${type === 'edit' ? '编辑' : '添加'}`}
      title={`${title}编辑`}
      width={650}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      maskClosable={false}
    >
      <Spin spinning={loading !== undefined ? loading : !frequencyList.length || !tagsList.length}>
        <Form {...layout} form={form}>
          <Form.Item
            name="name"
            label="名称"
            validateTrigger="onBlur"
            validateFirst={true}
            rules={[{ required: true, message: '名称不能为空' }, { validator: checkName }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="frequency"
            label={frequencyLabel}
            rules={[{ required: true, message: `${frequencyLabel}不能为空` }]}
          // extra={<p style={{ margin: 0 }}>看板将展示数量最多的前10个值，剩余值将以“其他”展示</p>}
          >
            <Select placeholder="请选择">
              {frequencyList.map((item, index) => (
                <Option key={`frequency_${index}`} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.frequency !== currentValues.frequency}
          >
            {({ getFieldValue }) => {
              if (getFieldValue('frequency')) {
                let frequencyType = getFrequencyType(frequencyList, getFieldValue('frequency'));
                return (
                  <>
                    {frequencyType === 'NUMBER' && (
                      <Form.Item
                        name="range"
                        label="统计区间"
                        validateTrigger="onBlur"
                        rules={[{ validator: checkRange }]}
                        style={{ marginBottom: 10 }}
                      >
                        <IntervalInputByEdit />
                      </Form.Item>
                    )}
                    <Form.Item wrapperCol={{ span: 20, offset: 4 }} style={{ margin: '-24px 0 24px' }}>
                      <span>
                        {frequencyType === 'NUMBER'
                          ? '未在区间中的结果将展示为将展示为“未知”'
                          : '看板将展示数量最多的前10个值，剩余值将以“其他”展示'}
                      </span>
                    </Form.Item>
                  </>
                );
              }
            }}
          </Form.Item>
          <Form.Item
            name="chartType"
            label="看板类型"
            // style={{ marginTop: -16 }}
            rules={[{ required: true, message: '看板类型不能为空' }]}
          >
            <BoardOptions />
          </Form.Item>
          <Form.Item name="tags" label="筛选标签">
            <MultiSelect options={tagsList} />
            {/* <Select
              ref={tagsSelect}
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请输入搜索关键字"
              onChange={tagsChange}
            >
              {tagsList.map((item, index) => (
                <Option key={item.name}>{item.name}</Option>
              ))}
            </Select> */}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default BillBoardModal;
