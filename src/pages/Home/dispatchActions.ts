import { dispatchWrap } from '@/utils/dispatchUtil';
import { HomeModelType } from './model';

/**
 *
 * @param state 需要添加在对应 page 中的 model
 */
export function mapStateToProps(state: any) {
  return state.home;
}

type KeyMap = keyof HomeModelType['effects'] | keyof HomeModelType['reducers'];

interface DispatchHandlerPayload {
  getCounts: void;
}

interface DispatchHandlerResult {
  getCounts: any[];
}

export type HomePageDispatchProps = DispatchProps<KeyMap, DispatchHandlerPayload, DispatchHandlerResult>;

export function mapDispatchToProps(dispatch: Function): Partial<HomePageDispatchProps> {
  return {
    getCounts: () => {
      return dispatchWrap(dispatch, 'home/getCounts', {});
    },
  };
}
