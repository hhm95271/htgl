import $ from '@/plugins/js/axios.config';
/**
 * 角色管理api
 */
// 角色列表数据
export const getRoleList = () => {
  return $({
    url: 'roles',
  });
};
// 编辑提交角色基本数据
export const EditSubmitRole = (data) => {
  return $({
    method: 'put',
    url: 'roles/' + data.id,
    data: { roleName: data.roleName, roleDesc: data.roleDesc },
  });
};
// 删除角色
export const deleteRole = (id) => {
  return $({
    url: `roles/${id}`,
    method: 'delete',
  });
};
// 角色授权添加
export const roleAuthorization = (roleId, rids) => {
  return $({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids },
  });
};
// 添加列表角色
export const addListRole = (data) => {
  return $({
    url: 'roles',
    method: 'post',
    data,
  });
};
