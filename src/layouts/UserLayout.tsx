import { getTitle } from '@/utils/utils';
import logo from '../assets/logo-no.svg';
import styles from './UserLayout.less';
import { getMenuData, MenuDataItem } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';

export interface UserLayoutProps{
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}
const UserLayout: React.FC<UserLayoutProps> = props => {
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
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.contains}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
          </div>
          <div className={styles.conBox}>
            <div className={styles.userBox}>{children}</div>
          </div>
        </div>
        <div className={styles.footers}>
          copyright&nbsp;&nbsp;©2019&nbsp;&nbsp;深圳大地云坞科技有限公司&nbsp;版权所有&nbsp;&nbsp;粤ICP备19023754号-2
        </div>
      </div>
    </>
  );
};

export default connect()(UserLayout);
