import service from '../service';

const notice = {
  // 公告列表
  queryNotice: (page) => service.get(`/notice/${page}`),
  // 增加公告
  addNotice: (params) => service.post('/notice', params),
  // 修改公告
  updateNotice: (id, params) => service.post(`/notice/${id}`, params),
  // 删除公告
  deleteNotice: (id) => service.post(`/notice/${id}/delete`),
};

export default notice;
