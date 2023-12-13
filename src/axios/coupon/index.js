import service from '../service';

const coupon = {
  // 优惠券列表
  getCouponList: (page) => service.get(`/coupon/${page}`),
  // 增加优惠券
  createCoupon: (params) => service.post('/coupon', params),
  // 修改优惠券
  updateCoupon: (id, params) => service.post(`/coupon/${id}`, params),
  // 删除优惠券
  deleteCoupon: (id) => service.post(`/coupon/${id}/delete`),
  // 失效优惠券
  getCouponStatus: (id, params) => service.post(`/coupon/${id}/update_status`, params),
};

export default coupon;
