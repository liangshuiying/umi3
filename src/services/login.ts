import request from '@/utils/request';
import { underlize } from '@/utils/utils';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request('/v1/account/login', {
    method: 'POST',
    data: underlize(params),
  });
}

export async function getCaptcha(params: any) {
  return request('/admin/v1/account/mobile_number', {
    params: underlize(params) || {},
  });
}

export async function accountLogout(params: any) {
  return request('/admin/v1/domain/account/logout', {
    method: 'POST',
    data: underlize(params),
  });
}
