import request from '@/utils/request';
import { fetchQAuth } from './response_data';

export async function getAuthorities(params: any) {
  //return Promise.resolve(fetchQAuth);
  // TODO 临时解决
  return request('/v1/domain/account/authorities', {
    params,
  });
}
