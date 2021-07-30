import $ from '@/plugins/js/axios.config';
/**
 * 商品分类管理api
 */
// 获取所有商品分类数据
export const allCategoriesData = (type) => {
  return $({
    url: 'categories',
    params: type,
  });
};
// 编辑提交分类
export const exitCategories = (id, data) => {
  return $({
    method: 'put',
    url: `categories/${id}`,
    data,
  });
};
// 删除分类
export const deleteCategories = (id) => {
  return $({
    method: 'delete',
    url: `categories/${id}`,
  });
};
