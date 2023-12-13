<template>
  <div class="product-tips">
    <index-card title="店铺及商品提示" tips="店铺及商品提示" :btnData="productTips"></index-card>
    <index-card class="mt-2" title="交易提示" tips="需要立即处理的交易订单" :btnData="tradeOrders"></index-card>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import indexCard from '@/components/indexCard.vue';
const $api = inject('api');
const productTips = ref([]);
const tradeOrders = ref([]);
// 获取提示数据信息
const queryTipsData = () => {
  $api.statistics.statistics2().then((res) => {
    productTips.value = res.goods;
    tradeOrders.value = res.order;
  });
};
queryTipsData();
</script>

<style scoped></style>
