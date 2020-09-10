// import { storage } from '@/helpers/storage';
import Cookies from 'js-cookie';

// 获取当前cookie值
export function getAuthority(str?: string) {
  const authorityString =
    // typeof str === 'undefined' && storage.get('currentAuthority');
    typeof str === 'undefined' && Cookies.get('currentAuthority');

  let authority;

  try {
    if (authorityString) {
      authority = authorityString;
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}
