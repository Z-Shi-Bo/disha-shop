<template>
  <div class="choose-image">
    <div class="avatar-uploader" v-if="preview">
      <el-image v-if="typeof modelValue === 'string' && modelValue" :src="modelValue" class="avatar mr-2" fit="cover" />
      <template v-else>
        <div class="relative avatar mx-1 mb-2" v-for="(url, index) in modelValue" :key="index">
          <el-icon class="!absolute top-[5px] right-[5px] bg-white cursor-pointer rounded-full z-10" @click.stop="removeImage(url)"><CircleClose /></el-icon>
          <el-image :src="url" class="avatar" fit="cover" />
        </div>
      </template>
      <el-icon v-if="preview" class="avatar-uploader-icon rounded" @click.stop="beforeUpload"><Plus /></el-icon>
    </div>
    <el-dialog title="图片选择" v-model="dialogVisible" top="3%" width="80%">
      <div class="flex h-65vh">
        <image-aside ref="imageAsideRef" @changeId="updateActiveId" />
        <image-main ref="imageMainRef" :limit="limit" checked @choose="handleChoose" />
      </div>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import imageAside from '@/components/imageAside.vue';
import imageMain from '@/components/imageMain.vue';
import { useToast } from '@/utils/useMessage';
const dialogVisible = ref(false);
const imageAsideRef = ref(null);
const imageMainRef = ref(null);
let imageUrl = ref([]);
const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1,
  },
  preview: {
    type: Boolean,
    default: true,
  },
});
console.log(typeof props.modelValue);
const emit = defineEmits(['update:modelValue']);
// 子组件id切换
const updateActiveId = (id) => {
  imageMainRef.value.loadData(id);
};
// 上传头像前的回调
// 父组件传递过来的回调函数
const callbackFn = ref(null);
const beforeUpload = (callback = null) => {
  if (callback) {
    callbackFn.value = callback;
  }
  dialogVisible.value = true;
};
// 子组件选择图片后的回调
const handleChoose = (imageOption) => {
  if (imageOption.checked) {
    imageUrl.value.push(imageOption.url);
  } else {
    const index = imageUrl.value.findIndex((item) => item === imageOption.url);
    imageUrl.value.splice(index, 1);
  }
};
// 移除图片
const removeImage = (url) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((item) => item !== url)
  );
};
//  提交
const submit = () => {
  let urlList = null;
  if (props.limit > 1) {
    urlList = props.preview ? props.modelValue.concat(imageUrl.value) : imageUrl.value;
    if (urlList.length > props.limit) {
      const limit = props.preview ? props.limit - props.modelValue.length : props.limit;
      return useToast('最多还能选择' + limit + '张图片');
    }
  } else {
    urlList = imageUrl.value[0];
  }
  if (urlList && props.preview) {
    emit('update:modelValue', urlList);
  }
  if (!props.preview && typeof callbackFn.value === 'function') {
    callbackFn.value(urlList);
  }
  dialogVisible.value = false;
};

defineExpose({
  beforeUpload,
});
</script>
<style scoped>
/* .choose-image {
  width: 100px;
  height: 100px;
} */
.choose-image .avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 5px;
}
</style>

<style>
.choose-image .avatar-uploader {
  display: flex;
  flex-wrap: wrap;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.choose-image .el-icon.avatar-uploader-icon {
  border: 1px solid var(--el-border-color);
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
