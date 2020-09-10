import request from '@/utils/request';

export async function queryFakeList(params: any) {
  return request('/api/fake_list', {
    params,
  });
}
export async function getAuthorities(params: any) {
  return request('/admin/v1/domain/account/authorities', {
    params,
  });
}

export async function getCount() {
  return request('/admin/v1/user/member/count');
}
