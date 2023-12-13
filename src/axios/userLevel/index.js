import service from '../service';

const user_level = {
  // 会员等级列表
  getUserLevelList: (page) => service.get(`/user_level/${page}`),
  // 增加会员等级
  createUserLevel: (params) => service.post('/user_level', params),
  // 修改会员等级
  updateUserLevel: (id, params) => service.post(`/user_level/${id}`, params),
  // 修改会员等级状态
  updateUserLevelStatus: (id, params) => service.post(`/user_level/${id}/update_status`, params),
  // 删除会员等级
  deleteUserLevel: (id) => service.post(`/user_level/${id}/delete`),
};

export default user_level;
