<template>
  <el-row :gutter="24">
    <template v-if="panels.length === 0">
      <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
        <el-skeleton style="width:100%">
          <template #template>
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </template>
              <div class="card-content"><el-skeleton-item variant="h3" style="width: 80%" /></div>
              <div class="card-subTitle">
                <el-skeleton-item variant="text" style="width: 50%" />
                <el-skeleton-item variant="text" style="width: 10%" />
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>{{ item.title }}</span>
            <el-tag :type="item.unitColor">{{ item.unit }}</el-tag>
          </div>
        </template>
        <div class="card-content"><count-to :value="item.value"></count-to></div>
        <div class="card-subTitle">
          <span>{{ item.subTitle }}</span>
          <span>{{ item.subValue }}{{ item.subUnit }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, inject } from "vue";
import CountTo from "@/components/countTo.vue";
const $api = inject("api");
const panels = ref([]);
// 获取后台首页数据1
const queryStatistics1 = () => {
  $api.statistics.statistics1().then(res => {
    if (res.panels && res.panels.length) {
      panels.value = res.panels;
    }
  });
};
queryStatistics1();
</script>

<style scoped>
.card-header,
.card-subTitle {
  @apply flex justify-between items-center;
}

.card-subTitle {
  height: 60px;
  @apply text-gray-400 text-xs;
}

.card-content {
  @apply h-80px flex items-center border-b font-bold text-3xl text-gray-500;
}
::v-deep(.el-card__body) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
<style>
.el-row .el-card {
  border: none;
}
</style>