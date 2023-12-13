<template>
  <div class="coupon" v-loading="loading">
    <el-card shadow="never">
      <list-header @create="handleCreate" @refresh="getData"></list-header>
      <div class="main">
        <el-table :data="tableData" stripe>
          <el-table-column label="优惠券名称" align="left" width="350" prop="name">
            <template #default="{ row }">
              <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText === '领取中' ? 'active' : 'inactive'">
                <h5 class="text-md font-bold">{{ row.name }}</h5>
                <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="statusText"></el-table-column>
          <el-table-column label="优惠" align="left">
            <template #default="{ row }">
              <span>{{ row.type ? '满减' : '折扣' }} {{ row.type ? '¥' + row.value : row.value + '折' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发放数量" align="center" prop="total"> </el-table-column>
          <el-table-column label="已使用" align="center" prop="used"> </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template #default="{ row }">
              <div>
                <el-button v-if="row.statusText === '未开始'" type="primary" text size="small" @click="handleUpdate(row)">修改</el-button>
                <el-button v-if="row.statusText !== '领取中'" type="primary" text size="small" @click="handleDelete(row)">删除</el-button>
                <el-button v-if="row.statusText === '领取中'" type="danger" size="small" @click="updateStatus(row)">失效</el-button>
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
        <el-form-item label="优惠券名称" prop="name" class="w-1/2">
          <el-input v-model="form.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1" border>满减</el-radio>
            <el-radio :label="2" border>折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值" prop="value" class="w-1/2">
          <el-input v-model="form.value" type="number">
            <template #append>{{ form.type === 1 ? '元' : '折' }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="form.total"></el-input-number>
        </el-form-item>
        <el-form-item label="最低使用价格" prop="min_price" class="w-1/2">
          <el-input v-model="form.min_price" type="number">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order"></el-input-number>
        </el-form-item>
        <el-form-item label="活动时间" prop="activityTime">
          <el-date-picker v-model="activityTime" type="datetimerange" :editable="false" start-placeholder="开始日期" range-separator="~" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" rows="4" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
    </drawer-form>
  </div>
</template>

<script name="CouponList" setup>
import { inject, computed } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import listHeader from '@/components/listHeader.vue';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
import { useFormatStatus } from '@/utils/useCommonTools';
const $api = inject('api');
const { totalCount, currentPage, tableData, loading, handleCurrentChange, getData, updateStatus, handleDelete } = useGetTableData({
  getList: $api.coupon.getCouponList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusText = useFormatStatus(o);
      return o;
    });
    totalCount.value = res.totalCount;
  },
  updateStatus: $api.coupon.getCouponStatus,
  delete: $api.coupon.deleteCoupon,
});
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    name: '',
    order: 50,
    type: 1,
    value: 0,
    min_price: 0,
    start_time: '',
    end_time: '',
    total: 100,
    desc: '',
  },
  beforeSubmit: (f) => {
    if (f.start_time && typeof f.start_time !== 'number') {
      f.start_time = new Date(f.start_time).getTime();
    }
    if (f.end_time && typeof f.end_time !== 'number') {
      f.end_time = new Date(f.end_time).getTime();
    }
    return f;
  },
  update: $api.coupon.updateCoupon,
  create: $api.coupon.createCoupon,
  getData,
});
// 格式化活动时间
const activityTime = computed({
  get() {
    return form.start_time && form.end_time ? [form.start_time, form.end_time] : [];
  },
  set(val) {
    form.start_time = val[0];
    form.end_time = val[1];
  },
});
</script>
<style scoped>
.coupon .search {
  @apply flex justify-between items-center mb-4;
}
.coupon .search .search-input {
  width: 400px;
}
.coupon .page {
  @apply flex justify-center items-center mt-4;
}
.coupon .active {
  @apply border-r-rose-200 bg-rose-50 text-red-400;
}
.coupon .inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
