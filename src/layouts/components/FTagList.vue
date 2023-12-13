<template>
  <div class="f-tag-list">
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-change="pageJump">
      <el-tab-pane v-for="item in tabList" :closable="item.path !== '/'" :key="item.path" :label="item.title || '后台首页'"
        :name="item.path">
      </el-tab-pane>
    </el-tabs>
    <el-dropdown placement="bottom" @command="handleClose">
      <span class="tag-btn">
        <el-icon><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">全部关闭</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useTabList } from "@/hooks/useTabList.js";
const { activeTab, tabList, pageJump, removeTab, handleClose } = useTabList();
</script>

<style scoped>
.f-tag-list {
  @apply w-full h-full flex justify-between items-center overflow-hidden;
}

.f-tag-list .tag-btn {
  @apply bg-white flex justify-center items-center rounded;
  width: 32px;
  height: 32px;
}
</style>
<style>
.f-tag-list .el-tabs {
  min-width: 100px;
}

.f-tag-list .el-tabs__header {
  @apply m-0 border-none h-full;
}

.f-tag-list .el-tabs__header .el-tabs__nav-prev,
.f-tag-list .el-tabs__header .el-tabs__nav-next {
  height: 32px;
  line-height: 32px;
}

.f-tag-list .el-tabs__header .el-tabs__nav {
  @apply border-none;
}

.f-tag-list .el-tabs__header .el-tabs__item {
  @apply border-none bg-light-200 h-32px rounded;
}

.f-tag-list .el-tabs__header .el-tabs__item:nth-child(n + 2) {
  @apply ml-2;
}

/* .f-tag-list .el-tabs__header .el-tabs__item:last-child,
.f-tag-list .el-tabs__header .el-tabs__item.is-active {
  @apply px-2 !important;
} */

.f-tag-list .el-tabs .is-disabled {
  cursor: not-allowed;
  @apply text-gray-300;
}

.f-tag-list .el-tabs__content {
  @apply hidden;
}
</style>