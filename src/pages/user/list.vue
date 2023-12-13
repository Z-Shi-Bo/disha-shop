<template>
  <div class="user" v-loading="loading">
    <el-card shadow="never">
      <div class="search">
        <el-form class="w-full flex justify-between" :model="searchForm" label-width="80px" :inline="false" size="small">
          <search @search="getData" @reset="resetSearchForm" :mode="searchForm">
            <search-item label="关键词">
              <el-input class="search-input" v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称" size="small" clearable />
            </search-item>
            <template #showSearch>
              <search-item label="会员等级">
                <el-select v-model="searchForm.user_level_id" clearable placeholder="请选择会员等级">
                  <el-option v-for="item in userLevelList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </search-item>
            </template>
          </search>
        </el-form>
      </div>
      <list-header @create="handleCreate" @refresh="getData"></list-header>
      <div class="main">
        <el-table :data="tableData" stripe>
          <el-table-column label="会员" align="left">
            <template #default="{ row }">
              <div class="flex items-center">
                <el-avatar :size="40" :src="row.avatar">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <div class="ml-3">
                  <h6 class="text-sm font-medium">{{ row.username }}</h6>
                  <small>ID：{{ row.id }}</small>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="会员等级" align="center">
            <template #default="{ row }">
              <div>
                {{ row.user_level?.name || '-' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="登录注册" align="center">
            <template #default="{ row }">
              <div>注册时间：{{ row.create_time }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :disabled="row.super === 1" :loading="loadingSwitch" :active-value="1" :inactive-value="0" @change="updateStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="140">
            <template #default="{ row }">
              <div v-if="row.super === 1">暂无操作</div>
              <div v-else>
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
    <drawer-form :title="drawerFormTitle" ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码"> </el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称"> </el-input>
        </el-form-item>
        <el-form-item label="头像">
          <choose-image v-model="form.avatar"></choose-image>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="form.user_level_id" placeholder="请选择会员等级">
            <el-option v-for="item in userLevelList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.phone" placeholder="请输入手机"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"> </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
    </drawer-form>
  </div>
</template>

<script name="UserList" setup>
import { ref, inject } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import chooseImage from '@/components/chooseImage.vue';
import listHeader from '@/components/listHeader.vue';
import search from '@/components/search.vue';
import searchItem from '@/components/searchItem.vue';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const userLevelList = ref([]);
const { searchForm, totalCount, currentPage, tableData, loadingSwitch, loading, handleCurrentChange, getData, resetSearchForm, updateStatus, handleDelete } = useGetTableData({
  searchForm: {
    keyword: '',
    user_level_id: '',
  },
  getList: $api.user.getUserList,
  onGetListSuccess: (res) => {
    totalCount.value = res.totalCount;
    tableData.value = res.list;
    userLevelList.value = res.user_level;
  },
  updateStatus: $api.user.updateUserStatus,
  delete: $api.user.deleteUser,
});
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    username: '',
    password: '',
    avatar: '',
    user_level_id: null,
    status: 1,
    nickname: '',
    phone: '',
    email: '',
  },
  rules: {},
  update: $api.user.updateUser,
  create: $api.user.createUser,
  getData,
});
</script>
<style scoped>
.user .search {
  @apply flex justify-between items-center mb-4;
}
.user .search .search-input {
  width: 400px;
}
.user .page {
  @apply flex justify-center items-center mt-4;
}
</style>
