<template>
  <div class="home">
    <panels v-permission="['getStatistics1,GET']" />
    <icon-nav />
    <el-row :gutter="24">
      <el-col :span="12" :offset="0">
        <order-statistics v-permission="['getStatistics3,GET']" />
      </el-col>
      <el-col :span="12" :offset="0">
        <product-tips v-permission="['getStatistics2,GET']" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Home">
import panels from './panels.vue';
import iconNav from './iconNav.vue';
import orderStatistics from './orderStatistics.vue';
import productTips from './productTips.vue';
</script>

<style scoped></style>
