import React from 'react';
import { Link } from 'umi';
import { Button, Result } from 'antd';

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="抱歉，当前页面不存在"
    extra={
      <Button type="primary">
        <Link to="/home">返回首页</Link>
      </Button>
    }
  />
);

export default NotFound;
