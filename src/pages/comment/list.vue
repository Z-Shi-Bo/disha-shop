<template>
  <div class="comment" v-loading="loading">
    <el-card shadow="never">
      <div class="search">
        <el-form class="w-full flex justify-between" :model="searchForm" label-width="80px" :inline="false" size="small">
          <search @search="getData" @reset="resetSearchForm" :mode="searchForm">
            <search-item label="关键词">
              <el-input class="search-input" v-model="searchForm.title" placeholder="商品标题" size="small" clearable />
            </search-item>
          </search>
        </el-form>
      </div>
      <div class="main">
        <el-table :data="tableData" default-expand-all stripe>
          <el-table-column type="expand">
            <template #default="{ row }">
              <div class="flex pl-18">
                <el-avatar :size="50" shape="circle" :src="row.user.avatar" fit="fill"></el-avatar>
                <div class="flex-1 ml-2">
                  <h6 class="flex items-center">
                    {{ row.user.nickname || row.user.username }}
                    <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                    <el-button size="small" class="ml-auto" v-if="!row.textareaEdit && !row.extra" @click="openTextarea(row)">回复</el-button>
                  </h6>
                  {{ row.review.data }}
                  <div class="py-2">
                    <el-image v-for="(item, index) in row.review.image" :key="index" :src="item" fit="cover" style="width: 100px; height: 100px"></el-image>
                  </div>
                  <template v-if="row.textareaEdit">
                    <el-input v-model="textarea" type="textarea" :rows="2" placeholder="请输入评价内容" size="small"></el-input>
                    <div class="mt-2">
                      <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                      <el-button size="small" @click="row.textareaEdit = false">取消</el-button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="mt-3 bg-gray-100 p-2 rounded" v-for="(item, index) in row.extra" :key="index">
                      <h6 class="flex font-bold">
                        客服
                        <el-button type="info" size="small" class="ml-auto" @click="openTextarea(row, item.data)">修改</el-button>
                      </h6>
                      <p>{{ item.data }}</p>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="ID" align="center" prop="id" width="80"></el-table-column>
          <el-table-column label="商品" align="left">
            <template #default="{ row }">
              <div class="flex items-center">
                <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" style="width: 50px; height: 50px" class="rounded"></el-image>
                <div class="ml-3">
                  <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="评价信息" align="left">
            <template #default="{ row }">
              <p>用户：{{ row.user?.nickname || row.user?.nickname }}</p>
              <p>
                <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" score-template="{value}" />
              </p>
            </template>
          </el-table-column>
          <el-table-column label="评价时间" align="center" prop="review_time"></el-table-column>
          <el-table-column label="状态" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :disabled="row.super === 1" :loading="loadingSwitch" :active-value="1" :inactive-value="0" @change="updateStatus(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
    </el-card>
  </div>
</template>

<script name="CommentList" setup>
import { ref, inject } from 'vue';
import search from '@/components/search.vue';
import searchItem from '@/components/searchItem.vue';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
import { useToast } from '@/utils/useMessage';
const $api = inject('api');
const { searchForm, totalCount, currentPage, tableData, loadingSwitch, loading, handleCurrentChange, getData, resetSearchForm, updateStatus } = useGetTableData({
  searchForm: {
    title: '',
  },
  getList: $api.comment.getCommentList,
  onGetListSuccess: (res) => {
    totalCount.value = res.totalCount;
    tableData.value = res.list.map((item) => {
      item.textareaEdit = false;
      return item;
    });
  },
  updateStatus: $api.comment.updateCommentStatus,
});

const textarea = ref('');
const openTextarea = (row, data = '') => {
  textarea.value = data;
  row.textareaEdit = true;
};

const review = (row) => {
  console.log(row);
  if (!textarea.value) {
    return useToast('回复内容不能为空', 'error');
  }
  $api.comment.reviewComment(row.id, textarea.value).then(() => {
    row.textareaEdit = false;
    useToast('回复成功', 'success');
    textarea.value = '';
    getData();
  });
};
</script>
<style scoped>
.comment .search {
  @apply flex justify-between items-center mb-4;
}
.comment .search .search-input {
  width: 400px;
}
.comment .page {
  @apply flex justify-center items-center mt-4;
}
</style>
