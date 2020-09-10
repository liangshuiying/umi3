/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = <T>(Authorized: T): (() => T) => () => Authorized;

export default <T>(Authorized: T) => renderAuthorize<T>(Authorized);
