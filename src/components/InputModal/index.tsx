import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import cls from 'classnames';
import './style.less';

interface IProps {
  modelVisable: boolean;
  title: string;
  handleLoading: boolean;
  handleOk: any;
  handleCancel: any;
  placeholderText?: string;
  inputLabel: string;
  value?: string;
  rules?: Rule[];
  className?: string;
}

interface IState {
  value: string;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

class InputModal extends Component<IProps, IState> {
  formDom: any = null;

  onOk = () => {
    const { handleOk } = this.props;
    this.formDom.validateFields().then(values => {
      handleOk(values.input.trim());
    });
  };

  render() {
    const {
      modelVisable,
      title,
      handleCancel,
      rules,
      handleLoading,
      value,
      placeholderText,
      inputLabel,
      className,
    } = this.props;
    const defaultRules = [
      ({ getFieldValue }) => ({
        validator(rule, value) {
          if (value.trim() !== '') {
            return Promise.resolve();
          }
          return Promise.reject('仅支持15字符以内字母，中文，数字，下划线和空格');
        },
      }),
      {
        pattern: /^[\s0-9a-zA-Z_\u4e00-\u9fa5]{1,15}$/,
        message: '仅支持15字符以内字母，中文，数字，下划线和空格',
      },
    ];

    return (
      <Modal
        title={title}
        visible={modelVisable}
        onOk={this.onOk}
        confirmLoading={handleLoading}
        onCancel={handleCancel}
        destroyOnClose={true}
        keyboard={false}
        maskClosable={false}
        className={cls(['input_modal', className])}
      >
        <Form ref={dom => (this.formDom = dom)} initialValues={{ input: value || '' }} {...layout}>
          <Form.Item name="input" label={inputLabel} rules={rules || defaultRules} hasFeedback>
            <Input placeholder={placeholderText || ''} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default InputModal;
