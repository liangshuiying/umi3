import React from 'react';

export const EnumAuthorityStatus = {
  NO_MATCH : '403',
  NOT_FOUND : '404'
}

export type IAuthorityType = null | undefined | string;

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } authority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 * @param { 不存在的组件 | not found components } NotFound
 */
const checkPermissions = <T, K, N>(
  authority: IAuthorityType,
  target: T,
  Exception: K,
  NotFound: N,
): T | K | N | React.ReactNode => {
  // 没有判定权限.默认查看所有
  if (authority === EnumAuthorityStatus.NOT_FOUND) {
    return NotFound;
  }
  if (authority === EnumAuthorityStatus.NO_MATCH) {
    return Exception;
  }
  if (authority) {
    return target;
  }
  return;
};

export { checkPermissions };

function check<T, K, N>(authority: IAuthorityType, target: T, Exception: K, NotFound: N): T | K | React.ReactNode {
  return checkPermissions<T, K, N>(authority, target, Exception, NotFound);
}

export default check;
