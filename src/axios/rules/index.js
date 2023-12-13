import service from '../service';

const rules = {
  // 菜单权限列表
  getRuleList: (page) => service.get(`/rule/${page}`),
  // 增加菜单权限
  createRule: (params) => service.post('/rule', params),
  // 修改菜单权限
  updateRule: (id, params) => service.post(`/rule/${id}`, params),
  // 删除菜单权限
  deleteRule: (id) => service.post(`/rule/${id}/delete`),
  // 修改菜单权限状态
  updateRuleStatus: (id, params) => service.post(`/rule/${id}/update_status`, params),
};

export default rules;
