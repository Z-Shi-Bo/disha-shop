<template>
  <el-drawer title="设置轮播图" v-model="dialogVisible" size="50%" destroy-on-close>
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图">
        <choose-image v-model="form.banners" :limit="8"></choose-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loadingBtn" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import chooseImage from '@/components/chooseImage.vue';
import { ref, reactive, inject } from 'vue';
import { useToast } from '@/utils/useMessage';
const $api = inject('api');
const dialogVisible = ref(false);
const form = reactive({
  banners: [],
});

// 获取商品轮播图数据
const goodsId = ref(0);
const getGoodsBanners = (row) => {
  row.bannersLoading = true;
  $api.goods
    .readsGood(row.id)
    .then((res) => {
      form.banners = res.goodsBanner.map((o) => o.url);
      dialogVisible.value = true;
    })
    .finally(() => {
      row.bannersLoading = false;
    });
};

const open = (row) => {
  goodsId.value = row.id;
  getGoodsBanners(row);
};

// 提交商品轮播图
const loadingBtn = ref(false);
const emit = defineEmits(['reloadData']);
const onSubmit = () => {
  loadingBtn.value = true;
  $api.goods
    .bannersGood(goodsId.value, form)
    .then((res) => {
      useToast('设置成功');
      dialogVisible.value = false;
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
