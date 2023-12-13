import axios from 'axios';
import base_url from './config';
import { useToast } from '@/utils/useMessage';
import { getCookies } from '@/utils/useCookies';
import useUserStore from '@/stores/useUserStore';

const service = axios.create({
  baseURL: base_url,
  timeout: 10000,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    const cookie = getCookies();
    if (cookie) {
      config.headers['token'] = cookie;
    }
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.request.responseType === 'blob' ? response.data : response.data.data;
  },
  function (error) {
    const store = useUserStore();
    const msg = error?.response?.data?.msg || '请求失败';
    if (msg === '非法token，请先登录！') {
      store.removeCancel();
      location.reload();
    }
    useToast(msg, 'error');
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
