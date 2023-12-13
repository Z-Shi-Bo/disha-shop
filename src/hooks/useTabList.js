import { ref, onBeforeMount } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useStorage } from "@vueuse/core";

export function useTabList() {
  const router = useRouter();
  const route = useRoute();
  const localSessionStorageTabList = useStorage("tab-list", [], sessionStorage);
  const activeTab = ref(route.fullPath);
  const tabList = ref([
    {
      title: "后台首页",
      path: "/"
    }
  ]);
  // 标签跳转
  const pageJump = (targetPath) => {
    router.push(targetPath);
  };
  // 删除标签
  const removeTab = (targetPath) => {
    const tabs = tabList.value;
    let active = activeTab.value;
    tabs.forEach((tab, index) => {
      if (tab.path === targetPath) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          active = nextTab.path;
        }
        return;
      };
    });
    activeTab.value = active;
    tabList.value = tabList.value.filter(tab => tab.path !== targetPath);
    localSessionStorageTabList.value = tabList.value;
  };
  // 添加标签导航
  const addTab = (tab) => {
    const notTab = tabList.value.findIndex(t => t.path === tab.path) === -1;
    if (notTab) {
      tabList.value.push(tab);
    };
    localSessionStorageTabList.value = tabList.value;
    activeTab.value = tab.path;
  };
  // 初始化标签导航列表
  const initTabList = () => {
    if (localSessionStorageTabList.value.length) {
      tabList.value = localSessionStorageTabList.value;
    }
  };
  // 关闭事件
  const handleClose = (val) => {
    if (val === "other") {
      tabList.value = tabList.value.filter((item) => (item.path === "/" || item.path === activeTab.value));
    } else {
      activeTab.value = "/";
      tabList.value = [{ title: "后台首页", path: "/" }];
    }
    localSessionStorageTabList.value = tabList.value;
  };
  // 页面路由更改时
  onBeforeRouteUpdate((to, from) => {
    addTab({
      title: to.meta.title,
      path: to.path
    });
  });
  // 渲染页面之前获取标签数据
  onBeforeMount(() => {
    initTabList();
  });

  return {
    activeTab,
    tabList,
    pageJump,
    removeTab,
    handleClose
  };
}