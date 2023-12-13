import service from '../service';
import { useParseQuery, useParseArray } from '@/utils/useCommonTools';

const order = {
  // 订单列表
  getOrderList: (page, query = { limit: 10, tab: '' }) => {
    const r = useParseQuery(query);
    return service.get(`/order/${page}?${r}`);
  },
  // 批量删除订单
  deleteAllOrder: (ids) => {
    ids = useParseArray(ids);
    return service.post(`/order/delete_all`, ids);
  },
  // 订单发货
  shipOrder: (id, data) => service.post(`/order/${id}/ship`, data),
  // 拒绝or同意退款
  handleOrRefundOrder: (id, data) => service.post(`/order/${id}/handle_refund`, data),
  // 导出订单
  exportOrder: (query) => {
    const r = useParseQuery(query);
    return service.post(`/order/excelexport?${r}`, {}, { responseType: 'blob' });
  },
  // 快递公司列表
  expressCompanyList: () => service.get(`/express_company/1`),
  // 查看订单物流信息
  getShipInfo: (id) => service.get(`/order/${id}/get_ship_info`),
};

export default order;
