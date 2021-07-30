/**
 * 配置文件axios
 */
import axios from 'axios';
import { Message } from 'element-ui';

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
// 请求拦截器
axios.interceptors.request.use((config) => {
  // 在浏览器中获取token，查看是否有token
  var token = sessionStorage.getItem('super_user_ttzy');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
}),
  (err) => {
    return Promise.reject(err);
  };
// 添加响应拦截器，当用户token过期，返回至登陆页面
axios.interceptors.response.use((response) => {
  // 当响应成功并获得数据时，让其继续执行
  if (response.data && response.status) {
    return response;
  }
}),
  (err) => {
    console.log(err);
    Message.warning('登陆超时,请重新登陆');
    window.name = '/';
  };
export default axios;
