import service from '../service';
import { useParseQuery, useParseArray } from '@/utils/useCommonTools';

const goods = {
  // 增加商品
  createGood: (params) => service.post('/goods', params),
  // 修改商品
  updateGood: (id, params) => service.post(`/goods/${id}`, params),
  // 批量上下架商品
  changeStatusGood: (ids, status) => service.post(`/goods/changestatus`, { ids, status }),
  // 商品列表
  getGoodList: (page, query) => {
    const r = useParseQuery(query);
    return service.get(`/goods/${page}?${r}`);
  },
  // 批量删除商品
  deleteGood: (ids) => {
    ids = useParseArray(ids);
    return service.post(`/goods/delete_all`, { ids });
  },
  // 批量恢复商品
  restoreGood: (ids) => {
    ids = useParseArray(ids);
    return service.post(`/goods/restore`, { ids });
  },
  // 彻底删除商品
  destroyGood: (ids) => {
    ids = useParseArray(ids);
    return service.post(`/goods/destroy`, { ids });
  },
  // 审核商品
  checkGood: (id, params) => service.post(`/goods/${id}/check`, params),
  // 设置商品轮播图
  bannersGood: (id, banners) => service.post(`/goods/banners/${id}`, banners),
  // 查看商品资料
  readsGood: (id) => service.get(`/goods/read/${id}`),
  // 更新商品规格
  updatesKusGood: (id, params) => service.post(`/goods/updateskus/${id}`, params),
  // 添加商品规格选项
  addGoodCard: (params) => service.post(`/goods_skus_card`, params),
  // 修改商品规格选项
  updateGoodCard: (id, params) => service.post(`/goods_skus_card/${id}`, params),
  // 删除商品规格选项
  deleteGoodCard: (id) => service.post(`/goods_skus_card/${id}/delete`),
  // 排序商品规格选项
  sortGoodCard: (params) => service.post(`/goods_skus_card/sort`, params),
  // 添加商品规格选项的值
  addGoodCardValue: (params) => service.post(`/goods_skus_card_value`, params),
  // 修改商品规格选项的值
  updateGoodCardValue: (id, params) => service.post(`/goods_skus_card_value/${id}`, params),
  // 删除商品规格选项的值
  deleteGoodCardValue: (id) => service.post(`/goods_skus_card_value/${id}/delete`),
  // 选择设置商品规格选项和值
  setGoodCardValue: (id, params) => service.post(`/goods_skus_card/${id}/set`, params),
};

export default goods;
