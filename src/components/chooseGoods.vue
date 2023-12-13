<template>
  <el-dialog v-model="dialogVisible" width="70%" height="450" title="商品选择" destroy-on-close>
    <el-table :data="tableData" ref="selectionTableRef" height="300" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="商品" align="left" width="300">
        <template #default="{ row }">
          <div class="flex">
            <el-image :src="row.cover" fit="cover" class="mr-3 rounded w-50px h-50px"></el-image>
            <div class="flex-1 flex flex-col">
              <p>{{ row.title }}</p>
              <p class="text-gray-500">
                <span class="text-red-500">￥{{ row.min_price }}</span>
                <el-divider direction="vertical" />
                <span class="text-xs">￥{{ row.min_oprice }}</span>
              </p>
              <small class="text-gray-400">分类：{{ row.category?.name }}</small>
              <small class="text-gray-400">创建时间：{{ row.create_time }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存" align="center" />
      <el-table-column prop="address" label="价格（元）" align="center">
        <template #default="{ row }">
          <span class="text-rose-500">￥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500 text-xs">￥{{ row.min_price }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
    </div>
    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useGetTableData } from '@/utils/useTableAndFormLogic';
import { ref, inject } from 'vue';
import { useFullscreen } from '@vueuse/core';
const $api = inject('api');
const dialogVisible = ref(false);
const { searchForm, totalCount, currentPage, tableData, loading, handleCurrentChange, getData, handleStatusChange, handleDelete, handleSelectionChange, ids } = useGetTableData({
  searchForm: {
    tab: 'all',
    title: '',
    category_id: '',
    limit: 10,
  },
  getList: $api.goods.getGoodList,
  onGetListSuccess: (res) => {
    tableData.value = res.list || [];
    totalCount.value = res.totalCount || 0;
  },
});
// 确定
const submit = () => {
  callbackFn(ids.value);
  dialogVisible.value = false;
};
//  取消
const close = () => {
  dialogVisible.value = false;
};

let callbackFn = null;
const open = (func) => {
  if (typeof func === 'function') {
    callbackFn = func;
  }
  dialogVisible.value = true;
};
defineExpose({
  open,
});
</script>
<style scoped>
.page {
  @apply flex justify-center items-center mt-4;
}
</style>
