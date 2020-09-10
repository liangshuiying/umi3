import { getAuthorities } from '../services/global';
import { Subscription, Effect } from 'dva';
import { Reducer } from 'redux';
import { Route } from '@ant-design/pro-layout/es/typings';

export interface OriginRoute {
  id: string;
  name: string;
  path?: string; // button 类没有 path
  code?: string; // 路由类 没有 code
  is_botton: boolean;
  nick_name: string;
  parent_id: string;
  routes: OriginRoute[];
}

export interface GlobalModelState {
  collapsed: boolean;
  pathname: string;
  query: { [key: string]: any };
  list: OriginRoute[];
  routesList: Route[];
  btnsList: OriginRoute[];
  rawRoutesList: Route[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchAuth: Effect;
    storeAllRoutesAndBtns: Effect;
    clearAuthorities: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveRoute: Reducer<GlobalModelState>;
    authList: Reducer<GlobalModelState>;
    clearData: Reducer<GlobalModelState>;
    storeRoutesAndBtns: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    pathname: '/',
    query: {},
    list: [], // 后端返回路由列表的原始数据
    routesList: [], // 左侧路由菜单
    btnsList: [], // 可用按钮权限列表
    rawRoutesList: [], // 后端返回的路由（过滤了没权限的）
  },

  effects: {
    // 获取后端返回符合角色的所有路由
    *fetchAuth({ payload, callback }, { call, put }) {
      const response = yield call(getAuthorities, payload);
      // 存储原始数据
      yield put({
        type: 'authList',
        payload: response && response.data && Array.isArray(response.data) ? response.data : [],
      });
      if (callback) callback(response);
      return response;
    },
    // 保存当前可显示的左侧菜单和可用按钮权限
    *storeAllRoutesAndBtns({ payload }, { put }) {
      yield put({
        type: 'storeRoutesAndBtns',
        payload,
      });
    },
    *clearAuthorities(_, { put }) {
      let response = [];
      yield put({
        type: 'clearData',
        payload: response,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }): GlobalModelState {
      return {
        ...state!,
        collapsed: payload,
      };
    },
    saveRoute(state, { payload }): GlobalModelState {
      return {
        ...state,
        ...payload,
      };
    },
    authList(state, action): GlobalModelState {
      return { ...(state as GlobalModelState), list: action.payload };
    },
    clearData(state, action) {
      return {
        ...(state as GlobalModelState),
        list: action.payload,
        routesList: [],
        btnsList: [],
      };
    },
    storeRoutesAndBtns(state, action) {
      const { routesList, btnsList, rawRoutesList } = action.payload;
      return {
        ...(state as GlobalModelState),
        routesList,
        btnsList,
        rawRoutesList,
      };
    },
  },

  subscriptions: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setup({ history }): void { },
  },
};

export default GlobalModel;
