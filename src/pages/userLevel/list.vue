<template>
  <div class="userLevel" v-loading="loading">
    <el-card shadow="never">
      <list-header @create="handleCreate" @refresh="getData"></list-header>
      <div class="main">
        <el-table :data="tableData" stripe>
          <el-table-column label="会员等级" align="left" prop="name"> </el-table-column>
          <el-table-column label="折扣率" align="center" prop="discount"> </el-table-column>
          <el-table-column label="等级序号" align="center" prop="level"> </el-table-column>
          <el-table-column label="状态" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :disabled="row.name === '超级管理员' || row.name === '运营'" :loading="loadingSwitch" :active-value="1" :inactive-value="0" @change="updateStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template #default="{ row }">
              <div>
                <el-button v-if="row.name !== '超级管理员' && row.name !== '运营'" type="primary" text size="small" @click="handleUpdate(row)">修改</el-button>
                <el-button v-if="row.name !== '超级管理员' && row.name !== '运营'" type="primary" text size="small" @click="handleDelete(row)">删除</el-button>
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
    <drawer-form :title="drawerFormTitle" ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
        </el-form-item>
        <el-form-item label="等级权重">
          <el-input v-model="form.level" placeholder="请输入等级权重"> </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="mr-2">累计消费满</small>
            <el-input v-model="form.max_price" class="!w-1/2">
              <template #append>元</template>
            </el-input>
            <small class="text-gray-400 flex text-xm">设置会员等级所需要的累计消费必须大于等于0,单位：元</small>
          </div>
          <div class="ml-4">
            <small class="mr-2">累计次数满</small>
            <el-input v-model="form.max_times" class="!w-1/2">
              <template #append>笔</template>
            </el-input>
            <small class="text-gray-400 flex text-xm">设置会员等级所需要的购买量必须大于等于0,单位：笔</small>
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)">
          <el-input v-model="form.discount" placeholder="请输入等级权重">
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex text-xm">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small>
        </el-form-item>
      </el-form>
    </drawer-form>
  </div>
</template>

<script name="userLevelList" setup>
import { ref, inject } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import listHeader from '@/components/listHeader.vue';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const { totalCount, currentPage, tableData, loadingSwitch, loading, handleCurrentChange, getData, updateStatus, handleDelete } = useGetTableData({
  getList: $api.user_level.getUserLevelList,
  updateStatus: $api.user_level.updateUserLevelStatus,
  delete: $api.user_level.deleteUserLevel,
});
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    name: '',
    level: 100,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0,
  },
  rules: {
    name: [{ required: true, message: '等级名称不能为空', trigger: 'blur' }],
  },
  update: $api.user_level.updateUserLevel,
  create: $api.user_level.createUserLevel,
  getData,
});
</script>
<style scoped>
.userLevel .el-form .el-form-item__content {
  @apply flex flex-wrap;
}
.userLevel .page {
  @apply flex justify-center items-center mt-4;
}
</style>
