<template>
  <div class="distribution" v-loading="loading">
    <div class="card-list flex">
      <el-card shadow="never" class="flex-1 mx-2 pl-8" v-for="(item, index) in statistics" :key="index">
        <!-- card body -->
        <p class="font-bold text-xl">{{ item.value }}</p>
        <small class="text-xs text-gray-400">{{ item.label }}</small>
      </el-card>
    </div>
    <el-card shadow="never" class="mt-4">
      <div class="search">
        <search @search="getData" @reset="resetSearchForm" :mode="searchForm">
          <search-item label="时间选择">
            <el-radio-group v-model="searchForm.type" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="today">今天</el-radio-button>
              <el-radio-button label="yesterday">昨天</el-radio-button>
              <el-radio-button label="last7days">最近7天</el-radio-button>
            </el-radio-group>
          </search-item>
          <template #showSearch>
            <search-item label="开始时间">
              <el-date-picker v-model="searchForm.starttime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" placeholder="选择日期时间"> </el-date-picker>
            </search-item>
            <search-item label="结束时间">
              <el-date-picker v-model="searchForm.endtime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" placeholder="选择日期时间"> </el-date-picker>
            </search-item>
            <search-item label="关键词">
              <el-input v-model="searchForm.keyword" placeholder="关键词" size="small" clearable />
            </search-item>
          </template>
        </search>
      </div>
      <div class="main">
        <el-table :data="tableData" stripe>
          <el-table-column label="ID" prop="id" width="100" align="center" />
          <el-table-column label="头像" align="left" width="80">
            <template #default="{ row }">
              <el-avatar :size="40" :src="row.avatar">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" align="left" prop="total_price" width="160">
            <template #default="{ row }">
              <div>
                <p class="text-xs">用户：{{ row.username || '' }}</p>
                <p class="text-xs">昵称：{{ row.nickname || '' }}</p>
                <p class="text-xs">姓名：{{ (row.user_info && row.user_info.name) || '' }}</p>
                <p class="text-xs">电话：{{ row.phone || '' }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="推广用户数量" align="center" prop="share_num"></el-table-column>
          <el-table-column label="订单数量" align="center" prop="share_order_num"></el-table-column>
          <el-table-column label="订单金额" align="center" prop="order_price"></el-table-column>
          <el-table-column label="账户佣金" align="center" prop="commission"></el-table-column>
          <el-table-column label="已提现金额" align="center" prop="cash_out_price"></el-table-column>
          <el-table-column label="提现次数" align="center" prop="cash_out_time"></el-table-column>
          <el-table-column label="未提现金额" align="center" prop="no_cash_out_price"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template #default="{ row }">
              <div class="flex justify-center">
                <el-button type="primary" text size="small" :loading="row.agentLoading" @click="showDataDrawer(row.id)">推广人</el-button>
                <el-button type="primary" text size="small" :loading="row.agentOrderLoading" @click="showDataDrawer(row.id, 'order')">推广订单</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
    </el-card>
    <data-drawer ref="dataDrawerRef"></data-drawer>
    <data-drawer ref="orderDrawerRef" type="order"></data-drawer>
  </div>
</template>

<script name="OrderList" setup>
import { ref, inject } from 'vue';
import search from '@/components/search.vue';
import searchItem from '@/components/searchItem.vue';
import dataDrawer from './dataDrawer.vue';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
import { useToast, useMessageBox, usePrompt } from '@/utils/useMessage';

const $api = inject('api');
// 获取分销统计数据
const statistics = ref([]);
const getDistributionData = () => {
  $api.distribution.getDistributionData().then((res) => {
    statistics.value = res.panels || [];
  });
};
getDistributionData();
const { searchForm, totalCount, currentPage, tableData, loading, handleCurrentChange, getData, resetSearchForm } = useGetTableData({
  searchForm: {
    type: 'all',
    starttime: '',
    endtime: '',
    keyword: '',
  },
  getList: $api.distribution.agentList,
  delete: $api.order.deleteAllOrder,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.agentLoading = false;
      o.agentOrderLoading = false;
      return o;
    });
    totalCount.value = res.totalCount;
  },
});

// 侧边栏实例
const dataDrawerRef = ref(null);
const orderDrawerRef = ref(null);
const showDataDrawer = (id, type) => {
  type === 'order' ? orderDrawerRef.value.open(id) : dataDrawerRef.value.open(id);
}
</script>
<style scoped>
.distribution .search {
  @apply mb-4;
}
.distribution .page {
  @apply flex justify-center items-center mt-4;
}
.distribution .check-box {
  .el-button {
    margin-left: 0;
  }
}
</style>
