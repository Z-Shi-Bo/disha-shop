<template>
  <el-dialog title="规格选择" v-model="dialogVisible" top="3%" width="80%">
    <div class="flex h-65vh">
      <el-aside width="220px" class="sku-aside">
        <div class="top">
          <div class="truncate text-gray-500 text-sm" v-for="(item, index) in tableData" :key="index" :class="{ active: activeId === item.id }" @click="handleChangeActiveId(item.id)">
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination background layout="prev, next" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
        </div>
      </el-aside>
      <el-main class="sku-main">
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="(item, index) in skuList" :key="index" :label="item" border />
        </el-checkbox-group>
      </el-main>
    </div>
    <template #footer>
      <span>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineExpose, ref, inject, reactive } from 'vue';
import { useGetTableData } from '@/utils/useTableAndFormLogic';
const dialogVisible = ref(false);
const $api = inject('api');
const activeId = ref(0);
const { totalCount, tableData, loading, handleCurrentChange, getData } = useGetTableData({
  getList: $api.skus.getSkusList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    totalCount.value = res.totalCount;
    if (tableData.value.length > 0) {
      handleChangeActiveId(tableData.value[0].id);
    }
  },
});
const skuList = ref([]);
const form = reactive({
  name: '',
  list: [],
});
const handleChangeActiveId = (id) => {
  activeId.value = id;
  skuList.value = [];
  const item = tableData.value.find((item) => item.id === id);
  if (item) {
    form.name = item.name;
    skuList.value = item.default.split(',');
  }
};
const callbackFn = ref(null);
const open = (callback = null) => {
  if (callback) {
    callbackFn.value = callback;
  }
  getData();
  dialogVisible.value = true;
};
//  提交
const submit = () => {
  callbackFn.value(form);
  dialogVisible.value = false;
};
// 关闭
const handleClose = () => {
  form.list = [];
  form.name = '';
  dialogVisible.value = false;
};
defineExpose({
  open,
  submit,
});
</script>

<style scoped>
.sku-aside {
  border-right: 1px solid #eee;
  position: relative;
}
.sku-aside .top {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 50px;
  overflow-y: auto;
  > div {
    border-bottom: 1px solid #eee;
    cursor: pointer;
    @apply p-3;
    &.active,
    &:hover {
      @apply bg-blue-50;
    }
  }
}
.sku-aside .bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  @apply flex justify-center items-center;
}
</style>
