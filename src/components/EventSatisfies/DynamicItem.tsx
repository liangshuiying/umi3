import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Select, Button, Input, DatePicker, InputNumber } from 'antd';
import cls from 'classnames';
import {
  map as _map,
  forEach as _forEach,
  find as _find,
  debounce as _debounce,
  filter as _filter,
  includes as _includes,
  replace as _replace,
  get as _get,
  isNaN as _isNaN,
} from 'lodash';
import moment, { Moment } from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RangeValue } from 'rc-picker/es/interface';
import { EnumRuleType } from '@/pages/Market/EventManage/Rule/typing';
import { EnumParamType, ParamEntity, ParamEnum } from '@/pages/Market/EventManage/Param/typing';
import TagInput from '@/components/TagInput';
import StrBetweenInput from '@/components/BetweenInput/StrInput';
import { IDataItem } from '@/components/TagInput/typing';
import { isDigit } from '@/utils/utils';
import styles from './index.module.less';
import { TypeRelatioinFunction } from './typing';
import { getDateTimeOps } from './utils';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface IDynamicItemProps {
  type?: EnumRuleType;
  count: number;
  params?: (string | undefined)[];
  function: TypeRelatioinFunction;
  options: ParamEntity[];
  disableFuture?: boolean;
  timeFormat?: string;
  field: string;
  onChange: (field: string, val: any) => void;
  onDel: () => void;
  eventName?: string;
  filterSeed?: string;
}

interface IDynamicItemStates {
  dateType: 'old' | 'future' | string; //过去、未来
  dateRange: 'in' | 'out' | string;  //之内、之后
}

class DynamicItem extends React.Component<IDynamicItemProps, IDynamicItemStates> {
  dateTimeOps = {} as any;

  constructor(props: IDynamicItemProps) {
    super(props);
    const { field, params, options } = this.props;
    let { function: f } = this.props;
    const targetOperation = _find(options, { paramKey: field });
    let dateType = '', dateRange = '';
    if (targetOperation && targetOperation.paramType && (targetOperation.paramType === 'DATETIME' || targetOperation.paramType === 'DATE')) {
      this.dateTimeOps = getDateTimeOps(targetOperation, field);
      dateType = this.computedDateType(f, params);
      dateRange = this.getDateRange(f);
    }
    this.state = {
      dateType,
      dateRange
    }
    this.deboundChangeParamValue = _debounce(this.deboundChangeParamValue, 200);
  }

  //获取初始dateType
  computedDateType = (f: TypeRelatioinFunction, params: IDynamicItemProps['params']) => {
    let dateType = '' as IDynamicItemStates['dateType'];
    if (f === 'absoluteBetween') {
      dateType = '';
    } else if (f === 'relativeFutureWithin' || f === 'relativeFutureAfter') {
      dateType = 'future'
    } else if (f === 'relativeWithin' || f === 'relativeBefore') {
      dateType = 'old'
    } else if (f === 'relativeBetween') {
      if (params && params.length) { // 负号代表未来
        const [start, end, unit] = params || [];
        if (unit !== void 0 && start !== void 0 && end !== void 0 && (start.startsWith('-') || end.startsWith('-'))) {
          dateType = 'future';
        } else {
          dateType = 'old';
        }
      }
    }
    return dateType;
  };

  //获取初始dateRange
  getDateRange = (f) => {
    let dateRange = '' as IDynamicItemStates['dateRange'];
    if (f === 'absoluteBetween' || f === 'relativeBetween') {
      dateRange = ''
    }
    if (f === 'relativeFutureAfter' || f === 'relativeBefore') {
      dateRange = 'out';
    }
    if (f === 'relativeWithin' || f === 'relativeFutureWithin') {
      dateRange = 'in';
    }
    return dateRange;
  }

  handleChangeOperation = (newF: TypeRelatioinFunction, param?: ParamEntity) => {
    if (param) {
      // 时间类型 并且 操作符为 relativeBetween，重置过去未来
      if (param.paramType === 'DATE' || param.paramType === 'DATETIME') {
        if (newF === 'relativeBetween') {
          this.setState({
            dateType: 'old',
          });
        } else if (!_includes(newF, 'between')) {
          this.setState({
            dateType: 'old',
            dateRange: 'in',
          });
        }
      }
    }
    this.props.onChange('function', newF);
  };
  /**
   * 生成操作符选择器
   * @param eventItem 事件详情
   * @param paramItem 参数详情
   */
  generateOperation = () => {
    let { field, function: f, options } = this.props;
    const targetOperation = _find(options, { paramKey: field });
    let selected: TypeRelatioinFunction[] = [];
    let optionDoms: React.ReactNode[] = [];

    if (targetOperation) {
      if (targetOperation.paramType === 'DATETIME' || targetOperation.paramType === 'DATE') {
        this.dateTimeOps = getDateTimeOps(targetOperation, field);
        selected = this.dateTimeOps.res;
        Object.entries(selected).map(([key, value]) => {
          optionDoms.push(
            <Option value={key} key={`Option_${key}`}>
              {value as any}
            </Option>
          );
        })

        //不是绝对时间区间 和 相对当前时间区间 就是相对当前时间点
        if (f !== 'absoluteBetween' && f !== 'relativeBetween') {
          f = 'relativeWithin'
        }
      } else {
        selected = targetOperation.functions;
        selected.length && selected.map((item) => {
          optionDoms.push(
            <Option key={item.code} value={item.code}>
              {item.name}
            </Option>,
          );
        })
      }
    }

    const paramType = _get(targetOperation, 'paramType');

    const selectCls = cls(styles.comparisonWrap, {
      [styles.comparisonTimeWrap]: paramType === 'DATE' || paramType === 'DATETIME',
    });

    return (
      <Select
        placeholder="请选择"
        value={f}
        className={selectCls}
        onChange={newF => this.handleChangeOperation(newF, targetOperation)}
      >
        {optionDoms}
      </Select>
    );
  };

  handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isDigit(value)) {
      this.handleChangeParamValue([]);
    } else {
      const valStr = `${value}`;
      if (valStr.length > 40) {
        return;
      }
      this.handleChangeParamValue([`${value}`]);
    }
  };

  handleRemoveStrNum = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '-' || value === '.') {
      this.handleChangeParamValue([]);
    }
  };

  handleChangeParamValue = (value: string[]) => {
    this.props.onChange('params', value);
  };

  handleChangeParamNumberValue = (value: string[]) => {
    const filterVal = _filter(value, val => {
      return isDigit(val);
    });
    const less40Value: string[] = [];
    _forEach(filterVal, val => {
      if (val.length > 40) {
        const tmp = _replace(val, /^(.{40})(.*)$/, (_, p1) => p1);
        if (_includes(filterVal, tmp)) {
          return; // lodash continue
        }
        less40Value.push(tmp);
      } else {
        less40Value.push(val);
      }
    });
    this.props.onChange('params', less40Value);
  };

  deboundChangeParamValue = (val: string[]) => {
    this.handleChangeParamValue(val);
  };

  generateValueOptionView = () => {
    const { params, field, function: f, timeFormat = 'HH:mm:ss', type = EnumRuleType.TAG, options } = this.props;
    const targetOperation = _find(options, { paramKey: field });
    const { relFuture = [], relOld = [], relOldAndFuture = [], relWith = [] } = this.dateTimeOps;
    //console.log('targetOperation===========', targetOperation)
    if (targetOperation && targetOperation.paramType) {
      switch (targetOperation.paramType) {
        //TEXT 为 STRING
        case EnumParamType.TEXT:
          if (_includes(['isEmpty', 'isNotEmpty'], f)) {
            return <div className={styles.timePickerWrap}>&nbsp;</div>;
          }
          // 包含与不包含单值输入
          if (_includes(['contain', 'notContain'], f)) {
            const [val] = params || [];
            return (
              <Input
                placeholder="请输入"
                style={{ width: '100%' }}
                defaultValue={val}
                onChange={e => this.deboundChangeParamValue([e.target.value])}
              />
            );
          }
          // 多值输入
          return <TagInput mode="tags" value={params as string[]} onChange={this.handleChangeParamValue} />;
        case EnumParamType.ENUM: {
          if (_includes(['isEmpty', 'isNotEmpty'], f)) {
            return <div className={styles.timePickerWrap}>&nbsp;</div>;
          }

          let enumDataTemp: ParamEnum[] = [];
          if (targetOperation.enumList && targetOperation.enumList.length) {
            enumDataTemp = targetOperation.enumList;
          }
          const enumData = _map<ParamEnum, IDataItem>(enumDataTemp, item => ({
            key: item.enumKey,
            value: item.enumValue,
          }));

          _forEach(params, p => {
            const isExist = _find(enumDataTemp, { enumKey: p });
            if (!isExist) {
              enumData.push({
                key: p as string,
                value: p as string,
              });
            }
          });

          // 包含与不包含单值输入
          if (_includes(['contain', 'notContain'], f)) {
            return (
              <TagInput
                valueType={EnumParamType.ENUM}
                mode="tags"
                data={enumData}
                value={params as string[]}
                onChange={this.handleChangeParamValue}
                maxTagCount={1}
              />
            );
          }

          // 多值选择
          return (
            <TagInput
              mode="tags"
              valueType={EnumParamType.ENUM}
              data={enumData}
              value={params as string[]}
              onChange={this.handleChangeParamValue}
            />
          );
        }
        case EnumParamType.NUM: {
          // 区间只有单值 单值输入
          if (f === 'between') {
            return (
              <StrBetweenInput value={params as string[]} onChange={newVal => this.handleChangeParamValue(newVal)} />
            );
          }
          // 大于、小于 单值输入
          if (['less', 'greater'].includes(f)) {
            const inputVal = params ? params[0] : '';
            return (
              <Input
                maxLength={40}
                placeholder="请输入"
                style={{ width: '100%' }}
                value={inputVal}
                onChange={this.handleChangeNumber}
                onBlur={this.handleRemoveStrNum}
              />
            );
          }

          if (['equal', 'notEqual'].includes(f)) {
            // 等于、不等于 多值输入
            const enumData = _map<string, IDataItem>(params as string[], item => ({
              key: item,
              value: item,
            }));
            return (
              <TagInput
                mode="tags"
                data={enumData}
                value={params as string[]}
                onChange={this.handleChangeParamNumberValue}
              />
            );
          }

          return <div className={styles.timePickerWrap}>&nbsp;</div>;
        }
        case EnumParamType.DATE:
        case EnumParamType.DATETIME: {
          if (f === 'absoluteBetween') { //绝对时间区间
            let val: RangeValue<Moment> = null;
            if (params && params.length) {
              val = _map(params, p => moment(p as string, `YYYY-MM-DD ${timeFormat}`)) as [Moment, Moment];
            }
            return (
              <div className={styles.timePickerWrap}>
                在
                <RangePicker
                  value={val}
                  className={styles.timePicker}
                  separator="至"
                  onChange={this.handleChangeRangePicker}
                  placeholder={['起始时间', '结束时间']}
                  showTime={{ format: timeFormat }}
                  format={`YYYY-MM-DD ${timeFormat}`}
                />
                之内
              </div>
            );
          } else if (f === 'relativeBetween') {// 相对当前时间区间
            let [start, end, unit] = params || [];
            if (unit !== 'day') {
              start = void 0;
              end = void 0;
            }
            let dateType = '';
            if (unit !== void 0 && start !== void 0 && end !== void 0 && (start.startsWith('-') || end.startsWith('-'))) {
              dateType = 'future';
            } else {
              dateType = 'old';
            }

            return (
              <div className={styles.timePickerWrap}>
                <span>在</span>
                <Select
                  key="relative"
                  disabled={!!this.props.disableFuture}
                  style={{ width: 70, marginLeft: 8 }}
                  value={this.state.dateType || dateType}
                  onChange={this.changeDateType}
                >
                  {
                    relWith && relWith.length && relWith.map((item) => {
                      return <Option value={item.key} key={item.key}>{item.value}</Option>
                    })
                  }
                </Select>
                <InputNumber
                  min={1}
                  style={{ marginLeft: 8, marginRight: 8, flex: 1 }}
                  value={start ? Math.abs(parseFloat(start)) : undefined}
                  onChange={v => this.handleChangeRelativeBetweenValue(v, 0)}
                />
                天至{(this.state.dateType === 'old' || dateType === 'old') ? '过去' : '未来'}
                <InputNumber
                  min={1}
                  style={{ marginLeft: 8, marginRight: 8, flex: 1 }}
                  value={end ? Math.abs(parseFloat(end)) : undefined}
                  onChange={v => this.handleChangeRelativeBetweenValue(v, 1)}
                />
                天 之内
              </div>
            );
          } else if (f) { // 相对当前时间点
            // 最复杂的部分
            let [val, unit] = params || [];
            if (unit !== 'day') {
              val = void 0;
            }
            let dateType = '', dateRange = '';
            if (f === 'relativeWithin') {
              dateType = 'old';
              dateRange = 'in';
            } else if (f === 'relativeBefore') {
              dateType = 'old';
              dateRange = 'out';
            } else if (f === 'relativeFutureWithin') {
              dateType = 'future';
              dateRange = 'in';
            } else {
              dateType = 'future';
              dateRange = 'out';
            }
            const specialStyle: React.CSSProperties = { width: 70, marginLeft: 8 };
            if (type === EnumRuleType.ANALYSIS) {
              specialStyle.display = 'none';
            }
            return (
              <div className={styles.timePickerWrap}>
                <span>在</span>
                <Select
                  key="one"
                  style={specialStyle}
                  value={this.state.dateType || dateType}
                  onChange={this.handleChangeRelativeDateType}
                >
                  {
                    relOldAndFuture && relOldAndFuture.length && relOldAndFuture.map((item) => {
                      return <Option value={item.key} key={item.key}>{item.value}</Option>
                    })
                  }
                </Select>
                <InputNumber
                  min={1}
                  value={val ? Math.abs(parseFloat(val)) : undefined}
                  style={{ flex: 1, marginLeft: 8, marginRight: 8 }}
                  onChange={this.handleChangeRelativeValue}
                />
                天
                <Select
                  style={{ width: 70, marginLeft: 8 }}
                  value={this.state.dateRange || dateRange}
                  onChange={this.changeDateRange}
                >
                  {
                    (this.state.dateType === 'old' || dateType === 'old') ?
                      relOld && relOld.length && relOld.map((item) => {
                        return <Option value={item.key} key={item.key}>{item.value}</Option>
                      })
                      :
                      relFuture && relFuture.length && relFuture.map((item) => {
                        return <Option value={item.key} key={item.key}>{item.value}</Option>
                      })
                  }
                </Select>
              </div>
            );
          }
          return null;
        }
        case EnumParamType.BOOL: {
          return <div className={styles.timePickerWrap}>&nbsp;</div>
        }
        default: {
          return <div className={styles.timePickerWrap}>& nbsp;</div >;
        }
      }
    }
    return null;
  };

  handleChangeRelativeDateType = (dateType: IDynamicItemStates['dateType']) => {
    let dateRange = '' as IDynamicItemStates['dateRange'];
    if (dateType === 'old') {
      dateRange = this.dateTimeOps.relOld[0].key ? this.dateTimeOps.relOld[0].key : 'in';
    } else {
      dateRange = this.dateTimeOps.relFuture[0].key ? this.dateTimeOps.relFuture[0].key : 'in';
    }
    this.setState(
      {
        dateType,
        dateRange
      },
      () => {
        let newF: TypeRelatioinFunction;
        // relativeBefore, relativeWithin,relativeFutureAfter,relativeFutureWithin
        if (dateType === 'old') {
          newF = dateRange === 'in' ? 'relativeWithin' : 'relativeBefore';
        } else {
          newF = dateRange === 'in' ? 'relativeFutureWithin' : 'relativeFutureAfter';
        }
        this.props.onChange('function', newF);
      },
    );
  };

  handleChangeRelativeValue = (val: any) => {
    if (_isNaN(val) && (val !== void 0 || val !== null || val !== '')) {
      return;
    }
    const { onChange, params } = this.props;
    // val 可能的情况有: number '' null void 0
    // old 为正值，future 为负值
    const newParams = [...(params || [])];
    let [, unit] = newParams;
    if (unit === void 0) {
      // 如果填写，添加单位，更改当前修改位置值
      if (!(val === '' || val === void 0 || val === null)) {
        newParams[0] = `${val}`;
        newParams[1] = 'day';
      }
    } else {
      // 如果当前位置不填写值
      if (val === '' || val === void 0 || val === null) {
        newParams.length = 0;
      } else {
        newParams[0] = `${val}`;
      }
    }

    onChange('params', newParams);
  };

  handleChangeRelativeBetweenValue = (val: any, position: 0 | 1) => {
    if (_isNaN(val) && (val !== void 0 || val !== null || val !== '')) {
      return;
    }
    const { onChange, params } = this.props;
    // val 可能的情况有: number '' null void 0
    // old 为正值，future 为负值
    const newParams = [...(params || [])];
    let [, , unit] = newParams;
    // 如果所有位置为空
    if (unit === void 0) {
      // 如果填写，添加单位，更改当前修改位置值
      if (!(val === '' || val === void 0 || val === null)) {
        newParams[position] = this.state.dateType === 'old' ? `${val}` : `-${val}`;
        newParams[2] = 'day';
      }
    } else {
      // 如果当前位置不填写值
      if (val === '' || val === void 0 || val === null) {
        const otherPositionVal = newParams[1 - position];
        // 如果另外一个位置的值也为空，则置空参数值，否则修改当前修改位置为 void 0
        if (otherPositionVal === '' || otherPositionVal === void 0) {
          newParams.length = 0;
        } else {
          newParams[position] = void 0;
        }
      } else {
        // 如果当前位置填写
        newParams[position] = this.state.dateType === 'old' ? `${val}` : `-${val}`;
      }
    }

    onChange('params', newParams);
  };

  changeDateType = (dateType: IDynamicItemStates['dateType']) => {
    this.setState(
      {
        dateType,
      },
      () => {
        this.props.onChange('params', []);
      },
    );
  };

  changeDateRange = (dateRange: IDynamicItemStates['dateRange']) => {
    console.log('dateRange=============', dateRange)
    this.setState(
      {
        dateRange,
      },
      () => {
        // relativeWithin: string; // 相对当前时间点 过去 之内
        // relativeBefore: string; // 相对当前时间点 过去 之前
        // relativeFutureWithin: string; // 相对当前时间点 未来 之内
        // relativeFutureAfter: string; // 相对当前时间点 未来 之后
        let newF: TypeRelatioinFunction = 'relativeWithin';
        if (this.state.dateType === 'old') {
          newF = dateRange === 'in' ? 'relativeWithin' : 'relativeBefore';
        } else {
          newF = dateRange === 'out' ? 'relativeFutureAfter' : 'relativeFutureWithin';
        }
        console.log('newF============', newF)
        this.props.onChange('function', newF);
      },
    );
  };

  handleChangeRangePicker = (_: RangeValue<Moment>, dateStr: [string, string]) => {
    this.props.onChange('params', dateStr);
  };

  handleDelParam = () => {
    // 删除操作
    this.props.onDel();
  };

  handleChangeOption = (newOption: string) => {
    const { options } = this.props;
    const targetOption = _find(options, { paramKey: newOption });
    if (targetOption) {
      this.props.onChange('field', { field: newOption, cname: targetOption.name, type: targetOption.paramType });
    }
  };

  filterOption = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  render() {
    const { field, count, options } = this.props;
    return (
      <div className={styles.paramItemWrap}>
        <div className={styles.paramContent}>
          <span className={styles.paramIndex}>参数{count}</span>
          <Select
            showSearch
            value={field}
            className={styles.paramSelect}
            placeholder="请选择参数"
            onChange={this.handleChangeOption}
            filterOption={this.filterOption}
          >
            {_map(options, originParam => {
              return (
                <Option value={originParam.paramKey} key={originParam.paramKey}>
                  {originParam.name}
                </Option>
              );
            })}
          </Select>
        </div>
        {field ? (
          <>
            {this.generateOperation()}
            {this.generateValueOptionView()}
          </>
        ) : null}
        <div className={styles.paramActionWrap}>
          <Button
            className={styles.paramActionDelete}
            icon={<DeleteOutlined />}
            type="link"
            size="small"
            onClick={() => this.handleDelParam()}
          />
        </div>
      </div>
    );
  }
}

export default DynamicItem;
