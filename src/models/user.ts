import { Effect } from 'dva';
import { Reducer } from 'redux';
import scrmStore from '@/utils/store';

export interface UserModelState {
  domainId: string | null;
  accountId: string | null;
  accountName: string | null;
  domainName: string | null;
  accessToken: string | null;
  portraitUrl: string | null;
  isvLogo: string | null;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    saveInfo: Effect;
  };
  reducers: {
    save: Reducer<UserModelState>;
  };
}

const userInfo = scrmStore.get('USER_INFO');

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    domainId: userInfo ? userInfo.domainId : null,
    accountId: userInfo ? userInfo.accountId : null,
    accountName: userInfo ? userInfo.accountName : null,
    domainName: userInfo ? userInfo.domainName : null,
    accessToken: userInfo ? userInfo.accessToken : null,
    portraitUrl: userInfo ? userInfo.portraitUrl : null,
    isvLogo: userInfo ? userInfo.isvLogo : null,
  },

  effects: {
    *saveInfo({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
      scrmStore.set('USER_INFO', payload);
    },
  },

  reducers: {
    save(state, { payload }): UserModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default UserModel;
