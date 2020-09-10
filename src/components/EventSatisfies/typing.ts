import { EnumRuleType } from '@/pages/Market/EventManage/Rule/typing';
import { EventModelEntity, IEventGroupContainModel } from '@/pages/Market/EventManage/typing';

export interface EventModelEntityCascaderOption extends EventModelEntity {
  value: string;
  label: string;
}

export interface EventModelEntityOption {
  key: string;
  value: IMeasures[];
}

export interface EventOperatorOption {
  key: string;
  value: IMeasures[];
}

export interface paramOption {
  key: string;
  value: IMeasures[];
}

export interface IMeasures {
  aggs?: TypeMeasureAggregator;
  name: string;
  paramKey: string;
}


export interface IEventGroupContainModelCascaderOption extends IEventGroupContainModel {
  id: number;
  name: string;
  list: EventModelEntityCascaderOption[];
}

export type TypeRelatioinFunction = keyof IRelationOperation;

export interface IRelationOperation {
  // 表示等于/不等于，对字符串、数值类型有效。如果 Params 有多个，则相当于 In 或者 Not In
  equal: string;
  notEqual: string;
  // 针对集合的操作，表示包含某个元素，例如筛选出所有喜欢苹果的用户:
  include: string;
  // 表示小于/大于/小于且大于，其中 between 是前闭后闭的区间，只对数值类型有效
  less: string;
  greater: string;
  between: string;
  // 包含或者不包含，表示字符串的部分匹配，只对字符串类型有效
  contain: string;
  notContain: string;
  isSet: string;
  notSet: string;
  isEmpty: string;
  isNotEmpty: string;
  // 只对布尔类型有效
  isTrue: string;
  isFalse: string;
  // 只对时间类型
  absoluteBetween: string; // 绝对时间
  relativeBetween: string; // 相对当前时间区间
  relativeWithin: string; // 相对当前时间点 过去 之内
  relativeBefore: string; // 相对当前时间点 过去 之前
  relativeFutureWithin: string; // 相对当前时间点 未来 之内
  relativeFutureAfter: string; // 相对当前时间点 未来 之前
}

// 针对事件
export const enum EnumRelationOperation {
  // 表示等于/不等于，对字符串、数值类型有效。如果 Params 有多个，则相当于 In 或者 Not In
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual',
  // 针对集合的操作，表示包含某个元素，例如筛选出所有喜欢苹果的用户:
  INCLUDE = 'include',
  // 表示小于/大于/小于且大于，其中 between 是前闭后闭的区间，只对数值类型有效
  LESS = 'less',
  GREATER = 'greater',
  BETWEEN = 'between',
  // 包含或者不包含，表示字符串的部分匹配，只对字符串类型有效
  CONTAIN = 'contain',
  NOT_CONTAIN = 'notContain',
  // 只对布尔类型有效。
  IS_TRUE = 'isTrue',
  IS_FALSE = 'isFalse',
}

export const enum EnumTriggerExtendModifier {
  TOTAL = 'TOTAL',
  AVERAGE = 'AVERAGE',
  ONCE = 'ONCE',
}

export const enum EnumRelationalOperator {
  AND = 'and',
  OR = 'or',
}

export type TypeRulesRelation = 'rules_relation';
export type TypeEventRule = 'event_rule';
export type TypeMeasureAggregator = 'TOTAL' | 'SUM' | 'AVG' | 'MAX' | 'MIN';
export type TypeEventRuleFunction = 'between' | 'equal' | 'greater' | 'less';
export type TypeEventRuleMeasure = 'event_measure';
export type TypeFilter = 'filters_relation';
export type TypeSubFilter = 'filter';

export interface IMeasure {
  aggregator: TypeMeasureAggregator;
  type: TypeEventRuleMeasure;
  field: string;
  cname: string;
  eventName: string; // 事件key
  aggregatorCname?: string;
  eventCname?: string;
}

export interface ISubFilter {
  type: TypeSubFilter;
  field: string; // 参数key
  cname: string;
  params: string[];
  filterSeed: string;
  function: TypeRelatioinFunction;
  fieldType?: string;
  fieldCname?: string;
}

export interface IFilter {
  type: TypeFilter | TypeSubFilter;
  filterSeed: string;
  field?: string;
  cname?: string;
  params?: [];
  function?: TypeRelatioinFunction;
  relation?: EnumRelationalOperator;
  subfilters?: ISubFilter[];
}

export interface IEventRule {
  type: TypeEventRule;
  params: number[]; // 判断是否触发，如果未触发，params = [0]
  measure: IMeasure;
  function: TypeEventRuleFunction;
  filters: IFilter[];
  timeFunction?: string;
  timeParams?: string[];
  functionCname?: string;
}

export interface IEventRuleSeed extends IEventRule {
  eventRuleSeed: string;
}

// 神策结构
export interface IRulesRelation {
  type: TypeRulesRelation;
  relation: EnumRelationalOperator;
  rules: IEventRuleSeed[];
}

export interface IEventSatisfiesProps {
  value?: IEventRuleSeed[]; // 当前事件的列表
  type?: EnumRuleType; // 规则类型
  relation?: EnumRelationalOperator;
  eventKey: string;
  userEventList: IEventGroupContainModel[];
  customFetch?: () => Promise<ResponseDTO<IEventGroupContainModel[]>>;
  onRelationChange?: (relation: EnumRelationalOperator) => void;
  onChange?: (value: IEventRuleSeed[]) => void;
  paneKey: string;
}

export interface IEventSatisfiesStates {
  eventRelation: EnumRelationalOperator;
  _value: IEventRuleSeed[];
  loadingParams: boolean;
  eventList: IEventGroupContainModelCascaderOption[];
  onlyEvents: EventModelEntityOption | {};
  operatorList: EventOperatorOption | {};
  paramList: paramOption | {};
}
