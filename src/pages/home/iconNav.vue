<template>
  <div class="icon-nav">
    <el-row :gutter="24">
      <el-col :span="3" :offset="0" v-for="(item, index) in iconNav" :key="index">
        <el-card shadow="hover">
          <div class="card-content" @click="link(item.path)">
            <el-icon :size="16" class="mb-2">
              <component :is="item.icon" :class="item.color" />
            </el-icon>
            <span class="text-sm">{{ item.title }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const iconNav = ref([
  {
    title: '用户',
    path: '/user/list',
    icon: 'User',
    color: 'text-light-blue-500',
  },
  {
    title: '商品',
    path: '/goods/list',
    icon: 'ShoppingCart',
    color: 'text-violet-500',
  },
  {
    title: '订单',
    path: '/order/list',
    icon: 'Tickets',
    color: 'text-fuchsia-500',
  },
  {
    title: '评价',
    path: '/comment/list',
    icon: 'ChatDotSquare',
    color: 'text-teal-500',
  },
  {
    title: '图库',
    path: '/image/list',
    icon: 'Picture',
    color: 'text-rose-500',
  },
  {
    title: '公告',
    path: '/notice/list',
    icon: 'Bell',
    color: 'text-green-500',
  },
  {
    title: '配置',
    path: '/setting/list',
    icon: 'SetUp',
    color: 'text-grey-500',
  },
  {
    title: '优惠券',
    path: '/coupon/list',
    icon: 'Files',
    color: 'text-yellow-500',
  },
]);
// 路由跳转
const link = (path) => {
  router.push(path);
};
</script>

<style scoped>
.icon-nav {
  @apply py-4;
}

.icon-nav .card-content {
  @apply flex flex-col justify-center items-center cursor-pointer;
}
</style>
