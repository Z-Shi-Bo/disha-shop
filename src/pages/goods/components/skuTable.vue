<template>
  <el-form-item label="规格设置">
    <table class="border w-full">
      <thead>
        <tr>
          <th class="border" v-for="(item, index) in tableHeader" :key="index" :width="item.width" :rowspan="item.rowspan" :colspan="item.colspan">{{ item.label }}</th>
        </tr>
        <tr>
          <th class="border" v-for="(item, index) in skuLabels" :key="index">{{ item.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in skuTableData" :key="index">
          <td class="border text-center" v-for="(sku, skuI) in item.skus" :key="skuI">{{ sku.value }}</td>
          <td class="border">
            <el-input v-model="item.pprice" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.oprice" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.cprice" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.stock" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.volume" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.weight" size="small" type="number"></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.code" size="small"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>

<script setup>
import { initGoodsSkuTableList } from '@/utils/useSku';
import { ref } from 'vue';
const { skuTableData, skuLabels, tableHeader } = initGoodsSkuTableList();
</script>
