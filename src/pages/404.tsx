import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';
 // 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

class NoFoundPage extends React.PureComponent {
  public BackBtn = () => {
    return (
      <Button type="primary" onClick={this.handleBack}>
        返回首页
      </Button>
    );
  };

  public render() {
    return <Result status="404" title="404" subTitle="抱歉，当前页面不存在" extra={this.BackBtn()} />;
  }

  private handleBack = () => {
    history.push('/');
  };
}

export default NoFoundPage;
