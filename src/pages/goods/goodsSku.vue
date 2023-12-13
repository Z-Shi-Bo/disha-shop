<template>
  <drawer-form title="设置商品规格" :loadingBtn="loadingBtn" ref="drawerFormRef" destroy-on-close @submit="onSubmit" size="70%">
    <el-form :model="form" label-width="80px">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0">单规格</el-radio>
          <el-radio :label="1">多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type === 0">
        <el-form-item label="市场价格" class="w-1/2">
          <el-input v-model.number="form.sku_value.oprice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格" class="w-1/2">
          <el-input v-model.number="form.sku_value.pprice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格" class="w-1/2">
          <el-input v-model.number="form.sku_value.cprice">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量" class="w-1/2">
          <el-input v-model.number="form.sku_value.weight">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积" class="w-1/2">
          <el-input v-model.number="form.sku_value.volume">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <sku-card />
        <sku-table />
      </template>
    </el-form>
  </drawer-form>
</template>

<script setup>
import drawerForm from '@/components/drawerForm.vue';
import skuCard from './components/skuCard.vue';
import skuTable from './components/skuTable.vue';
import { ref, reactive, inject } from 'vue';
import { useToast } from '@/utils/useMessage';
import { goodsId, initGoodsSkuList, skuTableData } from '@/utils/useSku';
const $api = inject('api');
const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  },
});
const drawerFormRef = ref(null);

// 获取商品规格数据
const getGoodsDetail = (row) => {
  row.goodsSkuLoading = true;
  $api.goods
    .readsGood(row.id)
    .then((res) => {
      form.sku_type = res.sku_type;
      form.sku_value = res.sku_value || {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0,
      };
      initGoodsSkuList(res);
      drawerFormRef.value.open();
    })
    .finally(() => {
      row.goodsSkuLoading = false;
    });
};

const open = (row) => {
  goodsId.value = row.id;
  getGoodsDetail(row);
};

// 更新商品规格
const loadingBtn = ref(false);
const emit = defineEmits(['reloadData']);
const onSubmit = () => {
  loadingBtn.value = true;
  const data = {
    sku_type: form.sku_type,
    sku_value: form.sku_value,
  };
  if (form.sku_type === 1) {
    data.goodsSkus = skuTableData.value;
  }
  $api.goods
    .updatesKusGood(goodsId.value, data)
    .then((res) => {
      useToast('商品规格更新成功');
      drawerFormRef.value.close();
      emit('reloadData');
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};

defineExpose({
  open,
});
</script>
