import $ from '@/plugins/js/axios.config';
/**
 * 权限管理
 */
export const getAllRights = (type) => {
  return $({
    url: `rights/${type}`,
  });
};
