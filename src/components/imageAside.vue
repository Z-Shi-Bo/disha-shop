<template>
  <el-aside width="220px" class="image-aside">
    <div class="top">
      <aside-list :active="activeIndex === item.id" v-for="(item, index) in imageList" :key="index" @edit="editClass(item)" @delete="deleteClass(item.id)" @click="updateActiveId(item.id)">{{
        item.name
      }}</aside-list>
    </div>
    <div class="bottom">
      <el-pagination background layout="prev, next" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
    </div>
  </el-aside>
  <drawer-form :title="drawerFormTitle" :loadingBtn="loadingBtn" ref="drawerFormRef" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="图库类型" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" :min="1" />
      </el-form-item>
    </el-form>
  </drawer-form>
</template>

<script setup>
import asideList from './asideList.vue';
import drawerForm from '@/components/drawerForm.vue';
import { ref, inject, reactive, computed } from 'vue';
import { useToast, useMessageBox } from '@/utils/useMessage';
const $api = inject('api');
const imageList = ref([]);
let currentPage = ref(1);
let activeIndex = ref(0);
let totalCount = ref(0);
// 获取图库列表
const queryImageClassData = () => {
  $api.image_class.queryImageClass(currentPage.value).then((res) => {
    imageList.value = res.list || [];
    totalCount.value = res.totalCount || 0;
    const item = imageList.value[0];
    if (item) {
      updateActiveId(item.id);
    }
  });
};
queryImageClassData();
// 切换分页
const handleCurrentChange = (val) => {
  currentPage.value = val;
  queryImageClassData();
};
// 新增和编辑图库
const drawerFormRef = ref(null);
const formRef = ref(null);
const loadingBtn = ref(false);
let editId = ref(0);
const drawerFormTitle = computed(() => (editId.value > 0 ? '修改' : '新增'));
const form = reactive({
  name: '',
  order: 1,
});
const rules = reactive({
  name: [{ required: true, message: '图库分类不能为空', trigger: 'blur' }],
});
const handleCreate = () => {
  form.name = '';
  form.order = 1;
  editId.value = 0;
  drawerFormRef.value.open();
};
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    loadingBtn.value = true;
    (editId.value > 0 ? updateImageClass() : addImageClass())
      .then((res) => {
        useToast(drawerFormTitle.value + '成功');
        drawerFormRef.value.close();
        queryImageClassData();
      })
      .finally(() => {
        loadingBtn.value = false;
      });
  });
};
// 新增
const addImageClass = () => {
  return $api.image_class.addImageClass(form);
};
// 修改
const updateImageClass = () => {
  return $api.image_class.updateImageClass(form, editId.value);
};
// 编辑列表
const editClass = (row) => {
  editId.value = row.id;
  form.name = row.name;
  form.order = row.order;
  drawerFormRef.value.open();
};
// 删除
const deleteClass = (id) => {
  useMessageBox('删除', '是否要删除该分类？', 'warning')
    .then((confirm) => {
      $api.image_class.deleteImageClass(id).then((res) => {
        console.log(res);
      });
    })
    .catch((cancel) => {
      console.log(cancel);
    });
};
// 切换
const emit = defineEmits(['changeId']);
const updateActiveId = (id) => {
  activeIndex.value = id;
  emit('changeId', id);
};
defineExpose({
  handleCreate,
});
</script>
<style scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  @apply flex justify-center items-center;
}
</style>
