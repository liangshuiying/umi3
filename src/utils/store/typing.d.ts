import { LoginResDTO } from '@/pages/SSO/service';
import { TrendChartType } from '@/components/TrendChart';

type TYPE_DATA_CHART_TYPE_MAP = {
  [key: string]: TrendChartType;
};

type SSO_PARAM = {
  token: string;
  backUrl: string;
  appId: string | number;
};
type StoreMap = {
  TOKEN: string | null;
  SSO: SSO_PARAM;
  USER_INFO: LoginResDTO;
  DATA_CHART_TYPE_MAP: TYPE_DATA_CHART_TYPE_MAP;
};

interface IStore<T = SourceMap> extends StoreJsAPI {
  set<K extends keyof T, V extends T<K>>(key: K, value: V, expireTime?: number): void;
  observe<K extends keyof T, V extends T[K]>(key: K, cb: (newVal: V, oldVal: V) => void): number;
  unobserve(obsId: number): void;
}
