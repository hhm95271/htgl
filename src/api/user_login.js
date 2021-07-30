import $ from '@/plugins/js/axios.config';
// 用户登陆接口
export const user_login = (data) => {
  return $({
    method: 'POST',
    url: '/login',
    data,
  });
};
// 获取用户信息
export const Alluser_List = (params) => {
  return $({
    url: 'users',
    params,
  });
};
