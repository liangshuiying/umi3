/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import request, { extend } from 'umi-request';
import { notification } from 'antd';
// import { storage } from '@/helpers/storage';
import Cookies from 'js-cookie';
import moment from 'moment';
import md5 from 'md5';
import { history } from 'umi';
import { sortByAscll } from './utils';

interface MD5Datas {
  background_type?: string;
  domain_id?: string;
  Timestamp?: string;
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户无权限访问。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

request.interceptors.request.use((url: string, options: any) => {
  let domainId: string | null = null,
    accessToken: string | null = null;

  if (Cookies.get('currentAuthority') && JSON.parse(Cookies.get('currentAuthority') || '{}').access_token) {
    domainId = JSON.parse(Cookies.get('currentAuthority') || '{}').domain_id;
    accessToken = JSON.parse(Cookies.get('currentAuthority') || '{}').access_token;
  }
  const { method, data, headers: tempHeader = {}, params } = options;
  let extData = {},
    md5Data: MD5Datas = {};
  let timestamp = moment().unix() * 1000;

  if (method !== 'get') {
    extData = {
      domain_id: domainId || null,
      background_type: '0',
    };
  }

  if (process.env.API_ENV !== 'development') {
    url = url.replace(/\/api\//g, '');
    // url = configs[process.env.API_ENV].API_SERVER + url;
  }

  if (method === 'get' || method === 'delete') {
    md5Data = Object.assign({}, options.params);
    md5Data.background_type = '0';
    md5Data.domain_id = domainId ? domainId + '' : 'null';
    md5Data = Object.assign({}, md5Data, options.params);
  }

  md5Data.Timestamp = timestamp + '';
  let sortData = JSON.stringify(sortByAscll(md5Data));
  let headers = Object.assign(
    {},
    {
      //Access_token: accessToken, // 所有请求默认带上 token 参数
      Authorization: 'Bearer ' + accessToken,
      Timestamp: timestamp,
      Sign: md5(sortData).toUpperCase(),
      //Sign: 'D2B9793B-0EDC-468B-B734-852891C7DFD8',
      domain_id: domainId || null,
    },
    tempHeader,
  );

  let reqParam = {};
  if (method === 'get' || method === 'delete') {
    reqParam = Object.assign({}, { background_type: '0', domain_id: domainId || 'null' }, params);
  }

  // 如果要使用 log 功能，请在根目录创建 .env.local 文件，然后添加 DEBUG=true 这一行
  // 如果要使用 log 功能，请在根目录创建 .env.local 文件，然后添加 DEBUG=true 这一行
  // 如果要使用 log 功能，请在根目录创建 .env.local 文件，然后添加 DEBUG=true 这一行
  // TODO DONT LOG IN A COMMON FILE
  // TODO DONT LOG IN A COMMON FILE
  // TODO DONT LOG IN A COMMON FILE
  if (DEBUG) {
    console.log('data=====post======', data);
  }

  return {
    url,
    options: {
      ...options,
      headers,
      params: reqParam,
      data: Object.assign({}, extData, data),
    },
  };
});

request.interceptors.response.use(async response => {
  let httpStatus = '';
  try {
    const { status } = response as any;
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const responseClone = await response.clone();
    const contentType = responseClone.headers.get('Content-Type') as any;
    if (contentType.includes('application/json')) {
      // 不是下载
      const data = await responseClone.json();
      // console.log('data====response==========', data);
      if (status === 400 && data && data.error && data.error.code === '010008') {
        history.push('/users/login');
        httpStatus = '请重新登录';
        return;
      }
      return await response.json();
    }
  } catch (error) {
    notification.error({
      message: `请求错误 ${httpStatus}`,
      description: '未知错误',
    });
  }

  return response;
});

/**
 * 配置request请求时的默认参数
 */

const OMOrequest = extend({
  errorHandler, // 默认错误处理
  credentials: 'omit', // credentials,omit,same-origin,include 请求是否带上cookie
});

export default OMOrequest;
