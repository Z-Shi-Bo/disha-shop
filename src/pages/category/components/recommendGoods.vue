<template>
  <drawer-form title="推荐商品" ref="drawerFormRef" :loadingBtn="loadingBtn" confirmText="关联" @submit="handleConfirm">
    <el-table :data="tableData" border stripe>
      <el-table-column label="ID" prop="goods_id" width="50" />
      <el-table-column label="商品封面" width="150">
        <template #default="{ row }">
          <el-image :src="row.cover" fit="fill" class="w-[64px] h-[64px]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" width="150" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" text size="small" @click="handleDelete(row)" :loading="row.loading">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </drawer-form>
  <choose-goods ref="chooseGoodsRef"></choose-goods>
</template>

<script setup>
import drawerForm from '@/components/drawerForm.vue';
import chooseGoods from '@/components/chooseGoods.vue';
import { useToast, useMessageBox } from '@/utils/useMessage';
import { ref, inject } from 'vue';
const $api = inject('api');
const drawerFormRef = ref(null);
const tableData = ref([]);
const recommendGoodsId = ref(0);
const loadingBtn = ref(false);
const open = async (data) => {
  data.goodsDrawerLoading = true;
  recommendGoodsId.value = data.id;
  await getRecommendGoods();
  data.goodsDrawerLoading = false;
};
// 获取推荐商品数据
const getRecommendGoods = () => {
  return $api.category.categoryProductList(recommendGoodsId.value).then((res) => {
    tableData.value = res.map((o) => {
      o.loading = false;
      return o;
    });
    drawerFormRef.value.open();
  });
};

// 删除商品分类
const handleDelete = (row) => {
  useMessageBox('删除', '确定删除么？', 'warning')
    .then((confirm) => {
      row.loading = true;
      $api.category
        .deleteCategoryProduct(row.id)
        .then((res) => {
          useToast('删除成功');
          getRecommendGoods();
        })
        .finally(() => {
          row.loading = false;
        });
    })
    .catch((cancel) => {
      console.log(cancel);
    });
};

// 关联商品实例
const chooseGoodsRef = ref(null);
const handleConfirm = () => {
  chooseGoodsRef.value.open((goods_id) => {
    // goods_id 传递给父组件的id
    // checkGoodsId  已经存在的id数组
    const checkGoodsId = tableData.value.map((o) => o.goods_id);
    let flag = false;
    goods_id.forEach((o) => {
      if (checkGoodsId.includes(o)) {
        flag = true;
        return;
      }
    });
    if (flag) {
      useToast('商品已存在', 'error');
      return;
    }
    loadingBtn.value = true;
    $api.category
      .categoryProduct({ category_id: recommendGoodsId.value, goods_ids: goods_id })
      .then((res) => {
        useToast('关联成功');
        getRecommendGoods();
      })
      .finally(() => {
        loadingBtn.value = false;
      });
  });
};
defineExpose({
  open,
});
</script>

<style scoped></style>
