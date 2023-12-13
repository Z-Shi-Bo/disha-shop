<template>
  <el-container class="bg-white rounded h-full" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" @click="addImageType">新增图片分类</el-button>
      <el-button type="warning" @click="uploadImage">上传图片</el-button>
    </el-header>
    <el-container class="overflow-hidden">
      <image-aside ref="imageAsideRef" @changeId="updateActiveId" />
      <image-main ref="imageMainRef" />
    </el-container>
  </el-container>
</template>

<script name="ImageList" setup>
import imageAside from '@/components/imageAside.vue';
import imageMain from '@/components/imageMain.vue';
import { ref } from 'vue';
const imageAsideRef = ref(null);
const imageMainRef = ref(null);
const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;
// 新增图片分类
const addImageType = () => {
  imageAsideRef.value.handleCreate();
};
// 图片上传
const uploadImage = () => {
  imageMainRef.value.handleCreate();
};
// 子组件id切换
const updateActiveId = (id) => {
  imageMainRef.value.loadData(id);
};
</script>
<style scoped>
.image-header {
  @apply flex items-center border-b;
}
</style>
