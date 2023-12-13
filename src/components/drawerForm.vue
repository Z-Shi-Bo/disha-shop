<template>
  <el-drawer v-model="isShowDrawer" :title="title" direction="rtl" :close-on-click-modal="false" :size="size" :destroy-on-close="destroyOnClose">
    <div class="drawer-form-container">
      <div class="form-content"><slot /></div>
      <div class="form-button">
        <el-button type="primary" @click="submit" :loading="loadingBtn">{{ confirmText }}</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  title: {
    type: String,
  },
  size: {
    type: String,
    default: "45%",
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "提交",
  },
  loadingBtn: {
    type: Boolean,
    default: false,
  }
});
const isShowDrawer = ref(false);
const open = () => isShowDrawer.value = true;
const emit = defineEmits(["submit", "close"]);
const close = () => {
  isShowDrawer.value = false;
  emit("close");
};
const submit = () => { emit("submit") };
defineExpose({
  open,
  close,
});
</script>

<style scoped>
.drawer-form-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.drawer-form-container .form-content {
  height: calc(100% - 50px);
  overflow-y: auto;
}
.drawer-form-container .form-button {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>