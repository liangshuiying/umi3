import Permission from './Permission';
import React from 'react';
import { Button } from 'antd';

const AuthButton = ({ code, path, children, ...otherProps }) => {
  return (
    <Permission path={path} code={code}>
      <Button {...otherProps}>{children}</Button>
    </Permission>
  );
};

export default AuthButton;
