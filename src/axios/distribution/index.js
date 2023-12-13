import service from '../service';
import { useParseQuery } from '@/utils/useCommonTools';

const distribution = {
  // 分销数据统计
  getDistributionData: () => service.get('/agent/statistics'),
  // 分销推广员列表
  agentList: (page, query) => {
    const r = useParseQuery(query);
    return service.get(`/agent/${page}?${r}`);
  },
  // 推广订单列表
  promotionsOrderList: (page, query) => {
    const r = useParseQuery(query);
    return service.get(`/user_bill/${page}?${r}`);
  },
  // 修改分销配置
  updateDistributionSetting: (data) => service.post(`/distribution_setting/set`, data),
  // 获取分销配置
  getDistributionSetting: () => service.get(`/distribution_setting/get`),
};

export default distribution;
