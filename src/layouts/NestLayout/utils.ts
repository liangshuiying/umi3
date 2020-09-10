import { OriginRoute } from '@/models/globalModel';
import { RealAuthoritRoutes } from './interface.d';
import _forEach from 'lodash/forEach';
import { Route } from '@ant-design/pro-layout/es/typings';
import produce from 'immer';

/**
 * 处理后端返回单路由列表，过滤掉无权限的路由
 * @param routes
 */
export function getDisponseRoutesByApi(routes) {
  // 添加标签特殊处理
  const routeProducer = produce(draft => {
    let listRouter = [];
    if (draft.path === '/members/tag/add') {
      listRouter = draft;
      if (listRouter.routes.find(item => item.path === '/members/tag/add/page')) {
        let uploadRouter = {
          id: '999',
          path: '/members/tag/add/upload',
          name: '添加标签(外部导入)',
          routes: [],
          is_botton: false
        };
        draft.routes.push(uploadRouter);
      }
    }


    if (draft.routes && draft.routes.length) {
      draft.routes = disposeRouteList(draft.routes);
    }
  });

  function disposeRouteList(routeList) {
    if (!routeList.length) return routeList;
    return produce(routeList, draft => {
      return draft.map(route => routeProducer(route));
    });
  }

  return produce(routes, draft => {
    return draft.map(router => {
      return {
        ...router,
        routes: disposeRouteList(router.routes),
      };
    });
  });
}

/**
 * 结合前端静态路由配置 和 后端路由管理配置 获取当前用户真实可用的 路由 和 按钮权限列表
 * @param routes umi 根据 config/routes 前端静态路由配置 通过脚本生成 umi 框架的 router
 * @param authoritRoutes 后端返回当前用户路由可用配置
 * @see routes 生成规则请查阅 src/pages/.umi/router.js
 */
export function getRealAuthoritRoutes(routes: Route[], authoritRoutes: OriginRoute[]): RealAuthoritRoutes {
  let realRoute: Route[] = [];
  let realBtns: any = [];
  // let resRoute: Route[] = [];
  // resRoute = getDisponseRoutesByApi(authoritRoutes) as any;

  // 首页特殊处理
  _forEach(routes, iroute => {
    if (iroute && iroute.path === '/home') {
      realRoute.push(iroute);
    }
  });


  const mapRoutes = (iroute: Route, authoritRoute: OriginRoute) => {
    let validRoute: any = { ...iroute, routes: [] };
    // if (authoritRoute.routes && authoritRoute.routes.length) {
    //   authoritRoute.routes.forEach(vrte => {
    //     // 二级路由，不是具体页面那层
    //     if (vrte && vrte.routes && vrte.routes.length) {
    //       _forEach(vrte.routes, level3Route => {
    //         // 三级路由，不是具体页面那层
    //         if (level3Route && level3Route.routes && level3Route.routes.length) {
    //           _forEach(level3Route.routes, level4Route => {
    //             // 四级路由，是具体页面那层，
    //             if (level4Route && level4Route.routes && level4Route.routes.length) {
    //               const { path, routes, name } = level4Route;
    //               realBtns.push({ path, btnsList: routes, name });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   });
    // }

    if (iroute.routes && iroute.routes.length && authoritRoute.routes && authoritRoute.routes.length) {
      // validRoute.routes = iroute.routes.filter(ir => authoritRoute.routes.some(jr => jr.path === ir.path));
      _forEach(iroute.routes, ir => {
        _forEach(authoritRoute.routes, ar => {
          if (ir.path === ar.path) {
            validRoute.routes.push(mapRoutes(ir, ar));
            if (ar.path?.split('/').length === 5 && Array.isArray(ar.routes)) {
              const { path, routes, name } = ar;
              if (ar.routes.length) {
                realBtns.push({ path, btnsList: routes, name });
              } else {
                realBtns.push({ path, btnsList: [], name });
              }
            }
            // if (ar.routes && ar.routes.length && ar.routes[0].is_botton) {
            //   const { path, routes, name } = ar;
            //   realBtns.push({ path, btnsList: routes, name });
            // }
          }
        });
      });
    }

    return validRoute;
  };

  if (routes && routes.length && authoritRoutes && authoritRoutes.length) {
    authoritRoutes.forEach(item => {
      routes.forEach(iroute => {
        // 如果前端定义和api返回定义的路径相同
        if (iroute.path && iroute.path === item.path) {
          let route: Route = mapRoutes(iroute, item);
          realRoute.push(route);
        }
      });
    });
  }

  // console.log(JSON.stringify(realBtns));

  return {
    routesList: realRoute,
    btnsList: realBtns,
    rawRoutesList: authoritRoutes,
  };
}
