import LayoutWrapper from './PageHeaderWrapper';
import styles from './index.module.less';
import React from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import { BreadcrumbProps, Route } from 'antd/es/breadcrumb/Breadcrumb';
import cls from 'classnames';
import { Link } from 'umi';

export interface IPageHeaderWrapperProps{
  headerTransparent?: boolean;
  padding?: number;
  bg?: string;
  style?: object;
  className? :string;
}

function itemRender(route: Route, params: any, routes: Route[]) {
  let disableTwo = false;
  if (routes.length === 3 && routes[1].breadcrumbName === routes[2].breadcrumbName) {
    disableTwo = true;
  }
  const first = routes.indexOf(route) === 0;
  const last = routes.indexOf(route) === routes.length - 1;

  if (first) {
    return (
      <>
        <span>当前位置：</span>
        <Link to={route.path}>{route.breadcrumbName}</Link>
      </>
    );
  }

  return last ? (
    <span className={styles.lastText}>{route.breadcrumbName}</span>
  ) : disableTwo ? null : (
    <Link to={route.path}>{route.breadcrumbName}</Link>
  );
}

const PageHeaderWrapper: React.FC<IPageHeaderWrapperProps> = props => {
  const { padding = 24, bg = 'white', headerTransparent = false, className, style, ...rest } = props;
  return (
    <RouteContext.Consumer>
      {value => {
        const { routes } = value.breadcrumb as Pick<BreadcrumbProps, 'routes'>;
        return (
          <LayoutWrapper
            title={false}
            breadcrumb={{ routes, itemRender, separator: '/' }}
            className={cls(styles.wrap, className, { [styles.headerTransparent]: headerTransparent })}
            {...rest}
          >
            <div style={{ padding, background: bg, ...style }} className={styles.minHeight}>
              {props.children}
            </div>
          </LayoutWrapper>
        );
      }}
    </RouteContext.Consumer>
  );
};

export default PageHeaderWrapper;
