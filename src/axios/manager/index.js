import service from '../service';
import { useParseQuery } from '@/utils/useCommonTools';

const manager = {
  // 管理员列表
  queryManager: (page, query = { limit: 10, keyword: '' }) => {
    const r = useParseQuery(query);
    return service.get(`/manager/${page}?${r}`);
  },
  // 增加管理员
  createManager: (params) => service.post('/manager', params),
  // 修改管理员
  updateManager: (id, params) => service.post(`/manager/${id}`, params),
  // 修改管理员状态
  updateManagerStatus: (id, params) => service.post(`/manager/${id}/update_status`, params),
  // 删除管理员
  deleteManager: (id) => service.post(`/manager/${id}/delete`),
};

export default manager;
