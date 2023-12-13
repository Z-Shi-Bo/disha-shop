import service from '../service';

const settings = {
  // 获取系统设置
  getSystemSettings: () => service.get(`/sysconfig`),
  // 修改系统设置
  updateSystemSettings: (params) => service.post('/sysconfig', params),
  // 上传文件
  uploadFile: (params) => service.post(`/sysconfig/upload`, params),
};

export default settings;
