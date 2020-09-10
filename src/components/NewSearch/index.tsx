import styles from './style.less';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import React, { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

export interface SearchModalProps {
  items: any;
  handleSearch: (value: any) => void;
  handleReset?: () => void;
  className?: string;
}

export interface SearchModalStates {}

export default class NewSearch extends Component<SearchModalProps, SearchModalStates> {
  searchForm = React.createRef<FormInstance>();

  handleSubmit = value => {
    console.log(value);
    this.props.handleSearch(value);
  };

  handleReset = () => {
    this.searchForm && (this.searchForm as any).current.resetFields();
    this.props.handleReset && this.props.handleReset();
  };
  getSelectOps = (val, name) => {
    let option =
      (val &&
        val.length > 0 &&
        val.map((val, idx) => {
          return (
            <Select.Option key={name + (idx + 1)} value={val.value + ''}>
              {val.title}
            </Select.Option>
          );
        })) ||
      [];
    return option;
  };

  render() {
    const { items, className } = this.props;
    const { formItems, initValue } = items;

    return (
      <div className={className}>
        <div className={styles.newSearch}>
          <Form initialValues={initValue} layout="inline" onFinish={this.handleSubmit} ref={this.searchForm}>
            {formItems &&
              formItems.length &&
              formItems.map((item, idx) => {
                if (idx === 0) {
                  item.addClass = 'firstInput';
                }
                if (item.input) {
                  return (
                    <FormItem key={item.name} name={item.name} className={item.addClass}>
                      <Input
                        style={{ width: item.width || 150 }}
                        placeholder={item.input.placeholder || '请输入'}
                        {...item.input}
                      />
                    </FormItem>
                  );
                }
                if (item.select) {
                  return (
                    <FormItem key={item.name} name={item.name} className={item.addClass}>
                      <Select placeholder={item.placeholder || '请选择'} style={{ width: item.width || 110 }}>
                        {item.select.optionValue && this.getSelectOps(item.select.optionValue, item.name)}
                      </Select>
                    </FormItem>
                  );
                }
                if (item.RangePicker) {
                  return (
                    <Form.Item name={item.name} key={item.name} className={item.addClass}>
                      <RangePicker
                        style={{ width: 320 }}
                        showTime={
                          item.RangePicker.showTime
                            ? {
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                              }
                            : {}
                        }
                        format={item.RangePicker.format || 'YYYY-MM-DD HH:mm:ss'}
                        placeholder={item.RangePicker.placeholder || ['开始时间', '结束时间']}
                      />
                    </Form.Item>
                  );
                }
                if (item.custom) {
                  return (
                    <Form.Item name={item.name} key={item.name} className={item.addClass}>
                      {item.custom()}
                    </Form.Item>
                  );
                }
                return <></>;
              })}
            <FormItem>
              <Button type="primary" htmlType="submit">
                <SearchOutlined />
              </Button>
              {/* <Button style={{ marginLeft: 14 }} onClick={this.handleReset} className={styles.resetBtn}>
                重置
              </Button> */}
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
