import service from '../service';
import { useParseArray } from '@/utils/useCommonTools';

const skus = {
  // 商品规格列表
  getSkusList: (page) => service.get(`/skus/${page}`),
  // 增加商品规格
  createSkus: (params) => service.post('/skus', params),
  // 修改商品规格
  updateSkus: (id, params) => service.post(`/skus/${id}`, params),
  // 删除商品规格
  deleteSkus: (ids) => {
    ids = useParseArray(ids);
    return service.post(`/skus/delete_all`, { ids });
  },
  // 修改商品规格状态
  updateSkusStatus: (id, params) => service.post(`/skus/${id}/update_status`, params),
};

export default skus;
