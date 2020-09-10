import * as styles from './index.module.less';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import cls from 'classnames';
import { Spin } from 'antd';

interface ScrollLoaderWrapperProps {
  onLoad: () => void;
  hasMore: boolean;
  pageSize?: number;
  noHasMoreDataMsg?: React.ReactNode;
  loading?: React.ReactNode;
  className?: string;
  children?: JSX.Element;
  style?: any;
}

class ScrollLoaderWrapper extends React.Component<ScrollLoaderWrapperProps, any> {
  constructor(props) {
    super(props);
    // NOTE: 内部维护一个 items， 触发滚动加载，我也不知道 why
    this.state = {
      items: this.genElem(),
    };
  }

  private genElem = () => {
    return Array(this.props.pageSize || 2).fill(10);
  };

  private handleLoadMore = () => {
    //console.log('triggger load more');
    const { items } = this.state;
    items.push(...this.genElem());
    this.setState({ items }, () => {
      this.props.onLoad();
    });
    // 模拟异步
    // setTimeout(() => {
    //   const { items } = this.state;
    //   items.push(...this.genElem());
    //   this.setState({ items }, () => {
    //     this.props.onLoad();
    //   });
    // }, 1000);
  };

  render() {
    const { className, hasMore, loading, children, noHasMoreDataMsg = '', style } = this.props;
    const { items } = this.state;
    //console.log(items);

    return (
      <div
        id="scrollableDiv"
        className={cls(styles.scrollLoaderWrapper, className)}
        style={{ overflowX: 'hidden', ...style }}
      >
        <InfiniteScroll
          dataLength={items.length}
          next={this.handleLoadMore}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          style={{ overflowX: 'hidden' }}
          endMessage={noHasMoreDataMsg}
          loader={
            loading || (
              <div style={{ display: 'flex', justifyContent: 'center', color: '#5AA6FF' }}>
                {/* <Spin tip="加载中..." /> */}
                加载中...
              </div>
            )
          }
        >
          {children}
        </InfiniteScroll>
      </div>
    );
  }
}

export default ScrollLoaderWrapper;
