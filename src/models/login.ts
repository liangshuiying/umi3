import { message } from 'antd';
import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import Cookies from 'js-cookie';
import { Reducer } from 'redux';
import { accountLogin, accountLogout, getCaptcha } from '@/services/login';
import { reloadAuthorized } from '@/utils/Authorized';
import { setCookieExpires, camelize } from '@/utils/utils';
import scrmStore from '@/utils/store';

export interface LoginStateType {
  currentAuthority: 'user' | 'guest' | 'admin';
  status: number | undefined;
  type: string;
}

export interface LoginModelType {
  namespace: string;
  state: LoginStateType;
  effects: {
    login: Effect;
    getCaptchas: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<LoginStateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',
  state: {
    status: undefined,
    type: '',
    currentAuthority: 'user',
  },
  effects: {
    *login({ payload }, { call, put }) {
      let copyData = Object.assign({}, payload);
      if (payload.autoLogin) {
        copyData.autoLoginFlag = 1;
      }
      delete copyData.autoLogin;
      delete copyData.type;

      const response = yield call(accountLogin, copyData);
      if (response.status === 1) {
        yield put({
          type: 'user/saveInfo',
          payload: camelize(response.data),
        });
        yield put({
          type: 'changeLoginStatus',
          payload: response,
          isAutoLoginFlag: payload.autoLogin,
        });
        yield put(routerRedux.replace('/'));
      } else {
        message.error(response.error.message);
      }
    },

    *getCaptchas({ payload, callback }, { call }) {
      // console.log(payload);
      const response = yield call(getCaptcha, payload);
      if (callback) {
        callback(response);
      }
      return response;
    },

    *logout({ payload, callback }, { call, put }) {
      let response = yield call(accountLogout, payload);

      if (response.status === 1 && window.location.pathname !== '/users/login') {
        Cookies.remove('currentAuthority');
        scrmStore.remove('USER_INFO');
        yield put({
          type: 'global/clearAuthorities',
          payload: camelize(response.data),
        });
        yield put(
          routerRedux.replace({
            pathname: '/users/login',
          }),
        );
      }
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload, isAutoLoginFlag }) {
      if (isAutoLoginFlag) {
        // 有勾选“自动登录”，设置一天后失效
        setCookieExpires('currentAuthority', payload.data, 1);
      } else {
        Cookies.set('currentAuthority', payload.data);
      }

      reloadAuthorized();

      return {
        ...state,
        status: payload.status,
        type: payload.type,
      } as LoginStateType;
    },
  },
};

export default Model;
