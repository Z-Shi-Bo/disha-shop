import { createRouter, createWebHashHistory } from "vue-router";
import { getCookies } from "@/utils/useCookies";
import routes from "./routes";
import useUserStore from "@/stores/useUserStore";
import Nprogress from "nprogress";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "layouts",
      component: () => import("@/layouts/index.vue"),
    },
    {
      path: "/about",
      name: "about",
      meta: {
        title: "关于",
      },
      component: () => import("@/pages/about.vue")
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: "登录",
      },
      component: () => import("@/pages/login.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      meta: {
        title: "404",
      },
      component: () => import("@/pages/error/404.vue")
    },
  ],
});
let hasGetInfo = false;
router.beforeEach(async (to, from, next) => {
  Nprogress.start();
  const store = useUserStore();
  // 判断是否有cookies
  const cookie = getCookies() || false;
  // 没有登录，且不是跳转登录页
  if (!cookie && to.name !== "login") {
    return next("/login");
  };
  if (cookie && to.name === "login") {
    // 防止重复登录
    return next(from.path || "/");
  };
  // 页面动态标题
  document.title = to.meta.title || "帝莎";
  // 实时获取用户信息
  let hasNeaRoutes = false;
  if (cookie && !hasGetInfo) {
    const { menus } = await store.getUserInfo();
    hasGetInfo = true;
    hasNeaRoutes = addRoutes(menus);
  };
  // 判断是否有新增路由
  hasNeaRoutes ? next(to.fullPath) : next();
});
router.afterEach((to, from) => {
  Nprogress.done();
});

// 对应的路由信息
const routeInfo = {
  "/goods/list": "GoodsList",
  "/category/list": "CategoryList",
  "/": "home"
};

function addRoutes(menus) {
  let hasNeaRoutes = false;
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach(menu => {
      const newRoute = routes.find(item => item.path === menu.frontpath);
      // hasRoute 是根据路由name筛选的
      if (newRoute && !router.hasRoute(routeInfo[newRoute.path])) {
        router.addRoute("layouts", newRoute);
        hasNeaRoutes = true;
      };
      if (menu.child && menu.child.length) {
        findAndAddRoutesByMenus(menu.child);
      }
    });
  };
  findAndAddRoutesByMenus(menus);
  return hasNeaRoutes;
};

export default router;
