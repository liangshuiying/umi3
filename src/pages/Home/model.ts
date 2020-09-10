import { getCount } from './service';
import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface HomeType {
  counts: any;
  // NOTE: 在 其他页面使用到 home model 中的数据 home.btnsList
  // 故这里先这样声明
  [key: string]: any
}

export interface HomeModelType {
  namespace: string;
  state: HomeType;
  effects: {
    getCounts: Effect;
  };
  reducers: {
    setCounts: Reducer<HomeType>;
  };
}

const Model: HomeModelType = {
  namespace: 'home',
  state: {
    counts: [
      { total_count: '-', daily_average_increment: '-' },
      { increment: '-', rate: '-', status: 'equal', date_type: 'DAY' },
      { increment: '-', rate: '-', status: 'equal', date_type: 'WEEK' },
      { increment: '-', rate: '-', status: 'equal', date_type: 'MONTH' },
      { increment: '-', rate: '-', status: 'equal', date_type: 'YEAR' },
    ],
  },
  effects: {
    *getCounts(_, { call, put }) {
      let response = yield call(getCount);

      if (response.status === 1) {
        yield put({
          type: 'setCounts',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    setCounts(state, action) {
      return { ...(state as HomeType), counts: action.payload };
    },
  },
};
export default Model;
