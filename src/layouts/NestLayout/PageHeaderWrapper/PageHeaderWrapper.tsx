import { PageHeader, Tabs } from 'antd';
import React, { useContext } from 'react';
import { RouteContext, GridContent } from '@ant-design/pro-layout';
import classNames from 'classnames';
import { TabsProps, TabPaneProps } from 'antd/es/tabs';
import { PageHeaderProps } from 'antd/es/page-header';
import { RouteContextType } from '@ant-design/pro-layout/es/RouteContext';

import './index.less';

export interface PageHeaderTabConfig {
  tabList?: TabPaneProps[];
  tabActiveKey?: TabsProps['activeKey'];
  onTabChange?: TabsProps['onChange'];
  tabBarExtraContent?: TabsProps['tabBarExtraContent'];
  tabProps?: TabsProps;
}

export interface PageHeaderWrapperProps extends PageHeaderTabConfig, Omit<PageHeaderProps, 'title'> {
  title?: React.ReactNode | false;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
  pageHeaderRender?: (props: PageHeaderWrapperProps) => React.ReactNode;
}

const prefixedClassName = 'ant-pro-page-header-wrap';

/**
 * render Footer tabList
 * In order to be compatible with the old version of the PageHeader
 * basically all the functions are implemented.
 */
const renderFooter: React.SFC<Omit<PageHeaderWrapperProps, 'title'>> = ({
  tabList,
  tabActiveKey,
  onTabChange,
  tabBarExtraContent,
  tabProps,
}) => {
  if (tabList && tabList.length) {
    return (
      <Tabs
        className={`${prefixedClassName}-tabs`}
        activeKey={tabActiveKey}
        onChange={key => {
          if (onTabChange) {
            onTabChange(key);
          }
        }}
        tabBarExtraContent={tabBarExtraContent}
        {...tabProps}
      >
        {tabList.map(item => (
          <Tabs.TabPane {...item} tab={item.tab} key={item.key} />
        ))}
      </Tabs>
    );
  }
  return null;
};

const renderPageHeader = (content: React.ReactNode, extraContent: React.ReactNode): React.ReactNode => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div className={`${prefixedClassName}-detail`}>
      <div className={`${prefixedClassName}-main`}>
        <div className={`${prefixedClassName}-row`}>
          {content && <div className={`${prefixedClassName}-content`}>{content}</div>}
          {extraContent && <div className={`${prefixedClassName}-extraContent`}>{extraContent}</div>}
        </div>
      </div>
    </div>
  );
};

const defaultPageHeaderRender = (props: PageHeaderWrapperProps, value: RouteContextType): React.ReactNode => {
  const { title, content, pageHeaderRender, extraContent, style, ...restProps } = props;

  if (pageHeaderRender) {
    return pageHeaderRender({ ...props, ...value });
  }
  let pageHeaderTitle = title;
  if (!title && title !== false) {
    pageHeaderTitle = value.title;
  }
  return (
    <PageHeader {...value} title={pageHeaderTitle} {...restProps} footer={renderFooter(restProps)}>
      {renderPageHeader(content, extraContent)}
    </PageHeader>
  );
};

const PageHeaderWrapper: React.SFC<PageHeaderWrapperProps> = props => {
  const { children, style } = props;
  const value = useContext(RouteContext);
  const className = classNames(prefixedClassName, props.className);
  let borderBottomWidth = 24;
  const noExtra = props.content === void 0 && props.extraContent === void 0;
  if (noExtra) {
    borderBottomWidth = 0;
  }
  const headerStyle = { borderBottom: `${borderBottomWidth}px solid #F3F5FA` };

  let contentMarginTop = borderBottomWidth === 0 ? 24 : 0;
  if (noExtra) {
    headerStyle['backgroundColor'] = '#F3F5FA';
    contentMarginTop = 0;
  }
  return (
    <div style={style} className={className}>
      <div className={`${prefixedClassName}-page-header-warp`} style={headerStyle}>
        <GridContent>{defaultPageHeaderRender(props, value)}</GridContent>
      </div>

      {children ? (
        <GridContent>
          <div className={`${prefixedClassName}-children-content`} style={{ marginTop: contentMarginTop }}>
            {children}
          </div>
        </GridContent>
      ) : null}
    </div>
  );
};

export default PageHeaderWrapper;
