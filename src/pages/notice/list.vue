<template>
  <div class="notice" v-loading="loading">
    <el-card shadow="never">
      <list-header @create="handleCreate" @refresh="getData"></list-header>
      <div class="main">
        <el-table :data="tableData" stripe>
          <el-table-column label="公告标题" align="left" prop="title"></el-table-column>
          <el-table-column label="公告内容" align="left" prop="content"></el-table-column>
          <el-table-column label="发布时间" align="center" width="300" prop="create_time"></el-table-column>
          <el-table-column label="操作" align="center" width="140">
            <template #default="{ row }">
              <div>
                <el-button type="primary" text size="small" @click="handleUpdate(row)">修改</el-button>
                <el-button type="primary" text size="small" @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
      <drawer-form :title="drawerFormTitle" ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" placeholder="公告标题"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input type="textarea" :rows="4" v-model="form.content" placeholder="公告内容" :maxlength="-1" :show-word-limit="false"> </el-input>
          </el-form-item>
        </el-form>
      </drawer-form>
    </el-card>
  </div>
</template>

<script name="NoticeList" setup>
import { inject} from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import listHeader from '@/components/listHeader.vue';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const { totalCount, currentPage, tableData, loading, getData, handleCurrentChange, handleDelete } = useGetTableData({
  getList: $api.notice.queryNotice,
  delete: $api.notice.deleteNotice,
});
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    title: '',
    content: '',
  },
  rules: {
    title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
  },
  update: $api.notice.updateNotice,
  create: $api.notice.addNotice,
  getData,
});
</script>
<style scoped>
.notice .bottom {
  @apply flex justify-center items-center mt-4;
}
</style>
