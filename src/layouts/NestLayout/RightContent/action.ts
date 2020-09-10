import { dispatchWrap } from '@/utils/dispatchUtil';
import { useDispatch } from 'dva';

export const useRightContentActions = () => {
  const dispatch = useDispatch();
  return {
    logout() {
      return dispatchWrap(dispatch, 'login/logout', {});
    },
  };
};
