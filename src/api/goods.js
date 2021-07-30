/**
 * goods 商品管理
 */
// 商品列表
import $ from '@/plugins/js/axios.config';
export const goodsList = (params) => {
  return $({
    url: 'goods',
    params,
  });
};
// 所有商品数据列表
export const getAllCategories = () => {
  return $({
    url: 'categories',
  });
};
// 获取参数列表
export const getCategories = (id, sel) => {
  return $({
    url: `categories/${id}/attributes`,
    params: { sel },
  });
};
// 添加商品
export const addShoppingLists = (data) => {
  return $({
    method: 'post',
    url: 'goods',
    data,
  });
};
