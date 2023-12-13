<template>
  <el-container class="h-full">
    <el-header>
      <f-header />
    </el-header>
    <el-container>
      <el-aside class="shadow-2xl" :width="store.isCollapse ? '64px' : '250px'">
        <f-menu />
      </el-aside>
      <el-main>
        <div class="tag-list" :style="{left: store.isCollapse ? '64px' : '250px'}">
          <f-tag-list />
        </div>
        <div style="height: 44px;"></div>
        <div class="main">
          <router-view v-slot="{ Component }">
            <Transition name="fade">
              <keep-alive max="10">
                <component :is="Component"></component>
              </keep-alive>
            </Transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup name="layouts">
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";
import FTagList from "./components/FTagList.vue";
import useUserStore from "@/stores/useUserStore";
const store = useUserStore();

</script>

<style scoped>
.el-container {
  overflow: hidden;
}
.el-container .el-header {
  padding: 0;
}
.el-container .el-header {
  height: 64px;
}
.el-container .el-container .el-main {
  @apply bg-light-500;
  padding: 0 12px;
}
.el-container .el-container .el-main .tag-list {
  height: 44px;
  transition: all .4s;
  @apply flex items-center fixed top-0 right-0 top-64px z-100 px-2 bg-light-500;
}
.el-container .el-container .el-main>.main {
  @apply px-2 py-2 overflow-hidden;
}
.el-container .el-aside {
  transition: width .3s ease-in-out;
  overflow: auto;
}
/* 过渡组件样式 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-active {
  transition-delay: .3s;
}

.fade-enter-from {
  opacity: 0;
  -webkit-transform: translate3d(0, -100%, 0);
  transform: translate3d(0, -100%, 0);
}

.fade-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}
</style>