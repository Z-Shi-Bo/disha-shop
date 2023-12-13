const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页',
    },
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/goods/list',
    name: 'GoodsList',
    meta: {
      title: '商品管理',
    },
    component: () => import('@/pages/goods/list.vue'),
  },
  {
    path: '/category/list',
    name: 'CategoryList',
    meta: {
      title: '分类管理',
    },
    component: () => import('@/pages/category/list.vue'),
  },
  {
    path: '/user/list',
    name: 'UserList',
    meta: {
      title: '用户管理',
    },
    component: () => import('@/pages/user/list.vue'),
  },
  {
    path: '/order/list',
    name: 'OrderList',
    meta: {
      title: '订单管理',
    },
    component: () => import('@/pages/order/list.vue'),
  },
  {
    path: '/setting/base',
    name: 'SettingBase',
    meta: {
      title: '基础设置',
    },
    component: () => import('@/pages/setting/base.vue'),
  },
  {
    path: '/setting/buy',
    name: 'SettingBuy',
    meta: {
      title: '交易设置',
    },
    component: () => import('@/pages/setting/buy.vue'),
  },
  {
    path: '/setting/ship',
    name: 'SettingShip',
    meta: {
      title: '物流设置',
    },
    component: () => import('@/pages/setting/ship.vue'),
  },
  {
    path: '/image/list',
    name: 'ImageList',
    meta: {
      title: '图库管理',
    },
    component: () => import('@/pages/image/list.vue'),
  },
  {
    path: '/comment/list',
    name: 'CommentList',
    meta: {
      title: '评价管理',
    },
    component: () => import('@/pages/comment/list.vue'),
  },
  {
    path: '/coupon/list',
    name: 'CouponList',
    meta: {
      title: '优惠券管理',
    },
    component: () => import('@/pages/coupon/list.vue'),
  },
  {
    path: '/notice/list',
    name: 'NoticeList',
    meta: {
      title: '公告管理',
    },
    component: () => import('@/pages/notice/list.vue'),
  },
  {
    path: '/manager/list',
    name: 'ManagerList',
    meta: {
      title: '管理员管理',
    },
    component: () => import('@/pages/manager/list.vue'),
  },
  {
    path: '/access/list',
    name: 'AccessList',
    meta: {
      title: '权限管理',
    },
    component: () => import('@/pages/access/list.vue'),
  },
  {
    path: '/role/list',
    name: 'RoleList',
    meta: {
      title: '角色管理',
    },
    component: () => import('@/pages/role/list.vue'),
  },
  {
    path: '/skus/list',
    name: 'SkusList',
    meta: {
      title: '规格管理',
    },
    component: () => import('@/pages/skus/list.vue'),
  },
  {
    path: '/level/list',
    name: 'UserLevelList',
    meta: {
      title: '会员等级',
    },
    component: () => import('@/pages/userLevel/list.vue'),
  },
  {
    path: '/distribution/index',
    name: 'DistributionIndex',
    meta: {
      title: '分销员管理',
    },
    component: () => import('@/pages/distribution/index.vue'),
  },{
    path: '/distribution/setting',
    name: 'DistributionSetting',
    meta: {
      title: '分销设置',
    },
    component: () => import('@/pages/distribution/setting.vue'),
  },
];
export default routes;
