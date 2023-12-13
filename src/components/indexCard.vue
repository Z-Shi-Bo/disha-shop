<template>
  <div class="index-card">
    <el-card shadow="hover">
      <template #header>
        <div class="flex justify-between items-center">
          <span>{{ props.title }}</span>
          <span><el-tag type="danger">{{ props.tips }}</el-tag></span>
        </div>
      </template>
      <el-row :gutter="24">
        <el-col :span="6" :offset="0" v-for="(item, index) in props.btnData" :key="index">
          <el-card shadow="hover">
            <div class="flex flex-col justify-center items-center">
              <p>{{ item.value }}</p>
              <p class="text-xs text-gray-500">{{ item.label }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  tips: String,
  btnData: Array,
});
</script>

<style scoped>
.index-card .el-card .el-card {
  @apply bg-light-400;
}
</style>
