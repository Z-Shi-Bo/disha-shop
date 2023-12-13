<template>
  <div class="goods" v-loading="loading">
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane :label="item.name" :name="item.value" v-for="(item, index) in tabBars" :key="index"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never">
      <div class="search">
        <search @search="getData" @reset="resetSearchForm" :mode="searchForm">
          <search-item label="关键词">
            <el-input class="search-input" v-model="searchForm.title" placeholder="请选择商品" size="small" clearable />
          </search-item>
          <template #showSearch>
            <search-item label="关键词">
              <el-select v-model="searchForm.category_id" clearable placeholder="请选择商品分类">
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </search-item>
          </template>
        </search>
      </div>
      <list-header @create="handleCreate" @refresh="getData" layout="create,refresh">
        <el-button v-if="searchForm.tab !== 'delete'" type="danger" size="small" @click="handleDeleteAll">批量删除</el-button>
        <el-button v-else size="small" type="warning" @click="handleRestore">恢复商品</el-button>
        <el-button v-if="searchForm.tab === 'delete'" size="small" type="danger" @click="handleDestoryGoods">彻底删除</el-button>
        <el-button v-if="searchForm.tab === 'all' || searchForm.tab === 'off'" size="small" plain @click="handleStatusChange(1)">上架</el-button>
        <el-button v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'" size="small" plain @click="handleStatusChange(0)">下架</el-button>
      </list-header>
      <div class="main">
        <el-table :data="tableData" ref="selectionTableRef" @selection-change="handleSelectionChange" stripe>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="商品" align="left" width="300">
            <template #default="{ row }">
              <div class="flex">
                <el-image :src="row.cover" fit="cover" class="mr-3 rounded w-50px h-50px"></el-image>
                <div class="flex-1 flex flex-col">
                  <p>{{ row.title }}</p>
                  <p class="text-gray-500">
                    <span class="text-red-500">￥{{ row.min_price }}</span>
                    <el-divider direction="vertical" />
                    <span class="text-xs">￥{{ row.min_oprice }}</span>
                  </p>
                  <small class="text-gray-400">分类：{{ row.category?.name }}</small>
                  <small class="text-gray-400">创建时间：{{ row.create_time }}</small>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实际销量" align="center" prop="sale_count" width="100"></el-table-column>
          <el-table-column label="商品状态" align="center" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '上架' : '未上架' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center" width="120" v-if="searchForm.tab !== 'delete'">
            <template #default="{ row }">
              <div v-if="row.ischeck === 0" class="check-box">
                <el-button type="success" size="small" plain class="mb-2">审核通过</el-button>
                <el-button type="danger" size="small" plain>审核拒绝</el-button>
              </div>
              <span v-else>{{ row.ischeck === 1 ? '通过' : '拒绝' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总库存" align="center" prop="stock" width="100"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <span v-if="searchForm.tab === 'delete'">暂无操作</span>
              <div v-else>
                <el-button type="primary" text size="small" @click="handleUpdate(row)">修改</el-button>
                <el-button
                  :type="(row.sku_type === 0 && !row.sku_value) || (row.sku_type === 1 && !row.goods_skus.length) ? 'danger' : 'primary'"
                  text
                  size="small"
                  :loading="row.goodsSkuLoading"
                  @click="handleSetGoodsSku(row)"
                  >商品规格</el-button
                >
                <el-button :type="row.goods_banner.length ? 'primary' : 'danger'" text size="small" :loading="row.bannersLoading" @click="handleSetSwiper(row)">设置轮播图</el-button>
                <el-button :type="row.content ? 'primary' : 'danger'" text size="small" :loading="row.goodsDetailLoading" @click="handleSetGoodsDetail(row)">商品详情</el-button>
                <el-button type="primary" text size="small" @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
    </el-card>
    <drawer-form :title="drawerFormTitle" ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <choose-image v-model="form.cover"></choose-image>
        </el-form-item>
        <el-form-item label="商品分类" prop="category_id" class="w-1/2">
          <el-select v-model="form.category_id" placeholder="选择所属商品分类">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" role="3" placeholder="选填，商品卖点"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" class="w-1/2">
          <el-input v-model="form.unit" placeholder="请输入单位"></el-input>
        </el-form-item>
        <el-form-item label="总库存" prop="stock" class="w-1/2">
          <el-input v-model="form.stock" type="number">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存预警" prop="min_stock" class="w-1/2">
          <el-input v-model="form.min_stock" type="number">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低销售价" prop="min_price" class="w-1/2">
          <el-input v-model="form.min_price" type="number">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原价" prop="min_oprice" class="w-1/2">
          <el-input v-model="form.min_oprice" type="number">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存显示" prop="stock_display">
          <el-radio-group v-model="form.stock_display">
            <el-radio :label="0" size="small">隐藏</el-radio>
            <el-radio :label="1" size="small">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0" size="small">放入仓库</el-radio>
            <el-radio :label="1" size="small">立即上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </drawer-form>
    <banners ref="bannersRef" @reload-data="getData" />
    <goods-detail ref="goodsDetailRef" @reload-data="getData" />
    <goods-sku ref="goodsSkuRef" @reload-data="getData" />
  </div>
</template>

<script name="GoodsList" setup>
import { ref, inject } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import chooseImage from '@/components/chooseImage.vue';
import listHeader from '@/components/listHeader.vue';
import search from '@/components/search.vue';
import searchItem from '@/components/searchItem.vue';
import banners from './banners.vue';
import goodsDetail from './goodsDetail.vue';
import goodsSku from './goodsSku.vue';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
import { useToast, useMessageBox } from '@/utils/useMessage';

const $api = inject('api');
const selectionTableRef = ref(null);
const { searchForm, totalCount, currentPage, tableData, handleDeleteAll, loading, handleCurrentChange, getData, resetSearchForm, handleStatusChange, handleDelete, handleSelectionChange, ids } =
  useGetTableData({
    searchForm: {
      tab: 'all',
      title: '',
      category_id: '',
      limit: 10,
    },
    getList: $api.goods.getGoodList,
    updateStatus: $api.goods.changeStatusGood,
    delete: $api.goods.deleteGood,
    onGetListSuccess: (res) => {
      tableData.value = res.list.map((o) => {
        o.bannersLoading = false;
        o.goodsDetailLoading = false;
        o.goodsSkuLoading = false;
        return o;
      });
      totalCount.value = res.totalCount;
    },
  });
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    title: '',
    category_id: '',
    cover: '',
    desc: '',
    unit: '件',
    stock: 100,
    min_stock: 10,
    status: 1,
    stock_display: 1,
    min_price: 0,
    min_oprice: 0,
  },
  rules: {
    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  },
  update: $api.goods.updateGood,
  create: $api.goods.createGood,
  getData,
});

// tabbars
const tabBars = [
  {
    name: '全部',
    value: 'all',
  },
  {
    name: '审核中',
    value: 'checking',
  },
  {
    name: '出售中',
    value: 'saling',
  },
  {
    name: '已下架',
    value: 'off',
  },
  {
    name: '库存预警',
    value: 'min_stock',
  },
  {
    name: '回收站',
    value: 'delete',
  },
];

// 获取商品 分类数据
const categoryList = ref([]);
const getCategoryList = () => {
  $api.category.getCategoryList().then((res) => {
    categoryList.value = res;
  });
};
getCategoryList();

// 获取轮播图组件实例
const bannersRef = ref(null);
// 设置轮播图
const handleSetSwiper = (row) => {
  bannersRef.value.open(row);
};

// 获取商品详情组件实例
const goodsDetailRef = ref(null);
// 设置商品详情
const handleSetGoodsDetail = (row) => {
  goodsDetailRef.value.open(row);
};
// 获取商品规格详情实例
const goodsSkuRef = ref(null);
// 设置商品规格详情
const handleSetGoodsSku = (row) => {
  goodsSkuRef.value.open(row);
};

// 恢复商品
const handleRestore = () => {
  loading.value = true;
  $api.goods
    .restoreGood(ids.value)
    .then(() => {
      useToast('恢复成功');
      if (selectionTableRef.value) {
        selectionTableRef.value.clearSelection();
      }
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};

// 彻底删除
const handleDestoryGoods = () => {
  useMessageBox('删除', '确定删除么？', 'warning')
    .then((confirm) => {
      loading.value = true;
      $api.goods
        .destroyGood(ids.value)
        .then((res) => {
          useToast('删除成功');
          if (selectionTableRef.value) {
            selectionTableRef.value.clearSelection();
          }
          getData();
        })
        .finally(() => {
          loading.value = false;
        });
    })
    .catch((cancel) => {
      console.log(cancel);
    });
};
</script>
<style scoped>
.goods .search {
  @apply mb-4;
}
.goods .page {
  @apply flex justify-center items-center mt-4;
}
.goods .check-box {
  .el-button {
    margin-left: 0;
  }
}
</style>
