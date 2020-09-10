import React from 'react';
import { Redirect } from 'umi';
import Cookies from 'js-cookie';

const SecurityLayout: React.FC<any> = props => {
  // let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  // link.type = 'image/x-icon';
  // link.rel = 'icon';
  // link.href = '/favicon.png';
  // document.getElementsByTagName('head')[0].appendChild(link);

  const { children } = props;
  let isLogin = false;
  if (Cookies.get('currentAuthority') && JSON.parse(Cookies.get('currentAuthority') || '{}').access_token) {
    isLogin = true;
  }

  if (!isLogin) {
    return <Redirect to={`/users/login`}></Redirect>;
  }

  return children;
};
export default SecurityLayout;
