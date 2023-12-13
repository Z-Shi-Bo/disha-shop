<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top">
      <el-row :gutter="24">
        <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index" class="mb-4">
          <el-card shadow="hover" class="relative" :class="{ active: item.checked }">
            <el-image :src="item.url" fit="cover" class="w-full h-[150px]" :preview-src-list="[item.url]"></el-image>
            <div class="image-title">{{ item.name }}</div>
            <div class="h-[40px] flex justify-center items-center">
              <el-checkbox v-if="checked" v-model="item.checked" @change="handleChooseChange(item)"></el-checkbox>
              <el-button type="primary" text size="small" @click="renameImage(item)">重命名</el-button>
              <el-button type="primary" text size="small" @click="deleteImage(item)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
    </div>
    <drawer-form title="上传图片" :loadingBtn="loadingBtn" size="30%" ref="drawerFormRef" @submit="handleSubmit">
      <upload-file ref="uploadFileRef" :data="{ image_class_id: searchId }" @success="handleSuccess" @error="handleError"></upload-file>
    </drawer-form>
  </el-main>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { usePrompt, useToast, useMessageBox } from '@/utils/useMessage';
import drawerForm from '@/components/drawerForm.vue';
import uploadFile from '@/components/uploadFile.vue';
const props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 1,
  },
});
const $api = inject('api');
const totalCount = ref(0);
const currentPage = ref(1);
const searchId = ref(0);
const list = ref([]);
let loadingBtn = ref(false);
let loading = ref(false);
const drawerFormRef = ref(null);
// 获取图片数据
const queryImageList = () => {
  loading.value = true;
  $api.image_class
    .queryImageList(searchId.value, currentPage.value)
    .then((res) => {
      totalCount.value = res.totalCount;
      list.value = res.list.map((item) => {
        item.checked = false;
        return item;
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
// 分页
const handleCurrentChange = (val) => {
  currentPage.value = val;
  queryImageList();
};
// 暴露的获取数据初始方法
const loadData = (id) => {
  searchId.value = id;
  currentPage.value = 1;
  queryImageList();
};
// 重命名
const renameImage = (item) => {
  usePrompt('重命名', item.name).then(({ value }) => {
    $api.image_class.updateImageName(item.id, { name: value }).then((res) => {
      useToast('修改成功');
      queryImageList();
    });
  });
};
// 删除
const deleteImage = (item) => {
  useMessageBox('删除', '是否要删除该图片？', 'warning')
    .then((confirm) => {
      $api.image_class.deleteImage({ ids: [item.id] }).then((res) => {
        useToast('删除成功');
        queryImageList();
      });
    })
    .catch((cancel) => {
      console.log(cancel);
    });
};
const uploadFileRef = ref(null);
// 暴露的上传 图片方法
const handleCreate = () => {
  drawerFormRef.value.open();
};
// 图片的提交事件
const handleSubmit = () => {
  loadingBtn.value = true;
  uploadFileRef.value.submit();
};

// 监听子组件的文件上传成功事件
const handleSuccess = () => {
  loadingBtn.value = false;
  drawerFormRef.value.close();
  currentPage.value = 1;
  queryImageList();
};
// 监听子组件的文件上传失败事件
const handleError = ({ error }) => {
  const msg = JSON.parse(error.message).msg || '上传失败';
  useToast(msg, 'error');
  loadingBtn.value = false;
  drawerFormRef.value.close();
};

const emit = defineEmits(['choose']);
const checkedImage = computed(() => list.value.filter((item) => item.checked));
// 图库图片选中事件
const handleChooseChange = (item) => {
  if (item.checked && checkedImage.value.length > props.limit) {
    item.checked = false;
    return useToast(`最多只能选择${props.limit}张图片`, 'error');
  }
  emit('choose', item);
};
// 方法暴露出去给父组件调用
defineExpose({
  loadData,
  handleCreate,
});
</script>
<style scoped>
.image-main {
  position: relative;
}
.image-main .top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 50px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
}
.image-main .bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  @apply flex justify-center items-center;
}
.active {
  @apply border-blue-500;
}
::v-deep(.el-card__body) {
  padding: 0;
}
.image-title {
  position: absolute;
  left: -1px;
  right: -1px;
  top: 122px;
  @apply px-2 py-1 text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800;
}
</style>
