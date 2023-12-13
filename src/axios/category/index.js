import service from '../service';

const category = {
  // 商品分类列表
  getCategoryList: () => service.get(`/category`),
  // 增加商品分类
  createCategory: (params) => service.post('/category', params),
  // 修改商品分类
  updateCategory: (id, params) => service.post(`/category/${id}`, params),
  // 修改商品分类状态
  updateCategoryStatus: (id, params) => service.post(`/category/${id}/update_status`, params),
  // 删除商品分类
  deleteCategory: (id) => service.post(`/category/${id}/delete`),
  // 分类关联产品列表
  categoryProductList: (id) => service.get(`/app_category_item/list?category_id=${id}`),
  // 删除关联产品
  deleteCategoryProduct: (id) => service.post(`/app_category_item/${id}/delete`),
  // 关联产品
  categoryProduct: (params) => service.post(`/app_category_item`, params),
};

export default category;
