import $ from '@/plugins/js/axios.config';
/**
 * 商品参数所需api
 */
// 添加参数
export const addParams = (id, data) => {
  return $({
    method: 'post',
    url: `categories/${id}/attributes`,
    data,
  });
};

// 编辑提交参数
export const exitParams = (id, attrId, data) => {
  return $({
    method: 'put',
    url: `categories/${id}/attributes/${attrId}`,
    data,
  });
};
// 删除参数
export const deleteParams = (id, attrId) => {
  return $({
    method: 'delete',
    url: `categories/${id}/attributes/${attrId}`,
  });
};
