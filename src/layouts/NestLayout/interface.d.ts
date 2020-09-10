import { OriginRoute } from '@/models/globalModel';
import { Route } from '@ant-design/pro-layout/es/typings';

export interface INestLayoutProps {
  route: Route;
}

export interface RealAuthoritRoutes {
  routesList: MenuDataItem[];
  btnsList: OriginRoute[];
  rawRoutesList: MenuDataItem[];
}
