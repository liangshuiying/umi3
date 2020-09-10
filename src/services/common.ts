import request from '@/utils/request';
import { underlize, downloadWithA, camelize } from '@/utils/utils';
import { split as _split } from 'lodash';

//获取会员属性列表
export async function getUserOptons() {
  return request('/v1/se/event/model/param/profile', {
    //return request('/admin/v1/se/event/model/param/profile', {
    method: 'GET',
  });
}

//获取事件列表
export async function getEventGroupList() {
  //return request('/admin/v1/se/event/model/list');
  return request('/v1/se/event/model/list');
}

//获取事件参数列表
export async function getEventParamList(query) {
  //return request('/admin/v1/se/event/model/param/event', {
  return request('/v1/se/event/model/param/event', {
    params: query
  });
}

//获取数据看板支持的聚合操作符
export async function getAggsList() {
  //return request('/admin/v1/data_board/aggregators');
  return request('/v1/data_board/aggregators');
}

// 获取标签列表
export async function getMarkTagList(data: MarkTagListSearchParams): Promise<ResponseListDTO<MarkTagListItemData>> {
  return request('/v1/user/label/search', {
    //return request('/admin/v1/user/label/search', {
    method: 'POST',
    data: underlize(data),
  });
}

// 查询标签分组及分组下的标签
export async function queryGroupAndLabel(): Promise<ResponseDTO<TagGroupDataItem[]>> {
  return request('/admin/v1/user/label/group/queryGroupAndLabel', {
    method: 'GET',
    params: { type: 0 }, // 0 代表查询所有
  });
}

// 获取事件模型详情
export async function getEventModelByKey(query: {
  eventModelKey: string;
}) {
  const res = await request('/admin/v1/se/event/model/key', {
    method: 'GET',
    params: underlize(query) as any,
  });

  return camelize(res) as ResponseDTO<EventModelByKey>;
}

export async function download<Req extends object | URLSearchParams | undefined = any, Res = any>(
  url: string,
  params?: Req,
) {
  const res = await request<Res>(url, {
    params,
    charset: 'utf8',
    getResponse: true,
  });
  if (res.response && res.response.status === 200) {
    const disposition = res.response.headers.get('content-disposition');
    if (disposition) {
      const filename = decodeURI(_split(disposition, 'filename=')[1]) as any;
      const blobData = new Blob(['\uFEFF' + res.data]);
      const blobUrl = window.URL.createObjectURL(blobData);
      downloadWithA(blobUrl, filename);
    }
    return Promise.resolve(res);
  } else {
    return Promise.reject(res);
  }
}
