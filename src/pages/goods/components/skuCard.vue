<template>
  <el-form-item label="商品规格" v-loading="bodyLoading">
    <el-card shadow="never" class="w-full mb-3" v-for="(item, index) in goodsSkuList" :key="item.id" v-loading="item.loading">
      <template #header>
        <div class="flex justify-between items-center">
          <el-input v-model="item.text" placeholder="规格名称" style="width: 200px" @change="updateGoodsSku(item)">
            <template #append>
              <div class="flex items-center cursor-pointer w-full h-full" @click="handleSku(item)">
                <el-icon><More /></el-icon>
              </div>
            </template>
          </el-input>
          <div>
            <el-button size="small" :disabled="index === 0" @click="sortGoodsCard('up', index)">
              <el-icon><Top /></el-icon>
            </el-button>
            <el-button size="small" :disabled="index === goodsSkuList.length - 1" @click="sortGoodsCard('down', index)">
              <el-icon><Bottom /></el-icon>
            </el-button>
            <el-button size="small" @click="deleteGoodsSku(item)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
      <sku-card-item :skuCardId="item.id" />
    </el-card>
    <el-button type="success" size="small" :loading="loadingBtn" @click="addGoodsSku">添加规格选项</el-button>
    <choose-sku ref="chooseSkuRef" />
  </el-form-item>
</template>

<script setup>
import skuCardItem from './skuCardItem.vue';
import chooseSku from '@/components/chooseSku.vue';
import { goodsSkuList, loadingBtn, addGoodsSku, updateGoodsSku, deleteGoodsSku, sortGoodsCard, bodyLoading, handleChooseGoodsSkuValue } from '@/utils/useSku';
import { ref } from 'vue';
const chooseSkuRef = ref(null);
const handleSku = (item) => {
  chooseSkuRef.value.open((form) => {
    handleChooseGoodsSkuValue(item.id, { name: form.name, value: form.list });
  });
};
</script>
<style>
.el-card .el-card__header {
  @apply bg-gray-50 p-2;
}
</style>
