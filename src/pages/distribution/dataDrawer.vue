<template>
  <el-drawer :title="type === 'order' ? '推广订单列表' : '推广人列表'" v-model="visible" size="60%" :destroy-on-close="true" :show-close="true">
    <el-form :model="searchForm" label-width="80px">
      <el-form-item label="时间选择">
        <el-radio-group v-model="searchForm.type" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="last7days">最近7天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="searchForm.starttime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" placeholder="选择日期时间"> </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="searchForm.endtime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" placeholder="选择日期时间"> </el-date-picker>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="searchForm.level" size="small">
          <el-radio-button label="0">全部</el-radio-button>
          <el-radio-button label="1">一级推广</el-radio-button>
          <el-radio-button label="2">二级推广</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData" size="small">搜索</el-button>
        <el-button size="small" @click="resetSearchForm">重置</el-button>
      </el-form-item>
      <div class="main">
        <el-table :data="tableData" stripe>
          <template v-if="type === 'user'">
            <el-table-column label="ID" prop="id" width="100" align="center" />
            <el-table-column label="头像" align="left" width="80">
              <template #default="{ row }">
                <el-avatar :size="40" :src="row.avatar">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="用户信息" align="left" prop="username" width="100"></el-table-column>
            <el-table-column label="推广数" align="center" prop="share_num"></el-table-column>
            <el-table-column label="推广订单数" align="center" prop="share_order_num"></el-table-column>
            <el-table-column label="绑定时间" align="center" prop="create_time"></el-table-column>
          </template>
          <template v-else>
            <el-table-column label="订单号" align="center">
              <template #default="{ row }">
                <div>
                  {{ row.order.no }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户名|昵称|手机" align="center">
              <template #default="{ row }">
                <div v-if="!row.order.user">
                  该用户已被删除
                </div>
                <div v-else>
                  {{ row.order.user.username }} | {{ row.order.user.nickname }} | {{ row.order.user.phone }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" prop="create_time"></el-table-column>
            <el-table-column label="返佣金额" align="center" prop="commission"></el-table-column>
          </template>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, computed, reactive, inject } from 'vue';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const props = defineProps({
  type: {
    type: String,
    default: 'user',
  },
});
const { searchForm, totalCount, currentPage, tableData, loading, handleCurrentChange, getData, resetSearchForm } = useGetTableData({
  searchForm: {
    type: 'all',
    starttime: '',
    endtime: '',
    level: '0',
    user_id: '',
  },
  getList: props.type === 'user' ? $api.distribution.agentList : $api.distribution.promotionsOrderList,
  delete: $api.order.deleteAllOrder,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    totalCount.value = res.totalCount;
  },
});
const visible = ref(false);
const open = (id) => {
  searchForm.user_id = id;
  getData();
  visible.value = true;
};
defineExpose({
  open,
});
</script>
<style>
.el-drawer .page {
  @apply flex justify-center items-center mt-4;
}
</style>
