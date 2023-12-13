<template>
  <el-drawer title="订单详情" v-model="visible" size="40%" :destroy-on-close="true" :show-close="true">
    <el-card shadow="never">
      <template #header>
        <b>订单详情</b>
      </template>
      <!-- card body -->
      <el-form label-width="80px">
        <el-form-item label="订单号">
          {{ info.no }}
        </el-form-item>
        <el-form-item label="付款方式">
          {{ info.payment_method }}
        </el-form-item>
        <el-form-item label="付款时间">
          {{ info.paid_time }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ info.create_time }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" v-if="info.ship_data">
      <template #header>
        <b>发货信息</b>
      </template>
      <!-- card body -->
      <el-form label-width="80px">
        <el-form-item label="物流公司">
          {{ info.ship_data.express_company }}
        </el-form-item>
        <el-form-item label="运单号">
          <span>{{ info.ship_data.express_no }}</span>
          <el-button text size="small" type="primary" class="ml-2" @click="showExpress(info.id)" :loading="loading">查看物流</el-button>
        </el-form-item>
        <el-form-item label="发货时间">
          {{ ship_time }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <b>商品信息</b>
      </template>
      <!-- card body -->
      <div class="flex mb-2" v-for="(item, index) in info.order_items" :key="index">
        <el-image :src="item.goods_item && item.goods_item?.cover" style="width: 60px; height: 60px" fit="cover"></el-image>
        <div class="ml-2 text-sm">
          <p>{{ (item.goods_item && item.goods_item?.title) ?? '商品已被删除' }}</p>
          <p v-if="item.skus_type === 1 && item.goods_skus" class="mt-1">
            <el-tag class="mx-1" type="info" size="small">
              {{ computedSkuValue(item.goods_skus.skus) }}
            </el-tag>
          </p>
          <p>
            <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
            <span class="text-xs text-gray-500">x{{ item.num }}</span>
          </p>
        </div>
      </div>
      <el-form label-width="80px">
        <el-form-item label="成交价">
          <span class="text-rose-500 font-bold">￥{{ info.total_price }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" v-if="info.address">
      <template #header>
        <b>收货信息</b>
      </template>
      <!-- card body -->
      <el-form label-width="80px">
        <el-form-item label="收货人">
          {{ info.address.name }}
        </el-form-item>
        <el-form-item label="联系方式">
          {{ info.address.phone }}
        </el-form-item>
        <el-form-item label="收货地址">
          {{ info.address.province }}
          {{ info.address.city }}
          {{ info.address.district }}
          {{ info.address.address }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" v-if="info.refund_status !== 'pending'">
      <template #header>
        <div class="flex">
          <b>退款信息</b>
          <el-button text disabled class="ml-auto">{{ refund_status }}</el-button>
        </div>
      </template>
      <!-- card body -->
      <el-form label-width="80px">
        <el-form-item label="退款理由">
          {{ info.extra.refund_reason }}
        </el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
  <show-ship-info ref="showShipInfoRef"></show-ship-info>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDateFormat } from '@vueuse/core';
import showShipInfo from './showShipInfo.vue';
const props = defineProps({
  info: Object,
});
const ship_time = computed(() => {
  if (props.info.ship_data && props.info.ship_data.express_time) {
    return useDateFormat(props.info.ship_data.express_time * 1000, 'YYYY-MM-DD HH:mm:ss').value;
  }
  return '';
});

const refund_status = computed(() => {
  const opt = {
    pending: '未退款',
    applied: '已申请，等待审核',
    processing: '退款中',
    success: '退款成功',
    failed: '退款失败',
  };
  return props.info.refund_status ? opt[props.info.refund_status] : '';
});
const visible = ref(false);
const open = () => {
  visible.value = true;
};

// 计算商品规格属性
const computedSkuValue = (data) => {
  let result = [];
  for (const key in data) {
    result.push(data[key].value);
  }
  return result.join(',');
};

// 物流详情实例
const showShipInfoRef = ref(null);
const loading = ref(false);
// 查看物流事件
const showExpress = (id) => {
  loading.value = true;
  showShipInfoRef.value.open(id).finally(() => {
    loading.value = false;
  });
};
defineExpose({
  open,
});
</script>
<style>
.el-drawer {
  .el-card {
    margin-top: 10px;
    .el-card__header {
      @apply p-2 bg-gray-50;
    }
  }
}
</style>
