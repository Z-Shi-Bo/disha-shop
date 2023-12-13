<template>
  <div class="f-header">
    <div class="left-header">
      <a class="logo">
        <el-icon size="20" color="#fff" class="mr-2">
          <i-ep-eleme-filled />
        </el-icon>
        仕博编程
      </a>
      <p class="common-icon" @click="collapseChange">
        <el-icon size="20" color="#fff">
          <i-ep-fold v-if="store.isCollapse" />
          <i-ep-expand v-else />
        </el-icon>
      </p>
      <p class="common-icon" @click="refreshPage">
        <el-icon size="20" color="#fff">
          <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
            <i-ep-refresh-right />
          </el-tooltip>
        </el-icon>
      </p>
    </div>
    <div class="right-header">
      <p class="common-icon">
        <el-icon size="20" color="#fff">
          <i-ep-video-camera-filled />
        </el-icon>
      </p>
      <el-tooltip class="box-item" effect="dark" :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
        <p class="common-icon" @click="fullScreenChange">
          <el-icon size="20" color="#fff">
            <i-ep-full-screen v-if="!isFullscreen" />
            <i-ep-aim v-else />
          </el-icon>
        </p>
      </el-tooltip>
      <el-dropdown trigger="click" class="ml-10" @command="handleCommand">
        <span class="user-info">
          <img :src="userInfo.avatar" class="img" alt="无">
          {{ userInfo.username }}
          <el-icon><i-ep-arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <drawer-form ref="drawerBoxRef" title="修改密码" @submit="onSubmit" @close="onClose" :loadingBtn="loadingBtn">
      <el-form ref="drawerFormRef" :model="form" :rules="rules">
        <el-form-item label="旧密码" placeholder="请输入密码" prop="oldPassword" label-width="100">
          <el-input v-model="form.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" placeholder="请输入新密码" prop="newPassword" label-width="100">
          <el-input v-model="form.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" placeholder="请输入确认密码" prop="confirmPassword" label-width="100">
          <el-input v-model="form.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
    </drawer-form>
  </div>
</template>

<script setup>
import { useFullscreen } from "@vueuse/core";
import drawerForm from "../../components/drawerForm.vue";
const { isFullscreen, toggle } = useFullscreen();
import { useRepassword, useLogout } from "@/hooks/useHeader";
const { userInfo, form, rules, loadingBtn, drawerBoxRef, drawerFormRef, store, onSubmit, onClose, collapseChange, open, } = useRepassword();
const { logout } = useLogout();
// 监听下拉事件
const handleCommand = (command) => {
  if (!command) return;
  if (command === "logout") {
    logout();
  } else {
    // store.drawerChange();
    open();
  }
};
// 刷新页面
const refreshPage = () => {
  location.reload();
};
// 全屏事件
const fullScreenChange = () => {
  toggle();
};
</script>

<style scoped>
.f-header {
  @apply h-full bg-indigo-700 flex justify-between items-center;
}

.f-header .left-header {
  @apply flex items-center h-full;
}

.f-header .left-header .logo {
  @apply w-250px text-light-50 text-xl tracking-2px font-sans flex justify-center items-center cursor-pointer;
}

.f-header .common-icon {
  @apply flex justify-center items-center px-2 cursor-pointer h-full hover:(bg-indigo-600);
}

.f-header .right-header {
  @apply px-10 flex items-center h-full;
}

.f-header .right-header .user-info {
  @apply flex text-light-50 items-center;
}

.f-header .right-header .img {
  @apply w-25px h-25px rounded-1/2 mr-2;
}
</style>