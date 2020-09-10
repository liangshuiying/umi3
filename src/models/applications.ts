import { Effect } from 'dva';
import { Reducer } from 'redux';

export interface ApplicationEntity {
  application_id: string;
  application_name: string;
  application_info: string;
  application_logo_url?: string;
}
export interface ApplicationsModelState {
  list: ApplicationEntity[];
  selectedApp: {
    application_id: string | undefined;
  };
}

export interface ApplicationsModelType {
  namespace: 'applications';
  state: ApplicationsModelState;
  effects: {
    selectOneApp: Effect;
    fetch: Effect;
    clearSelectApp: Effect;
  };
  reducers: {
    queryList: Reducer<ApplicationsModelState>;
    selectOne: Reducer<ApplicationsModelState>;
    clearSelect: Reducer<ApplicationsModelState>;
  };
}

const Model: ApplicationsModelType = {
  namespace: 'applications',
  state: {
    list: [],
    selectedApp: {
      application_id: undefined,
    }, // 选中的应用id
  },
  effects: {
    *fetch(_, { put }) {
      // const response = yield call(queryLists, payload);
      let response = [
        {
          application_id: '1111',
          application_name: '权益平台',
          application_info: '可对自己的会员进行权益发放，并可对会员进行营销。',
          // "application_logo_url":"@/assets/app_1.png"
        },
      ];
      yield put({
        type: 'queryList',
        payload: response && Array.isArray(response) ? response : [],
      });
      return response;
    },
    *selectOneApp({ payload }, { put }) {
      yield put({
        type: 'selectOne',
        payload,
      });
    },
    *clearSelectApp({ payload }, { put }) {
      yield put({
        type: 'clearSelect',
        payload,
      });
    },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload } as ApplicationsModelState;
    },
    selectOne(state, action) {
      return { ...state, selectedApp: action.payload } as ApplicationsModelState;
    },
    clearSelect(state) {
      return {
        ...state,
        selectedApp: {
          application_id: undefined,
        },
      } as ApplicationsModelState;
    },
  },
};
export default Model;
