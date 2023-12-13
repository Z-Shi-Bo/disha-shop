import service from '../service';

const image_class = {
  // 获取图库分类
  queryImageClass: (page) => service.get('/image_class/' + page),
  // 新增图库分类
  addImageClass: (params) => service.post('/image_class', params),
  // 修改图库分类
  updateImageClass: (params, id) => service.post('/image_class/' + id, params),
  // 删除图库分类
  deleteImageClass: (id) => service.post(`/image_class/${id}/delete`),
  // 获取指定分类下的图片列表
  queryImageList: (id, page, limit = 10) => service.get(`/image_class/${id}/image/${page}?limit=${limit}`),
  // 修改图片名称
  updateImageName: (id, params) => service.post(`/image/${id}`, params),
  // 删除图片
  deleteImage: (params) => service.post(`/image/delete_all`, params),
  // 图片上传
  uploadImage: (params) => service.post(`/image/upload`, params),
};

export default image_class;
