<template>
  <drawer-form title="设置商品详情" :loadingBtn="loadingBtn" ref="drawerFormRef" destroy-on-close @submit="onSubmit">
    <el-form :model="form">
      <el-form-item>
        <editor v-model="form.content" />
      </el-form-item>
    </el-form>
  </drawer-form>
</template>

<script setup>
import drawerForm from '@/components/drawerForm.vue';
import editor from '@/components/editor.vue';
import { ref, reactive, inject } from 'vue';
import { useToast } from '@/utils/useMessage';
const $api = inject('api');
const form = reactive({
  content: '',
});
const drawerFormRef = ref(null);

// 获取商品详情数据
const goodsId = ref(0);
const getGoodsDetail = (row) => {
  row.goodsDetailLoading = true;
  $api.goods
    .readsGood(row.id)
    .then((res) => {
      form.content = res.content;
      drawerFormRef.value.open();
    })
    .finally(() => {
      row.goodsDetailLoading = false;
    });
};

const open = (row) => {
  goodsId.value = row.id;
  getGoodsDetail(row);
};

// 提交商品轮播图
const loadingBtn = ref(false);
const emit = defineEmits(['reloadData']);
const onSubmit = () => {
  loadingBtn.value = true;
  $api.goods
    .updateGood(goodsId.value, form)
    .then((res) => {
      useToast('设置商品详情成功');
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
