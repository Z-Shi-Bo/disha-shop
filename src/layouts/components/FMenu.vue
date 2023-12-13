<template>
  <el-menu :default-active="defaultRoute" unique-opened :collapse-transition="false" :collapse="store.isCollapse"
    @select="handleSelect">
    <template v-for="(item, index) in menuData" :key="item.id">
      <el-sub-menu :index="item.name" v-if="item.child && item.child.length">
        <template #title>
          <el-icon>
            <!-- <i-ep-help /> -->
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item :index="ite.frontpath" v-for="(ite, idx) in item.child" :key="ite.id">
          <template #title>
            <el-icon>
              <component :is="ite.icon"></component>
            </el-icon>
            <span>{{ ite.name }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item :index="item.frontpath" v-else>
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <template #title>{{ item.name }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { computed, ref } from "vue";
import useUserStore from "@/stores/useUserStore";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
const router = useRouter();
const route = useRoute();
const store = useUserStore();
const menuData = computed(() => store.userInfo?.menus);
let defaultRoute = ref(route.fullPath);
// 监听路由发生变化
onBeforeRouteUpdate((to, from) => {
  if (to.fullPath!== from.fullPath) {
    defaultRoute.value = to.fullPath;
  }
});
const handleSelect = (path) => {
  router.push(path);
};
</script>

<style scoped>
.el-menu {
  border: none;
  overflow: hidden;
}
</style>