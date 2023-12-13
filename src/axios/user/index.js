import service from '../service';
import { useParseQuery } from '@/utils/useCommonTools';

const user = {
  // 用户列表
  getUserList: (page, query = { limit: 10, keyword: '', user_level_id: '' }) => {
    const r = useParseQuery(query);
    return service.get(`/user/${page}?${r}`);
  },
  // 增加用户
  createUser: (params) => service.post('/user', params),
  // 修改用户
  updateUser: (id, params) => service.post(`/user/${id}`, params),
  // 修改用户状态
  updateUserStatus: (id, params) => service.post(`/user/${id}/update_status`, params),
  // 删除会员
  deleteUser: (id) => service.post(`/user/${id}/delete`),
};

export default user;
