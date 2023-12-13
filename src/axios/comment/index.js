import service from '../service';
import { useParseQuery } from '@/utils/useCommonTools';

const comment = {
  // 商品评价列表
  getCommentList: (page, query = { limit: 10, keyword: '', goods_comment_level_id: '' }) => {
    const r = useParseQuery(query);
    return service.get(`/goods_comment/${page}?${r}`);
  },
  // 修改商品评价状态
  updateCommentStatus: (id, params) => service.post(`/goods_comment/${id}/update_status`, params),
  // 回复商品评价
  reviewComment: (id, data) => service.post(`/goods_comment/review/${id}`, { data }),
};

export default comment;
