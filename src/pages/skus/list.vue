<template>
  <div class="skus" v-loading="loading">
    <el-card shadow="never">
      <list-header layout="create,refresh,delete" @create="handleCreate" @refresh="getData" @delete="handleDeleteAll"></list-header>
      <div class="main">
        <el-table :data="tableData" @selection-change="handleSelectionChange" stripe>
          <el-table-column type="selection" width="55" />
          <el-table-column label="规格名称" align="left" prop="name"> </el-table-column>
          <el-table-column label="规格值" align="left" prop="default"> </el-table-column>
          <el-table-column label="排序" align="center" prop="order"> </el-table-column>
          <el-table-column label="状态" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :disabled="row.name === '超级管理员' || row.name === '运营'" :loading="loadingSwitch" :active-value="1" :inactive-value="0" @change="updateStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template #default="{ row }">
              <div>
                <el-button type="primary" text size="small" @click="handleUpdate(row)">修改</el-button>
                <el-button type="primary" text size="small" @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
    </el-card>
    <!-- 新增侧边栏 -->
    <drawer-form :title="drawerFormTitle" destroyOnClose ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" placeholder="请输入排序"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <tag-input v-model="form.default" />
        </el-form-item>
      </el-form>
    </drawer-form>
  </div>
</template>

<script name="SkusList" setup>
import { inject } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import listHeader from '@/components/listHeader.vue';
import tagInput from '@/components/tagInput.vue';
import { useToast } from '@/utils/useMessage';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const { totalCount, currentPage, tableData, loadingSwitch, loading, handleCurrentChange, getData, updateStatus, handleDelete, handleSelectionChange, handleDeleteAll } = useGetTableData({
  getList: $api.skus.getSkusList,
  updateStatus: $api.skus.updateSkusStatus,
  delete: $api.skus.deleteSkus,
});
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    name: '',
    order: 50,
    status: 1,
    default: '',
  },
  rules: {
    name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }],
    default: [{ required: true, message: '规格值不能为空', trigger: 'blur' }],
  },
  update: $api.skus.updateSkus,
  create: $api.skus.createSkus,
  getData,
});
</script>
<style scoped>
.skus .search {
  @apply flex justify-between items-center mb-4;
}
.skus .search .search-input {
  width: 400px;
}
.skus .page {
  @apply flex justify-center items-center mt-4;
}
</style>
