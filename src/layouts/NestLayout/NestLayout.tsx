import logo from '@/assets/logo.svg';
import logoRight from '@/assets/logo_4.svg';
import { DefaultRootState } from '@/typings/connect';
import { GlobalModelState } from '@/models/globalModel';
import Authorized from '@/utils/Authorized';
import NoMatch from '@/components/Exception/NoMatch';
import NotFound from '@/components/Exception/NotFound';
import { getAuthorityFromRouter } from '@/utils/utils';
import { IAuthorityType } from '@/components/Authorized/CheckPermissions';
import { getRealAuthoritRoutes } from './utils';
import { INestLayoutProps } from './interface.d';
import { useNestLayoutActions } from './actions';
import RightContent from './RightContent';
import styles from './index.module.less';
import { Layout, Row, Col, Divider } from 'antd';
import { Route } from '@ant-design/pro-layout/es/typings';
import Cookies from 'js-cookie';
import { Link } from 'umi';
import { useLocation, useSelector } from 'dva';
import { map as _map, get as _get, split as _split, find as _find } from 'lodash';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
// import CustomEmpty from './Empty';

// Empty.PRESENTED_IMAGE_SIMPLE = <CustomEmpty />;

const { Content } = Layout;

const defaultFooter = (
  <DefaultFooter copyright="深圳大地云坞科技有限公司&nbsp;版权所有&nbsp;&nbsp;粤ICP备19023754号-2" links={[]} />
);

const NestLayout: React.FC<INestLayoutProps> = props => {
  const { route, children } = props;
  const { routes } = route;
  const location = useLocation();

  const activeModulePath = `/${_get(_split(location.pathname, '/'), 1)}`;

  const global = useSelector<DefaultRootState, GlobalModelState>(state => state.global);
  const { fetchAuth, storeAllRoutesAndBtns } = useNestLayoutActions();

  const { routesList } = global;

  const initAuth = async (accountName: string, accountId: string) => {
    const res = await fetchAuth({
      account_name: accountName,
      account_id: accountId,
    });

    if (res && res.status === 1) {
      if (routes) {
        let autRoutes = getRealAuthoritRoutes(routes, res.data);
        await storeAllRoutesAndBtns(autRoutes);
      }
    }
  };

  useEffect(() => {
    let { account_name, account_id } = JSON.parse(Cookies.get('currentAuthority') || '{}');
    // let accountName = storage.get('accountName');
    // let accountId = storage.get('accountId');
    if (global.list && global.list.length === 0) {
      // 如果无菜单就去调接口获取，然后存储原始数据
      initAuth(account_name, account_id);
    }
  }, []);

  const getSubRoutes = () => {
    const currentMod = _find(routesList, { path: activeModulePath });
    if (!currentMod) {
      return undefined;
    }
    return currentMod.routes as Route[];
  };

  const subRoutes = React.useMemo(getSubRoutes, [routesList, activeModulePath]);
  const authoritys = getAuthorityFromRouter(global.rawRoutesList, routes, location.pathname);

  const renderLogo = React.useMemo(() => {
    let { isv_logo } = JSON.parse(Cookies.get('currentAuthority') || '{}');
    if (isv_logo) {
      return (
        <Row justify="start" align="middle">
          <Col style={{ marginLeft: 8, marginRight: 17 }}>
            <img src={isv_logo} style={{ height: 40, width: 40 }} alt="开发者logo" />
          </Col>
          <Divider type="vertical" style={{ margin: 0, height: 16 }} />
          <Col style={{ marginLeft: 17 }}>
            <img src={logoRight} style={{ height: 40, width: 40 }} alt="知蓝logo" />
          </Col>
        </Row>
      );
    }
    return logo;
  }, []);

  return (
    <div className={styles.layout}>
      <ProLayout
        location={location}
        logo={renderLogo}
        title="知蓝平台"
        fixedHeader
        locale="zh-CN"
        fixSiderbar
        route={{
          routes: _map(routesList, routeItem => {
            return {
              ...routeItem,
              hideChildrenInMenu: true,
            };
          }),
        }}
        rightContentRender={() => <RightContent />}
        menuItemRender={(item, dom) => <Link to={item.path!}>{dom}</Link>}
        disableContentMargin
        layout="topmenu"
        navTheme="light"
      >
        <ProLayout
          location={location}
          route={{
            routes: subRoutes,
          }}
          fixSiderbar
          fixedHeader
          locale="zh-CN"
          title="知蓝平台"
          // 修改判断，不显示左侧固定菜单
          // menuRender={(_, dom) => ((location.pathname !== '/home' && location.pathname !== '/adds') ? dom : null)}
          menuRender={(_, dom) => (location.pathname !== '/home' ? dom : null)}
          siderWidth={180}
          headerRender={false}
          navTheme="light"
          menuItemRender={(item, dom) => <Link to={item.path!}>{dom}</Link>}
          menuHeaderRender={false}
          contentStyle={{ flex: 1 }}
          iconfontUrl="//at.alicdn.com/t/font_1520299_fbecw7efzzd.js"
        >
          <Layout className={styles.nestLayout}>
            <Content style={{ margin: 0 }}>
              <Authorized authority={authoritys as IAuthorityType} noMatch={<NoMatch />} notFound={<NotFound />}>
                {children}
              </Authorized>
            </Content>
            {defaultFooter}
          </Layout>
        </ProLayout>
      </ProLayout>
    </div>
  );
};

export default NestLayout;
