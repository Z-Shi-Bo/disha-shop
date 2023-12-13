<template>
  <el-drawer title="导出订单" v-model="visible" direction="rtl" size="40%" :destroy-on-close="true" :show-close="true">
    <el-form :model="form" label-width="80px">
      <el-form-item label="订单类型">
        <el-select v-model="form.tab" placeholder="请选择">
          <el-option v-for="item in tabs" :key="item.value" :label="item.name" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, inject } from 'vue';
import { useToast } from '@/utils/useMessage';
import { useExport } from '@/utils/useCommonTools';
defineProps({
  tabs: Array,
});
const $api = inject('api');
const form = reactive({
  tab: '',
  time: '',
});
const visible = ref(false);
const loading = ref(false);
const open = () => {
  visible.value = true;
};

const onSubmit = () => {
  if (!form.tab) {
    return useToast('请选择订单类型');
  }
  loading.value = true;
  let starttime = null;
  let endtime = null;
  if (form.time && Array.isArray(form.time)) {
    starttime = form.time[0];
    endtime = form.time[1];
  }
  $api.order
    .exportOrder({ tab: form.tab, starttime, endtime })
    .then((res) => {
      useExport(res, '订单导出')
    })
    .finally(() => {
      loading.value = false;
      visible.value = false;
    });
};
defineExpose({
  open,
});
</script>
<style scoped></style>
