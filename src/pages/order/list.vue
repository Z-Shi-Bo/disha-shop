<template>
  <div class="order" v-loading="loading">
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane :label="item.name" :name="item.value" v-for="(item, index) in tabBars" :key="index"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never">
      <div class="search">
        <search @search="getData" @reset="resetSearchForm" :mode="searchForm">
          <search-item label="订单编号">
            <el-input v-model="searchForm.no" placeholder="订单编号" size="small" clearable />
          </search-item>
          <template #showSearch>
            <search-item label="收货人">
              <el-input v-model="searchForm.name" placeholder="收货人" size="small" clearable />
            </search-item>
            <search-item label="手机号">
              <el-input v-model="searchForm.phone" placeholder="手机号" size="small" clearable />
            </search-item>
            <search-item label="开始时间">
              <el-date-picker v-model="searchForm.starttime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" placeholder="选择日期时间"> </el-date-picker>
            </search-item>
            <search-item label="结束时间">
              <el-date-picker v-model="searchForm.endtime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="small" placeholder="选择日期时间"> </el-date-picker>
            </search-item>
          </template>
        </search>
      </div>
      <list-header @refresh="getData" @export="handleExport" layout="refresh,export">
        <el-button type="danger" size="small" @click="handleDeleteAll">批量删除</el-button>
      </list-header>
      <div class="main">
        <el-table :data="tableData" ref="selectionTableRef" @selection-change="handleSelectionChange" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="商品" align="left" width="300">
            <template #default="{ row }">
              <div>
                <div class="flex justify-between">
                  <div>
                    <p>订单号：</p>
                    <small>{{ row.no }}</small>
                  </div>
                  <div>
                    <p>下单时间：</p>
                    <small>{{ row.create_time }}</small>
                  </div>
                </div>
                <div class="flex items-center" v-for="(item, index) in row.order_items" :key="index">
                  <el-image :src="item.goods_item && item.goods_item?.cover" style="width: 30px; height: 30px" fit="cover"></el-image>
                  <span class="ml-2 text-blue-500">{{ item.goods_item && item.goods_item?.title }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实际付款" align="center" prop="total_price" width="140"></el-table-column>
          <el-table-column label="买家" align="center" width="140">
            <template #default="{ row }">
              <div>
                <p>{{ row.user.nickname || row.user.username }}</p>
                <small>(用户ID：{{ row.user?.id }})</small>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="交易状态" align="center" width="220">
            <template #default="{ row }">
              <div class="flex items-center">
                付款状态：
                <el-tag v-if="row.payment_method === 'wechat'" type="success" size="small">微信支付</el-tag>
                <el-tag v-else-if="row.payment_method === 'alipay'" size="small">支付宝支付</el-tag>
                <el-tag v-else type="info" size="small">未支付</el-tag>
              </div>
              <div class="flex items-center">
                发货状态：
                <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' : '未发货' }}</el-tag>
              </div>
              <div class="flex items-center">
                收货状态：
                <el-tag :type="row.ship_status === 'received' ? 'success' : 'info'" size="small">{{ row.ship_status === 'received' ? '已收货' : '未收货' }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <div>
                <el-button type="primary" text size="small" @click="handleOrderDetail(row)">订单详情</el-button>
                <el-button v-if="searchForm.tab === 'noship'" type="primary" text size="small" @click="handleUpdate(row)">订单发货</el-button>
                <el-button v-if="searchForm.tab === 'refunding'" type="primary" text size="small" @click="handleRefund(row.id, 'agree')">同意退款</el-button>
                <el-button v-if="searchForm.tab === 'refunding'" type="primary" text size="small" @click="handleRefund(row.id)">拒绝退款</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
    </el-card>
    <export-excel ref="exportExcelRef" :tabs="tabBars" />
    <order-details ref="orderDetailsRef" :info="info" />
  </div>
</template>

<script name="OrderList" setup>
import { ref, inject } from 'vue';
import exportExcel from './exportExcel.vue';
import orderDetails from './orderDetails.vue';
import listHeader from '@/components/listHeader.vue';
import search from '@/components/search.vue';
import searchItem from '@/components/searchItem.vue';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
import { useToast, useMessageBox, usePrompt } from '@/utils/useMessage';

// tabbars
const tabBars = [
  {
    name: '全部',
    value: 'all',
  },
  {
    name: '待支付',
    value: 'nopay',
  },
  {
    name: '代发货',
    value: 'noship',
  },
  {
    name: '待收货',
    value: 'shiped',
  },
  {
    name: '已收货',
    value: 'received',
  },
  {
    name: '已完成',
    value: 'finish',
  },
  {
    name: '已关闭',
    value: 'closed',
  },
  {
    name: '退款中',
    value: 'refunding',
  },
];

const $api = inject('api');
const selectionTableRef = ref(null);
const { searchForm, totalCount, currentPage, tableData, handleDeleteAll, loading, handleCurrentChange, getData, resetSearchForm, handleSelectionChange, ids } = useGetTableData({
  searchForm: {
    tab: 'all',
    no: '',
    name: '',
    limit: 10,
    phone: '',
    starttime: '',
    endtime: '',
  },
  getList: $api.order.getOrderList,
  delete: $api.order.deleteAllOrder,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.goodsDetailLoading = false;
      o.goodsSkuLoading = false;
      return o;
    });
    totalCount.value = res.totalCount;
  },
});

// 导出侧边栏实例
const exportExcelRef = ref(null);
const handleExport = () => {
  exportExcelRef.value.open();
};

// 订单详情实例
const orderDetailsRef = ref(null);
// 传递给子组件的值
const info = ref(null);
const handleOrderDetail = (row) => {
  info.value = row;
  orderDetailsRef.value.open();
};

// 同意和拒绝退款
const handleRefund = (id, agree) => {
  if (agree) {
    useMessageBox('退款', '是否同意该订单退款', 'warning')
      .then((confirm) => {
        handleOrRefundOrder(id, { agree: 1 });
      })
      .catch((cancel) => {
        console.log(cancel);
      });
  } else {
    usePrompt('请输入拒绝的理由').then(({ value }) => {
      handleOrRefundOrder(id, { agree: 0, disagree_reason: value });
    });
  }
};

const handleOrRefundOrder = (id, data) => {
  $api.order.handleOrRefundOrder(id, data).then((res) => {
    useToast('操作成功');
  });
};
</script>
<style scoped>
.order .search {
  @apply mb-4;
}
.order .page {
  @apply flex justify-center items-center mt-4;
}
.order .check-box {
  .el-button {
    margin-left: 0;
  }
}
</style>
