import { getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';
import logo from '../assets/logo-no.svg';
import styles from './UserLayout.less';
import { UserOutlined } from '@ant-design/icons';
import { getTitle } from '@/utils/utils';

export interface LoginLayoutProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const LoginLayout: React.FC<LoginLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getTitle(breadcrumb, location.pathname);

  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = 'favicon.png';
  document.getElementsByTagName('head')[0].appendChild(link);

  return <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={title} />
    </Helmet>

    <div className={styles.container}>
      <div className={styles.loginContent}>
        <div className={styles.logintop}>
          <div className={styles.loginheader}>
            {/* <Link to="/" style={{ float: 'left' }}>
              <img alt="logo" className={styles.logo_login} src={logo} />
            </Link> */}
            <img alt="logo" className={styles.logo_login} src={logo} />
            <Link to="/user/register" className={styles.regBtn}>
              <UserOutlined style={{ marginRight: 14 }} />
              注册帐号
            </Link>
          </div>
        </div>
        <div className={styles.boxContain}>
          <div className={styles.conBoxs}>
            {children}
          </div>
        </div>
        <div className={styles.aboutUs}>
          <div style={{ width: '340px' }}>
            <p className={styles.rebind_tits}>了解知蓝&nbsp;&nbsp;&nbsp;&nbsp;ABOUT US</p>
          </div>

        </div>
      </div>
      <div className={styles.footers}>
        copyright&nbsp;&nbsp;©2019&nbsp;&nbsp;深圳大地云坞科技有限公司&nbsp;版权所有&nbsp;&nbsp;粤ICP备19023754号-2
      </div>
    </div>
  </>;
};

export default connect()(LoginLayout);
