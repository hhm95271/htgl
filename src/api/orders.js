import $ from '@/plugins/js/axios.config';
/**
 * 订单列表
 */
// 获取订单
export const getAllOrders = (params) => {
  return $({
    url: 'orders',
    params,
  });
};
// 修改订单状态
export const modifyOrders = (id, data) => {
  return $({
    method: 'put',
    url: 'orders/' + id,
    data,
  });
};
// 订单详情
export const getParticulars = (id) => {
  return $({
    url: 'orders/' + id,
  });
};
