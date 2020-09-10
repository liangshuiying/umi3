import { getUid } from '@/utils/utils';
import { findIndex as _findIndex } from 'lodash';
import { EventModelEntity } from '@/pages/Market/EventManage/typing';
import { EnumParamType } from '@/pages/Market/EventManage/Param/typing';
import { EnumRelationalOperator, IRulesRelation, IEventRuleSeed, IFilter, TypeRelatioinFunction } from './typing';

/**
 * 初始化一个参数数据
 */
export function generateRulesRelation(): IRulesRelation {
  return {
    type: 'rules_relation',
    rules: [],
    relation: EnumRelationalOperator.AND,
  };
}

/**
 * 生成事件
 * @param type 事件类型
 */
export function generateEventRuleSeed(eventModel: EventModelEntity): IEventRuleSeed {
  const initUid = getUid();
  return {
    eventRuleSeed: initUid,
    type: 'event_rule',
    function: 'greater',
    params: [0],
    filters: [],
    measure: {
      type: 'event_measure',
      field: '',
      cname: eventModel.name,
      eventName: eventModel.modelKey,
      aggregator: 'TOTAL',
    },
  };
}

/**
 * 搜索事件列表
 * @param eventSearch 关键字
 * @param cb 回调
 */

export const getChangeIndex = (list: IEventRuleSeed[], eventRuleSeed: string) => {
  const changingEventItemIndex = _findIndex(list, { eventRuleSeed });
  if (changingEventItemIndex > -1) {
    return changingEventItemIndex;
  }
  throw new Error(`不存在该 eventRuleSeed: ${eventRuleSeed}`);
};

/**
 * 根据参数组设置默认 且或关系
 * @param filters 参数组
 */
export const getParamsExp = (filters: IFilter[]): EnumRelationalOperator => {
  if (filters && filters.length > 0) {
    const targetFilters = filters[0];
    return targetFilters.relation || EnumRelationalOperator.AND;
  }
  return EnumRelationalOperator.AND;
};

/**
 * 根据参数类型返回当前参数支持的操作类型
 * @param type 参数类型
 */
export const getFunctionsByType = (type: EnumParamType) => {
  let functions: TypeRelatioinFunction[] = [];
  switch (type) {
    case EnumParamType.ENUM:
    case EnumParamType.TEXT: {
      // 如果参数类型为 STRING 或者 为 ENUM，可选择 ['equal', 'notEqual', 'contain', 'notContain']
      functions = ['equal', 'notEqual', 'contain', 'notContain', 'isEmpty', 'isNotEmpty'];
      break;
    }
    case EnumParamType.BOOL: {
      functions = ['isTrue', 'isFalse'];
      break;
    }
    case EnumParamType.NUM: {
      // 如果参数类型为 NUMBER
      functions = ['equal', 'notEqual', 'less', 'greater', 'between'];
      break;
    }
    case EnumParamType.DATE:
    case EnumParamType.DATETIME: {
      functions = [
        'absoluteBetween',
        'relativeBetween',
        'relativeWithin',
        'relativeBefore',
        'relativeFutureWithin',
        'relativeFutureAfter',
      ];
      break;
    }
    default:
  }

  return functions;
};


// list：属性列表数据，key：param_key
//返回数据 
// res： 绝对时间区间、相对当前时间点等
// relWith: 相对当前时间区间后的过去、未来
// relOldAndFuture: 相对当前时间点的过去、未来
// relOld: 相对当前时间点(过去)的之前、之内
// relFuture: 相对当前时间点(未来)的之内、之后

export const getDateTimeOps = (list, key) => {
  let res = {}, relWith = [], relOldAndFuture = [], relOld = [], relFuture = [];
  let hasAbs = false, hasRelation = false, hasBet = false, hasOld = false, hasFuture = false;
  if (list.paramKey === key) {
    list.functions && list.functions.length && list.functions.map((val) => {

      //绝对时间逻辑开始
      if (val.code === 'absoluteBetween') {
        hasAbs = true
      }
      //结束

      //相对当前时间点逻辑开始
      if (val.code === 'relativeWithin') {
        hasRelation = true
        hasOld = true
        relOld.push({
          key: 'in',
          value: '之内'
        })
      }
      if (val.code === 'relativeBefore') {
        hasRelation = true
        hasOld = true
        relOld.push({
          key: 'out',
          value: '之前'
        })
      }
      if (val.code === 'relativeFutureWithin') {
        hasRelation = true
        hasFuture = true
        relFuture.push({
          key: 'in',
          value: '之内'
        })
      }
      if (val.code === 'relativeFutureAfter') {
        hasRelation = true
        hasFuture = true
        relFuture.push({
          key: 'out',
          value: '之后'
        })
      }
      //结束

      //相对当前时间区间逻辑开始
      if (val.code === 'relativeBetween') {
        hasBet = true
        relWith = [
          { key: 'old', value: '过去' },
          { key: 'future', value: '未来' }
        ]
      }
      //结束
    })
  }

  if (hasAbs) {
    res.absoluteBetween = '绝对时间区间'
  }
  if (hasRelation) {
    res.relativeWithin = '相对当前时间点'
  }
  if (hasBet) {
    res.relativeBetween = '相对当前时间区间';
  }

  if (hasOld) {
    relOldAndFuture.push({
      key: 'old',
      value: '过去'
    })
  }
  if (hasFuture) {
    relOldAndFuture.push({
      key: 'future',
      value: '未来'
    })
  }

  //console.log('res======getDateTimeOps======', res, relWith, relOldAndFuture, relOld, relFuture)
  return { res, relWith, relOldAndFuture, relOld, relFuture, hasAbs }
}
