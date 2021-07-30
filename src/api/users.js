import $ from '@/plugins/js/axios.config';
/**
 * 用户列表api
 */
// 用户列表数据
export const getAllUsers = (params) => {
  return $({
    url: 'users',
    params,
  });
};
// 修改用户状态
export const modificationState = (id, type) => {
  return $({
    method: 'put',
    url: `users/${id}/state/${type}`,
  });
};
// 编辑用户提交
export const editSubmission = (id, data) => {
  return $({
    method: 'put',
    url: `users/${id}`,
    data,
  });
};
// 删除用户
export const deleteRowUsers = (id) => {
  return $({
    url: 'users/' + id,
    method: 'delete',
  });
};
// 获取角色列表
export const getRoles = () => {
  return $({
    url: 'roles',
  });
};
// 分配用户角色权限
export const allocationUser = (data) => {
  return $({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid },
  });
};
// 添加用户
export const netLocalgourp = (data) => {
  return $({
    method: 'post',
    url: 'users',
    data,
  });
};
