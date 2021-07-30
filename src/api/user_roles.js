import $ from '@/plugins/js/axios.config';

export const getAllRoles = () => {
  return $({
    url: 'roles',
  });
};

// 菜单权限
export const getMenus = () => {
  return $({
    url: 'menus',
  });
};
// 权限列表
export const getAuth = () => {
  return $({
    url: 'rights/list',
  });
};
