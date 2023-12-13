import service from '../service';

const roles = {
  // 角色列表
  getRoleList: (page) => service.get(`/role/${page}`),
  // 增加角色
  createRole: (params) => service.post('/role', params),
  // 修改角色
  updateRole: (id, params) => service.post(`/role/${id}`, params),
  // 删除角色
  deleteRole: (id) => service.post(`/role/${id}/delete`),
  // 修改角色状态
  updateRoleStatus: (id, params) => service.post(`/role/${id}/update_status`, params),
  // 配置角色权限
  setRules: (params) => service.post(`/role/set_rules`, params),
};

export default roles;
