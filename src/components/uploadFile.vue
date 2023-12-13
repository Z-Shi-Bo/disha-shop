<template>
  <el-upload ref="uploadRef" drag :action="uploadImageAction" multiple name="img" :on-success="handleSuccess" :on-error="handleError" :data="data" :headers="{ token }" :auto-upload="false">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">文件拖到此处或 <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </template>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue';
import { getCookies } from '@/utils/useCookies';
const uploadImageAction = '/api/image/upload';
const uploadRef = ref(null);
const token = getCookies();
defineProps({
  data: Object,
});
const emit = defineEmits(['success', 'error']);
// 上传成功
const handleSuccess = () => {
  emit('success');
  uploadRef.value.clearFiles();
};
// 上传失败
const handleError = (error) => {
  emit('error', {
    error,
  });
};
// 提交
const submit = () => {
  uploadRef.value.submit();
};

defineExpose({
  submit,
});
</script>
