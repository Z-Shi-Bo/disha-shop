<template>
  <div class="flex" v-loading="loading">
    <el-tag v-for="tag in item.goodsSkusCardValue" :key="tag.id" class="mx-1" closable :disable-transitions="false" @close="handleClose(tag)" effect="plain">
      <template #default>
        <el-input v-model="tag.text" size="small" class="!w-[80px] ml-[-10px]" @keyup.enter="handleChange(tag)" @blur="handleChange(tag)" />
      </template>
    </el-tag>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 !w-[80px]" size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"> + 添加选项值 </el-button>
  </div>
</template>

<script setup>
import { initGoodsSkuValue } from '@/utils/useSku';
const props = defineProps({
  skuCardId: [Number, String],
});

// 规格属性值列表
const { item, inputValue, inputVisible, InputRef, handleClose, showInput, handleInputConfirm, loading, handleChange } = initGoodsSkuValue(props.skuCardId);
</script>
