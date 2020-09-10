import Permission from './Permission';
import React from 'react';

const AuthLink = ({ code, path, children, ...otherProps }) => {
  return (
    <Permission path={path} code={code}>
      <a {...otherProps}>{children}</a>
    </Permission>
  );
};

export default AuthLink;
