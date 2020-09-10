import { dispatchWrap } from "@/utils/dispatchUtil";
import { useDispatch } from "dva";

export const useNestLayoutActions = () => {
  const dispatch = useDispatch();
  return {
    fetchAuth<T = any>(args: any) {
      return dispatchWrap<T>(dispatch, "global/fetchAuth", args);
    },
    storeAllRoutesAndBtns<T = any>(args: any) {
      return dispatchWrap<T>(dispatch, "global/storeAllRoutesAndBtns", args);
    }
  };
};
