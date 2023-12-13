<template>
  <div class="category" v-loading="loading">
    <el-card shadow="never">
      <list-header @create="handleCreate" @refresh="getData"></list-header>
      <div class="main">
        <el-tree :data="tableData" node-key="id" highlight-current :props="{ label: 'name', children: 'child' }">
          <template #default="{ node, data }">
            <div class="w-full py-2 flex justify-between items-center">
              <p class="flex items-center">
                <span class="ml-2">{{ data.name }}</span>
              </p>
              <p>
                <el-button type="primary" size="small" text @click="openRecommendGoods(data)" :loading="data.goodsDrawerLoading">推荐商品</el-button>
                <el-switch v-model="data.status" :loading="loadingSwitch" :active-value="1" :inactive-value="0" @change="updateStatus(data)"></el-switch>
                <el-button type="primary" size="small" text @click="handleUpdate(data)">修改</el-button>
                <el-button type="primary" size="small" text @click="handleDelete(data)">删除</el-button>
              </p>
            </div>
          </template>
        </el-tree>
      </div>
      <drawer-form :title="drawerFormTitle" ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" placeholder="名称"></el-input>
          </el-form-item>
        </el-form>
      </drawer-form>
      <recommend-goods ref="recommendGoodsRef" />
    </el-card>
  </div>
</template>
<script name="CategoryList" setup>
import { ref, inject } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import listHeader from '@/components/listHeader.vue';
import recommendGoods from './components/recommendGoods.vue';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const { tableData, loading, getData, loadingSwitch, updateStatus, handleDelete } = useGetTableData({
  getList: $api.category.getCategoryList,
  onGetListSuccess: (res) => {
    tableData.value = res.map((o) => {
      o.goodsDrawerLoading = false;
      return o;
    });
  },
  updateStatus: $api.category.updateCategoryStatus,
  delete: $api.category.deleteCategory,
});
const { drawerFormTitle, drawerFormRef,  form, formRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    name: '',
  },
  rules: {},
  update: $api.category.updateCategory,
  create: $api.category.createCategory,
  getData,
});

// 推荐商品逻辑
const recommendGoodsRef = ref(null);
const openRecommendGoods = (data) => {
  recommendGoodsRef.value.open(data);
};
</script>
<style>
.el-tree-node__content {
  padding: 20px 0;
}
</style>
