import service from '../service';

const statistics = {
  // 后台首页统计1
  statistics1: (params) => service.get('/statistics1', { params }),
  // 后台首页统计2
  statistics2: (params) => service.get('/statistics2', { params }),
  // 后台首页统计3
  statistics3: (params) => service.get('/statistics3', { params }),
};

export default statistics;
