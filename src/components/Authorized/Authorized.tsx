import React from 'react';
import check, { IAuthorityType } from './CheckPermissions';

export interface AuthorizedProps {
  authority: IAuthorityType;
  noMatch?: React.ReactNode;
  notFound?: React.ReactNode;
}

const Authorized: React.FC<AuthorizedProps> = ({ children, authority, noMatch, notFound }) => {
  const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
  // authority：当前路由是否有访问权限：如有，则值为当前路由信息，如没有，则值为undefined；
  // childrenRender：所有路由集合
  const dom = check(authority, childrenRender, noMatch, notFound);
  return <>{dom}</>;
};

export default Authorized;
