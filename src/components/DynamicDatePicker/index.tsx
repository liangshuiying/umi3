/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getAbsCoordinates } from '@/utils/utils';
import * as styles from './index.module.less';
import React from 'react';
import { createPortal } from 'react-dom';

import { DatePicker, Button, InputNumber, Input, message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import cls from 'classnames';
import './style.less';
import { auto } from '@/pages/Members/MarkTag/styles/tagCard.module.less';

const { RangePicker } = DatePicker;

export interface DatePickerData {
  type: 'fix' | 'dynamic';
  value: string | [string, string];
}

interface DynamicDatePickerPorps {
  placeholder?: string;
  data?: DatePickerData;
  onConfirm?: (data: DatePickerData) => void;
}

interface DynamicDatePickerState {
  type: 'fix' | 'dynamic';
  dspValue: string;
  hidePickerBody: boolean;
}

export const DYNAMIC_DATE_OPTION_DICT: {
  [key: string]: {
    name: string;
    unit: 'days' | 'months' | 'weeks';
    offset: null | number;
  };
} = {
  today: {
    name: '今日',
    unit: 'days',
    offset: 0,
  },
  yesterday: {
    name: '昨日',
    unit: 'days',
    offset: 1,
  },
  oldSevenDay: {
    name: '过去7天',
    unit: 'days',
    offset: 7,
  },
  week: {
    name: '本周',
    unit: 'weeks',
    offset: 0,
  },
  lastWeek: {
    name: '上周',
    offset: 1,
    unit: 'weeks',
  },
  oldThirtyDay: {
    name: '过去30天',
    offset: 30,
    unit: 'days',
  },
  month: {
    name: '本月',
    offset: 0,
    unit: 'months',
  },
  lastMonth: {
    name: '上月',
    offset: 1,
    unit: 'months',
  },
  oldNinety: {
    name: '过去90天',
    offset: 90,
    unit: 'days',
  },
  custom: {
    name: '自定义',
    offset: null,
    unit: 'days',
  },
};

export const DSP_SPLIT_FLAG = '--';

export class DynamicDatePicker extends React.PureComponent<DynamicDatePickerPorps, DynamicDatePickerState> {
  constructor(props: DynamicDatePickerPorps) {
    super(props);
    this.init();
  }

  private init() {
    const { data } = this.props;
    let value = '';
    if (data) {
      const { value: val, type } = data;
      if (type === 'fix') {
        value = (val as string[]).join(DSP_SPLIT_FLAG);
      } else {
        value = val as string;
      }
      // value = this.formatDynamicDate(val as string);
    }

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state = {
      dspValue: value,
      type: data?.type || 'fix',
      hidePickerBody: true,
    };
  }

  private handleInputClick = e => {
    this.setState({ hidePickerBody: false });
  };

  private isPositiveInteger = (v: string) => {
    const r = /^\+?[1-9][0-9]*$/;
    if (!r.test(v)) {
      // 非正整数
      return false;
    }

    return true;
  };

  private onConfrim = (data: DatePickerData) => {
    console.log('ssss=============', data)
    const { onConfirm } = this.props;
    const { value, type } = data;
    if (Array.isArray(value)) {
      this.setState(
        {
          dspValue: value.join('--'),
          hidePickerBody: true,
          type,
        },
        () => {
          onConfirm && onConfirm(data);
        },
      );
      return;
    }
    let val = '' as any, valArr = [] as any;
    if (isNaN(parseFloat(value))) {
      val = DYNAMIC_DATE_OPTION_DICT[value].name;
    } else {
      if (!this.isPositiveInteger(value)) {
        return message.error('自定义天数必须是正整数');
      }
      valArr[0] = parseInt(value);
      valArr[1] = 'day';
      data.value = valArr;

    }
    let vals = valArr.length > 0 ? valArr : val

    this.setState({ dspValue: vals, hidePickerBody: true, type }, () => {
      onConfirm && onConfirm(data);
    });

    return;
  };

  private formatDynamicDate = (dspValue: string) => {
    const key = this.convertDspValueToKey(dspValue);
    const tDate = DYNAMIC_DATE_OPTION_DICT[key];
    if (tDate) {
      const { offset, unit, name } = tDate;
      return `${name} | ` + this.doFormat(offset as number, unit);
    }
    const offset = parseInt(dspValue);
    return `过去${offset}天 | ` + this.doFormat(offset, 'days', true);
  };

  private getDays = (m: number) => {
    const d = new Date();
    const y = d.getFullYear();
    return new Date(y, m + 1, 0).getDate();
  };

  private getEndDate = (offset: number) => {
    return moment()
      .subtract(offset, 'days')
      .format('YYYY-MM-DD');
  };

  private doFormat = (offset: number, unit: 'days' | 'months' | 'weeks', isCustom = false): string => {
    const currentDate1 = moment();
    const d = new Date();
    let end = '';
    if (unit === 'months') {
      const days = this.getDays(d.getMonth());
      const currentDay = d.getDate();
      if (offset > 0) {
        end = this.getEndDate(currentDay);
        offset = offset * days + currentDay;
      } else {
        offset = currentDay - 1;
      }
      unit = 'days';
    } else if (unit === 'weeks') {
      let currentWeek = d.getDay();
      if (offset > 0) {
        end = this.getEndDate(currentWeek);
      }
      offset = offset * 7 + currentWeek - 1;
      unit = 'days';
    } else {
      if (offset > 0) {
        end = this.getEndDate(1);
      }
    }
    if (!end) {
      end = moment().format('YYYY-MM-DD');
    }
    if (isCustom) {
      end = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');
    }

    const start = currentDate1.subtract(offset, unit).format('YYYY-MM-DD');
    return `${start}${DSP_SPLIT_FLAG}${end}`;
  };


  private convertDspValueToKey = (dspValue: string) => {
    let type;
    if (!this.state) {
      type = 'dynamic';
    } else {
      type = this.state.type;
    }
    let value = dspValue;
    if (type === 'dynamic') {
      for (let key in DYNAMIC_DATE_OPTION_DICT) {
        const v = DYNAMIC_DATE_OPTION_DICT[key].name;
        if (v === dspValue) {
          value = key;
          break;
        }
      }
    }
    return value;
  };

  private handleClickMark = () => {
    this.setState({ hidePickerBody: true });
  };

  private pickerBoxRef = React.createRef();

  render() {
    const { dspValue, hidePickerBody, type } = this.state;
    const { left, top, scrollTop } = getAbsCoordinates(this.pickerBoxRef.current);
    let newTop = top - 350;
    if (scrollTop > 200) {
      newTop = top - scrollTop + 30;
    } else if (scrollTop > 0) {
      newTop = top - scrollTop - 350;
    }
    const PortalDatePickerPanel = createPortal(
      <DynamicDatePickerPanel
        data={{ value: this.convertDspValueToKey(dspValue), type }}
        onConfirm={this.onConfrim}
        style={{ left, top: newTop }}
      />,
      document.querySelector('.ant-layout'),
    );

    return (
      <div className={styles.wrapper}>
        {hidePickerBody ? null : <div className={styles.mark} onClick={this.handleClickMark}></div>}
        <div className={styles.pickerBox} title={dspValue}>
          <div ref={this.pickerBoxRef} className={styles.inputPicker}>
            <Input
              value={type === 'dynamic' ? this.formatDynamicDate(dspValue) : dspValue}
              onClick={this.handleInputClick}
            // onChange={this.handleInputChange}
            // onBlur={this.handleBlur}
            />
          </div>
          <span className={styles.pickerSuffix}>
            <CalendarOutlined />
          </span>
        </div>
        {!hidePickerBody ? PortalDatePickerPanel : null}
      </div>
    );
  }
}

interface DynamicDatePickerPanelProps {
  data: DatePickerData;
  style?: { left: number; top: number };
  onConfirm: (data: DatePickerData) => void;
}

interface DynamicDatePickerPanelState {
  tabType: 'fix' | 'dynamic';
  openPickerBox: boolean;
  dynamicDateType: string;
  customDays: number;
  rangePickerVal: [Moment?, Moment?];
}

// NOTE: 内部使用不像外暴露
class DynamicDatePickerPanel extends React.PureComponent<DynamicDatePickerPanelProps, DynamicDatePickerPanelState> {
  constructor(props: DynamicDatePickerPanelProps) {
    super(props);
    this.initState();
  }

  private getWrapperClsName = () => {
    const { tabType } = this.state;
    return tabType === 'dynamic' ? `${styles.dynamic} ${styles.container}` : `${styles.fix} ${styles.container}`;
  };

  private initState = () => {
    const { data } = this.props;
    let tabType: 'fix' | 'dynamic' = 'fix';
    let dynamicDateType = 'today';
    let customDays = 0;
    let rangePickerVal: [Moment?, Moment?] = [];
    if (data) {
      const { value, type } = data;
      tabType = type;
      if (tabType === 'dynamic') {
        if (!DYNAMIC_DATE_OPTION_DICT[value as string]) {
          dynamicDateType = 'custom';
          customDays = parseFloat(value as string);
        } else {
          dynamicDateType = value as string;
        }
      } else {
        if (value) {
          const v = typeof value === 'string' ? value.split(DSP_SPLIT_FLAG) : value;
          const [start, end] = v;
          rangePickerVal = [moment(start), moment(end)];
        }
      }
    }
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state = {
      tabType,
      openPickerBox: true,
      dynamicDateType,
      customDays,
      rangePickerVal,
    };
  };

  private handleClickEvent = (type) => {
    const { tabType } = this.state;
    if (tabType === type) {
      return;
    }
    this.setState({ tabType: type, openPickerBox: true });
  };

  private getPickerPopupContainer = (trigger: HTMLElement) => {
    return trigger.parentNode as HTMLElement;
  };

  private handlePickerChange = (date: [Moment, Moment] | null, dateString: [string, string]) => {
    //console.log('handlePickerChange============', date, dateString)
    const [start, end] = dateString;
    if (start && end) {
      this.setState({ rangePickerVal: date as [Moment, Moment] });
      // this.props.onConfirm({ type: 'fix', value: dateString });
    }
  };

  private handleDynamicOptionClick = (type?) => {
    const { dynamicDateType } = this.state;
    if (type === dynamicDateType) {
      return;
    }
    this.setState({ dynamicDateType: type });
  };

  private handleInputNumberChange = (value: number | undefined) => {
    const { customDays } = this.state;
    if (customDays === value) {
      return;
    }

    this.setState({ customDays: value as number });
  };

  private renderDynamicDateOption() {
    const { dynamicDateType, customDays } = this.state;
    return Object.entries(DYNAMIC_DATE_OPTION_DICT).map(item => {
      const [type, { name }] = item;
      if (type === 'custom') {
        return (
          <div key={type} className={dynamicDateType === 'custom' ? styles.customBox : ''} style={{ marginTop: 15 }}>
            <Button
              type={dynamicDateType === 'custom' ? 'primary' : 'default'}
              data-type={type}
              onClick={this.handleDynamicOptionClick.bind(null, 'custom')}
              className={styles.optionBtn}
            >
              {name}
            </Button>
            {dynamicDateType === 'custom' ? (
              <div className={styles.inputBox}>
                <span className="text">过去</span>
                <InputNumber min={0} placeholder="请输入" value={customDays} onChange={this.handleInputNumberChange} />
                天
              </div>
            ) : (
                ''
              )}
          </div>
        );
      }
      return (
        <li className="item" key={type}>
          <Button
            data-type={type}
            className={styles.optionBtn}
            type={dynamicDateType === type ? 'primary' : 'default'}
            onClick={this.handleDynamicOptionClick.bind(null, type)}
          >
            {name}
          </Button>
        </li>
      );
    });
  }

  //确定按钮逻辑
  private handleConfirm = () => {
    const { dynamicDateType, customDays, tabType, rangePickerVal } = this.state;
    if (tabType === 'fix' && rangePickerVal.length) {
      const [start, end] = rangePickerVal as [Moment, Moment];
      this.props.onConfirm({ type: 'fix', value: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')] });
    } else {
      if (dynamicDateType === 'custom') {
        this.props.onConfirm({ type: 'dynamic', value: customDays.toString() });
      } else {
        this.props.onConfirm({ type: 'dynamic', value: dynamicDateType });
      }
    }
  };

  render() {
    const { tabType, openPickerBox, dynamicDateType, rangePickerVal } = this.state;
    const { datePickerContainer } = styles;
    const clsName = this.getWrapperClsName();

    return (
      <div className={clsName} style={this.props.style}>
        <div className={datePickerContainer}>
          <div className={styles.left}>
            <div className={`${styles.btn} ${styles.fix}`}>
              <Button type={tabType === 'fix' ? 'primary' : 'default'} data-tab="fix" onClick={this.handleClickEvent.bind(null, 'fix')}>
                固定时间段
              </Button>
            </div>
            <div className={`${styles.btn} ${styles.dynamic}`}>
              <Button
                type={tabType === 'dynamic' ? 'primary' : 'default'}
                data-tab="dynamic"
                onClick={this.handleClickEvent.bind(null, 'dynamic')}
              >
                动态时间段
              </Button>
            </div>
          </div>
          <div className={styles.right}>
            {tabType === 'fix' ? (
              <div className="fix-box">
                <RangePicker
                  dropdownClassName={styles.dropdownPicker}
                  className={styles.picker}
                  open={openPickerBox}
                  getPopupContainer={this.getPickerPopupContainer}
                  bordered={false}
                  value={rangePickerVal as any}
                  onChange={this.handlePickerChange as any}
                // showTime
                />
              </div>
            ) : (
                <div className={styles.dynamicDateOptionBox}>
                  {this.renderDynamicDateOption()}
                  {dynamicDateType !== 'custom' ? (
                    <>
                      <li className={styles.placeholder}></li>
                      <li className={styles.placeholder}></li>
                    </>
                  ) : (
                      ''
                    )}
                </div>
              )}
          </div>
        </div>
        <div className={cls(styles.footer, tabType === 'dynamic' ? styles.dynamic : styles.fix)}>
          {/* 固定时间段：未选择开始时间和结束时间不能点确定按钮 */}
          <Button type="primary" onClick={this.handleConfirm} disabled={rangePickerVal.length !== 2 && tabType === 'fix'}>
            确定
          </Button>
        </div>
      </div>
    );
  }
}
