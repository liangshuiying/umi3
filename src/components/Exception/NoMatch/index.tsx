import React from 'react';
import { Link } from 'umi';
import { Result, Button } from 'antd';

const NoMatch = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，您暂时无权访问此页面."
    extra={
      <Button type="primary">
        <Link to="/home">返回首页</Link>
      </Button>
    }
  />
);

export default NoMatch;
