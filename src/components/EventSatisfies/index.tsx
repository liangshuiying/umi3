import { EnumRuleType } from '@/pages/Market/EventManage/Rule/typing';
import BetweenInput from '@/components/BetweenInput';
import EventCascader, { CascaderOptionType } from '@/components/EventCascader';
import IconFont from '@/components/IconFont';
import { IEventGroupContainModel, EventModelEntity } from '@/pages/Market/EventManage/typing';
import EventEmitter, { EventListener } from '@/helpers/EventEmitter';
import { getUid, camelize } from '@/utils/utils';
import noDataImage from '@/assets/no-data.svg';
import {
  IEventSatisfiesProps,
  EnumRelationalOperator,
  IEventRuleSeed,
  EventModelEntityCascaderOption,
  IEventSatisfiesStates,
  IEventGroupContainModelCascaderOption,
  TypeEventRuleFunction,
  IFilter,
  ISubFilter,
  TypeRelatioinFunction,
  TypeMeasureAggregator,
} from './typing';

import AndOrBar from './AndOrBar';
import { generateEventRuleSeed, getParamsExp, getChangeIndex } from './utils';
import { getEventParamList } from '@/services/common';

import styles from './index.module.less';
import ParamItem from './ParamItem';
import { DeleteOutlined } from '@ant-design/icons';
import { Select, Button, Spin, InputNumber, Empty, message, Cascader } from 'antd';
import { produce } from 'immer';
import {
  map as _map,
  remove as _remove,
  find as _find,
  reduce as _reduce,
  includes as _includes,
  split as _split,
  cloneDeep
} from 'lodash';
import React from 'react';
const { Option } = Select;

interface InternalEventTables {
  add: { key: string };
  afterFetch: { key: string };
  copy: { key: string }
}

class EventSatisfies extends React.Component<IEventSatisfiesProps, IEventSatisfiesStates> {
  static eventEmit = new EventEmitter<InternalEventTables>();
  eventListener: EventListener | null = null;
  eventListener2: EventListener | null = null;
  constructor(props: IEventSatisfiesProps) {
    super(props);
    this.state = {
      eventRelation: EnumRelationalOperator.AND,
      _value: [],
      loadingParams: false,
      eventList: [],  //触发、不触发后面的二级下拉框数据(支付订单等)
      onlyEvents: {}, // eventList后的二级下拉框数据（总次数等）
      operatorList: {}, //操作符列表（大于、等于、小于、区间）
      paramList: {},// 参数列表
    };
  }

  // 获取事件列表
  componentDidMount() {
    this.fetchEventGroupList(); // 事件列表数据重新调整结构及默认事件参数接口调用
    this.eventListener = EventSatisfies.eventEmit.on('add', this.props.eventKey, ({ key }) => {
      if (this.props.eventKey === key) {
        this.handleAddEvent();
      }
    });

    this.eventListener2 = EventSatisfies.eventEmit.on('copy', this.props.paneKey, ({ key }) => {

      if (this.props.paneKey === key) {
        //console.log('copy==eventListener=======', this.props, key)
        const { value = [] } = this.props;
        value.length && value.map(async (item) => {
          // 复制分层数据后需循环获取接口，注意等结果返回后在setState
          await this.getParamList(item.measure.eventName, item.eventRuleSeed);
        })
      }
    });
  }

  componentWillUnmount() {
    if (this.eventListener) {
      EventSatisfies.eventEmit.off('add', this.props.eventKey);
    }
  }

  computedValue = () => {
    if ('value' in this.props && this.props.value !== void 0) {
      return this.props.value;
    }
    return this.state._value;
  };

  computedRelation = () => {
    if ('relation' in this.props && this.props.relation !== void 0) {
      return this.props.relation;
    }
    return this.state.eventRelation;
  };

  triggerRelationChange = (newRelation: EnumRelationalOperator) => {
    if (this.props.onRelationChange) {
      this.props.onRelationChange(newRelation);
    }
  };

  triggerChange = (newValue: IEventRuleSeed[]) => {
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  };

  //总次数、累计、平均等数据拼接
  fetchAgg = (agg) => {
    const { aggregators = [], params = [] } = agg;
    let res = [], newAgg = [];
    aggregators.length && aggregators.map((val) => {
      newAgg.push({
        value: val.code,
        label: val.name,
      })
    })

    params.length && params.map((item) => {
      if (item.isEventParam) {
        res.push({
          value: item.key,
          label: item.name,
          children: newAgg
        })
      } else {
        res.push({
          value: item.key,
          label: item.name
        })
      }
    })
    return res;
  }

  //存储接口数据
  setDataToState(key, res) {
    const { onlyEvents, operatorList, paramList } = this.state;
    let newOnlyEvents = cloneDeep(onlyEvents);
    let newOperatorList = cloneDeep(operatorList);
    let newPars = cloneDeep(paramList);
    console.log('newPars=========', newPars)
    if (res) {
      const { aggregator = {}, functions = [], params = [] } = res;
      let aggs = this.fetchAgg(aggregator);
      newOnlyEvents[key] = aggs;
      newOperatorList[key] = functions;
      newPars[key] = params;
    } else {
      newOnlyEvents[key] = []
      newOperatorList[key] = []
      newPars[key] = []
    }

    this.setState({
      onlyEvents: newOnlyEvents,
      operatorList: newOperatorList,
      paramList: newPars,
      loadingParams: false
    }, () => {
      console.log('state===========', this.state)
      return res
    })
  }

  // 事件参数接口调用
  // 循环调用接口并将结果存入state中时，应等待接口已返回结果在setState
  getParamList = async (modelKey, key) => {
    this.setState({
      loadingParams: true
    })
    let res = await getEventParamList({ model_key: modelKey });
    if (res && res.status === 1) {
      this.setDataToState(key, camelize(res.data))
    } else {
      message.error(res.error.message)
      this.setDataToState(key, '')
    }
  }

  fetchEventGroupList = () => {
    let eventList = this.props.userEventList;
    // 事件列表数据重新调整结构

    const mapData = _map<IEventGroupContainModel, IEventGroupContainModelCascaderOption | undefined>(
      eventList,
      item => {
        if (!item.list || item.list.length === 0) {
          return void 0;
        }
        const copyItem = { ...item, value: '', label: '', children: [] } as any;
        copyItem.value = item.id + '';
        copyItem.label = item.name;
        copyItem.children = _map<EventModelEntity, EventModelEntityCascaderOption>(item.list, tmp => {
          const copyTmp = { ...tmp } as EventModelEntityCascaderOption;
          copyTmp.value = tmp.modelKey + '';
          copyTmp.label = tmp.name;
          return copyTmp;
        });
        return copyItem;
      },
    ).filter(Boolean);

    this.setState(
      {
        eventList: mapData as IEventGroupContainModelCascaderOption[]
      },
      () => {
        EventSatisfies.eventEmit.emit('afterFetch', { key: this.props.eventKey });
      },
    );

  };

  /**
   * 更改列表
   * @param newVal 新的列表
   */
  handleChangeValue = (newVal: IEventRuleSeed[]) => {

    if (!('value' in this.props)) {
      this.setState({
        _value: newVal,
      });
    }
    this.triggerChange(newVal);
  };

  filter(inputValue: string, path: CascaderOptionType[]) {
    return path.some(option => {
      if (option.label !== null && option.label !== void 0) {
        const label = option.label as string;
        return label.toLowerCase().includes(inputValue.toLowerCase());
      }
      return false;
    });
  }

  // 事件关系切换
  switchExp = () => {
    const newRelation =
      this.computedRelation() === EnumRelationalOperator.AND ? EnumRelationalOperator.OR : EnumRelationalOperator.AND;
    if (!('relation' in this.props)) {
      this.setState({
        eventRelation: newRelation,
      });
    }
    this.triggerRelationChange(newRelation);
  };

  /**
   * 更改触发状态
   * @param newTrigger 是否触发 0 | 1
   * @param eventRuleSeed seed id
   */

  handleChangeEventRuleSeedTrigger = (newTrigger: number, eventRuleSeed: string) => {
    const newRuleRelation = produce(this.computedValue(), draft => {
      const changeIndex = getChangeIndex(draft, eventRuleSeed);
      const targetRule = draft[changeIndex];
      if (newTrigger === 0) {
        // 不触发：外层function为等于，params值为0，页面无法修改，
        //触发：外层function为默认为大于，默认params值为0，后可通过页面修改。
        targetRule.function = 'equal';
        targetRule.params = [0];
      } else {
        targetRule.function = 'greater';
        targetRule.params = [this.getMinInput('greater')];
      }
    });
    this.handleChangeValue(newRuleRelation);
  };

  /**
   * 更改选择的事件
   * @param selectedEvent 选择的事件
   * @param eventRuleSeed seed id
   */
  handleSelectEvent = (selectedEvent: CascaderOptionType[], eventRuleSeed: string) => {
    const newRuleRelation = produce(this.computedValue(), draft => {
      const changeIndex = getChangeIndex(draft, eventRuleSeed);
      const targetRule = draft[changeIndex];
      targetRule.measure.eventName = selectedEvent[1].value as string;
      targetRule.measure.cname = selectedEvent[1].label as string;
      targetRule.measure.field = '';
      targetRule.measure.aggregator = 'TOTAL';
      targetRule.filters = [];
    });
    this.getParamList(selectedEvent[1].modelKey, eventRuleSeed)
    this.handleChangeValue(newRuleRelation);
  };

  /**
   * 修改事件指标值
   * @param newParams 新的事件指标值
   * @param eventRuleSeed seed id
   */
  handleChangeEventRuleParams = (newParams: (string | number)[], eventRuleSeed: string) => {
    const newRuleRelation = produce(this.computedValue(), draft => {
      const targetModel = _find(draft, { eventRuleSeed });
      if (targetModel) {
        const minInput = this.getMinInput(targetModel.function);

        if (newParams.length === 0) {
          targetModel.params = [minInput];
        } else if (newParams.length === 2) {
          let [firstP, secondP] = newParams;
          firstP = firstP === null ? minInput : firstP;
          const result = [firstP];
          if (secondP !== null) {
            result.push(secondP);
          }
          targetModel.params = result as number[];
        } else {
          const firstP = newParams[0];
          if (firstP === null) {
            targetModel.params = [minInput];
          } else {
            targetModel.params = newParams as number[];
          }
        }
      }
    });

    this.handleChangeValue(newRuleRelation);
  };

  handleChangeEventRuleSingleParams = (eventRuleSeed: string, newParams?: number) => {
    if (newParams) {
      const numStr = `${newParams}`;
      if (numStr.length > 40) {
        return;
      }
      this.handleChangeEventRuleParams([newParams], eventRuleSeed);
    } else {
      this.handleChangeEventRuleParams([], eventRuleSeed);
    }
  };

  changeFilter = (modelKey: string, targetFilter: IFilter | ISubFilter, field: string, val: any, list: any) => {
    console.log('val====changeFilter======', val, field)
    let selectedOp;
    list && list.length && list.map((item) => {
      if (item.paramKey === val.field) {
        selectedOp = item;
      }
    })
    console.log('selectedOp===========', selectedOp)
    if (field === 'field') {
      targetFilter.field = `event.${modelKey}.${val.field}`;
      targetFilter.cname = val.cname;
      targetFilter.params = [];
      const functions = selectedOp.functions;
      targetFilter.function = functions[0].code;
    } else if (field === 'function') {
      targetFilter.function = val;
      targetFilter.params = [];
      // const noParams: TypeRelatioinFunction[] = ['isEmpty', 'isNotEmpty', 'isTrue', 'isFalse', 'isSet', 'notSet'];
      // if (_includes(noParams, val)) {
      //   delete targetFilter.params;
      // } else {
      //   targetFilter.params = [];
      // }
    } else if (field === 'params') {
      targetFilter.params = val;
    }
  };

  handleChangeEventFilter = (field: string, val: any, eventRuleSeed: string, filterSeed: string, options) => {
    const newVal = produce(this.computedValue(), draft => {
      const targetModel = _find(draft, { eventRuleSeed });
      if (targetModel) {
        const modelKey = targetModel.measure.eventName;
        const filterLen = this.getEventFilters(targetModel).length;
        if (filterLen > 1) {
          // 多个参数
          const newSubFilters = targetModel.filters[0].subfilters;
          if (newSubFilters) {
            const targetFilter = _find(newSubFilters, { filterSeed });
            if (targetFilter) {
              this.changeFilter(modelKey, targetFilter, field, val, options);
              targetModel.filters[0].subfilters = newSubFilters;
            }
          }
        } else if (filterLen === 1) {
          // 只有一个参数
          const newFilter = targetModel.filters[0];
          if (newFilter) {
            this.changeFilter(modelKey, newFilter, field, val, options);
            targetModel.filters = [newFilter];
          }
        }
      }
    });
    this.handleChangeValue(newVal);
  };

  /**
   * 添加参数
   * @param eventRuleSeed seed id
   */
  handleAddFilter = async (eventRuleSeed: string) => {
    const newVal = produce(this.computedValue(), draft => {
      const targetModel = _find(draft, { eventRuleSeed });

      if (targetModel) {
        const options = this.getEventParamOptions(eventRuleSeed);
        //console.log('options=======', options)
        if (options && options.length > 0) {
          const filters = this.getEventFilters(targetModel);
          const f = options[0].functions[0].code;
          const filterItem: any = {
            filterSeed: getUid(),
            field: `event.${targetModel.measure.eventName}.${options[0].paramKey}`,
            cname: options[0].name,
            function: f,
            params: [],
          };

          if (filters.length > 0) {
            filterItem.type = 'filter';

            if (filters.length === 1) {
              const newFilter = [...targetModel.filters];
              newFilter.push(filterItem);
              targetModel.filters = [
                {
                  type: 'filters_relation',
                  relation: EnumRelationalOperator.AND,
                  filterSeed: getUid(),
                  subfilters: newFilter as ISubFilter[],
                },
              ];
            } else {
              const oldFilters = targetModel.filters[0]?.subfilters || [];
              oldFilters.push(filterItem as ISubFilter);
            }
          } else {
            filterItem.type = 'filter';
            targetModel.filters = [filterItem as IFilter];
          }
        } else {
          message.warn('该事件无参数');
        }
      }
    });
    //console.log('newVal==========', newVal)
    this.handleChangeValue(newVal);
  };

  /**
   * 获取事件的全部参数选项
   */
  getEventParamOptions = (modelKey: string) => {
    const { paramList } = this.state;
    return paramList[modelKey];
  };

  getOperator = (modelKey: string) => {
    const { operatorList } = this.state;
    return operatorList[modelKey];
  }

  /**
   * 删除事件满足关系
   * @param eventRuleSeed seed id
   */
  handleDelEventRule = (eventRuleSeed: string) => {
    const newRuleRelation = produce(this.computedValue(), draft => {
      _remove(draft, { eventRuleSeed });
    });
    this.handleChangeValue(newRuleRelation);
  };

  /**
   * 添加事件
   * @param e React.MouseEvent<HTMLAnchorElement, MouseEvent>
   */
  handleAddEvent = (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    const { userEventList } = this.props;

    if (userEventList.length && userEventList[0].id) {
      const newRuleRelation = produce(this.computedValue(), draft => {
        const newEvent = generateEventRuleSeed(userEventList[0].list[0]);
        draft.push(newEvent);
      });
      this.getParamList(userEventList[0].list[0].modelKey, newRuleRelation[newRuleRelation.length - 1].eventRuleSeed);
      this.handleChangeValue(newRuleRelation);
    }
  };

  // 切换参数关系
  handleSwitchParamExp = (oldExp: EnumRelationalOperator, eventRuleSeed: string) => {
    const newExp = oldExp === EnumRelationalOperator.AND ? EnumRelationalOperator.OR : EnumRelationalOperator.AND;
    const newRuleRelation = produce(this.computedValue(), draft => {
      const targetModel = _find(draft, { eventRuleSeed });
      if (targetModel) {
        targetModel.filters[0].relation = newExp;
      }
    });

    this.handleChangeValue(newRuleRelation);
  };

  /**
   * 显示选择事件的内容
   */
  displaySelectEventLabel = (label: string[]) => {
    if (label.length === 2) {
      return label[1];
    }
    return void 0;
  };

  /**
   * 获取事件在不同指标下的最小值
   */
  getMinInput = (f: TypeEventRuleFunction) => {
    switch (f) {
      case 'equal':
      case 'between':
        return 1;
      case 'less':
        return 2;
      default:
        return 0;
    }
  };

  /**
   * 获取事件指标值
   */
  getEventValue = (f: TypeEventRuleFunction, params: number[]) => {
    if (f !== 'between') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return params[0]!;
    }
    return params;
  };

  /**
   * 事件是否触发判断
   */
  getEventTrigger = (f: TypeEventRuleFunction, params: number[]) => {
    if (f === 'equal' && params[0] === 0) {
      return 0;
    }
    return 1;
  };

  /**
   * 更改事件指标
   */
  handleChangeEventFunction = (newF: TypeEventRuleFunction, eventRuleSeed: string) => {
    const newRuleRelation = produce(this.computedValue(), draft => {
      const changeIndex = getChangeIndex(draft, eventRuleSeed);
      const targetRule = draft[changeIndex];
      targetRule.function = newF;
      targetRule.params = [this.getMinInput(newF)];
    });
    this.handleChangeValue(newRuleRelation);
  };

  /**
   * 获取目标事件下添加的参数列表
   */
  getEventFilters = (eventItem: IEventRuleSeed) => {
    if (eventItem.filters.length > 0) {
      const targetFilter = eventItem.filters[0];
      if (targetFilter.type === 'filter') {
        return eventItem.filters as ISubFilter[];
      } else if (targetFilter.type === 'filters_relation') {
        return targetFilter.subfilters || [];
      }
    }

    return [];
  };

  // 删除参数
  handleDelFilter = (eventRuleSeed: string, filterSeed: string) => {
    const newRuleRelation = produce(this.computedValue(), draft => {
      const targetModel = _find(draft, { eventRuleSeed });
      if (targetModel) {
        const filterLen = this.getEventFilters(targetModel).length;
        if (filterLen > 1) {
          const newSubFilters = targetModel.filters[0].subfilters;
          if (newSubFilters) {
            _remove(newSubFilters, { filterSeed });
          }
          if (newSubFilters && newSubFilters.length === 1) {
            const newFilter = newSubFilters[0];
            newFilter.type = 'filter';
            targetModel.filters = [newFilter as IFilter];
          } else {
            targetModel.filters[0].subfilters = newSubFilters;
          }
        } else if (filterLen === 1) {
          targetModel.filters = [];
        }
      }
    });

    this.handleChangeValue(newRuleRelation);
  };

  displayRender = (label: string[]) => {
    return label.join('');
  };

  changeAgg = (value: string[], eventRuleSeed: string) => {

    const [field, agg] = value;
    //console.log('value=========', field, agg)
    const newRuleRelation = produce(this.computedValue(), draft => {
      const changeIndex = getChangeIndex(draft, eventRuleSeed);
      const targetRule = draft[changeIndex];
      if (agg) {
        targetRule.measure.field = `event.${targetRule.measure.eventName}.${field}`;
        targetRule.measure.aggregator = agg as TypeMeasureAggregator;
      } else {
        targetRule.measure.field = '';
        targetRule.measure.aggregator = 'TOTAL';
      }
    });
    //console.log('newRuleRelation==========', newRuleRelation)
    this.handleChangeValue(newRuleRelation);
  };

  generateCal = (rule: IEventRuleSeed) => {
    let key = rule.eventRuleSeed;
    const { onlyEvents } = this.state;
    //console.log('onlyEvents===========', onlyEvents, key, rule)
    const casOpts = onlyEvents[key];
    //console.log('casOpts===========', casOpts, rule)
    let val: string[] = [];
    if (rule.measure.aggregator === 'TOTAL') {
      val.push('TOTAL');
    } else {
      const field = _split(rule.measure.field, '.')
        .slice(2)
        .join('.');
      const agg = rule.measure.aggregator;
      val = [field, agg];
    }
    return (
      <Cascader
        value={val}
        options={casOpts}
        expandTrigger={"hover"}
        displayRender={this.displayRender}
        onChange={(value: string[]) => {
          this.changeAgg(value, rule.eventRuleSeed)
        }}
      />
    );
  };

  render() {
    const { type = EnumRuleType.TAG, loading } = this.props;
    const { loadingParams, eventList } = this.state;
    const _events = this.computedValue();
    const _relation = this.computedRelation();
    if (loading) {
      return (
        <Spin spinning={loading}>
          <AndOrBar show={false} exp={EnumRelationalOperator.AND} />
        </Spin>
      );
    }
    if (eventList.length === 0) {
      return <Empty
        image={noDataImage}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 100,
          fontSize: 12
        }}
        imageStyle={{ height: 50 }}
        description="暂无可选择的事件"
      />
    }
    return (
      <Spin spinning={loadingParams} wrapperClassName={styles.spinning}>
        <AndOrBar show={_events.length > 1} onSwitch={this.switchExp} exp={_relation}>
          <div className={styles.eventList}>
            {_map(_events, eventItem => {
              const eventValue = this.getEventValue(eventItem.function, eventItem.params);
              const minInput = this.getMinInput(eventItem.function);
              const isTrigger = this.getEventTrigger(eventItem.function, eventItem.params);
              const selectedEvent = ['__all__', eventItem.measure.eventName];
              const eventFilters = this.getEventFilters(eventItem);
              const operators = this.getOperator(eventItem.eventRuleSeed);
              const options = this.getEventParamOptions(eventItem.eventRuleSeed);
              const paramExp = getParamsExp(eventItem.filters);
              return (
                <div className={styles.eventItemWrap} key={eventItem.eventRuleSeed}>
                  <div className={styles.eventItem}>
                    <div className={styles.eventContent}>
                      <IconFont className={styles.eventIcon} type="icon-event" />
                      <div className={styles.triggerSelect}>
                        <Select
                          value={isTrigger}
                          style={{ width: 86 }}
                          onChange={newTrigger =>
                            this.handleChangeEventRuleSeedTrigger(newTrigger, eventItem.eventRuleSeed)
                          }
                        >
                          <Option value={1}>触发</Option>
                          <Option value={0}>不触发</Option>
                        </Select>
                      </div>
                      <div className={styles.eventWrap}>
                        <EventCascader
                          allowClear={false}
                          value={selectedEvent}
                          displayRender={this.displaySelectEventLabel}
                          options={eventList}
                          showSearch={{
                            filter: (inputVal: string, path: CascaderOptionType[]) => this.filter(inputVal, path),
                          }}
                          onChange={(_, selectedOptions) =>
                            this.handleSelectEvent(selectedOptions || [], eventItem.eventRuleSeed)
                          }
                        />
                      </div>
                      {type === EnumRuleType.TAG && isTrigger === 1 ? (
                        <>
                          {this.generateCal(eventItem)}
                          <Select
                            value={eventItem.function}
                            style={{ width: 96, marginRight: 8, marginLeft: 8 }}
                            placeholder="请选择"
                            onChange={newFunction =>
                              this.handleChangeEventFunction(newFunction, eventItem.eventRuleSeed)
                            }
                          >
                            {
                              operators && operators.length && operators.map((item) => {
                                return <Option value={item.code} key={item.code}>{item.name}</Option>
                              })
                            }
                          </Select>
                          <div className={styles.inputGroup}>
                            {eventItem.function === 'between' ? (
                              <BetweenInput
                                min={[1, 1]}
                                value={eventValue as number[]}
                                onChange={newVal =>
                                  this.handleChangeEventRuleParams(newVal as string[], eventItem.eventRuleSeed)
                                }
                              />
                            ) : (
                                <InputNumber
                                  placeholder="请输入"
                                  style={{ width: '100%' }}
                                  min={minInput}
                                  value={eventValue as number}
                                  onChange={newVal =>
                                    this.handleChangeEventRuleSingleParams(eventItem.eventRuleSeed, newVal)
                                  }
                                />
                              )}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className={styles.eventActionWrap}>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => this.handleAddFilter(eventItem.eventRuleSeed)}
                        style={{ padding: 0, fontWeight: 500, border: 'none' }}
                      >
                        添加事件参数
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        type="link"
                        size="small"
                        className={styles.paramActionDelete}
                        onClick={() => this.handleDelEventRule(eventItem.eventRuleSeed)}
                      />
                    </div>
                  </div>
                  <AndOrBar
                    exp={paramExp}
                    show={eventFilters.length > 1}
                    onSwitch={() => this.handleSwitchParamExp(paramExp, eventItem.eventRuleSeed)}
                  >
                    {eventFilters.length ? (
                      <div className={styles.paramList}>
                        {_map(eventFilters, (filterItem: ISubFilter, index) => {
                          return (
                            <ParamItem
                              key={filterItem.filterSeed}
                              count={index + 1}
                              options={options}
                              data={filterItem}
                              type={this.props.type || EnumRuleType.TAG}
                              onChange={(field: string, val: any) =>
                                this.handleChangeEventFilter(field, val, eventItem.eventRuleSeed, filterItem.filterSeed, options)
                              }
                              onDel={() => this.handleDelFilter(eventItem.eventRuleSeed, filterItem.filterSeed)}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </AndOrBar>
                </div>
              );
            })}
          </div>
        </AndOrBar>
      </Spin>
    );
  }
}

export default EventSatisfies;
