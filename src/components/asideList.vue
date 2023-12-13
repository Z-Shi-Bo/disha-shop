<template>
  <div class="image-list" :class="{ active: active }">
    <span class="truncate text-gray-500 text-sm"><slot /></span>
    <el-button class="ml-auto" type="primary" text size="small" @click.stop="$emit('edit')">
      <el-icon :size="16"><Edit /></el-icon>
    </el-button>
    <el-button type="primary" text size="small" @click="$emit('delete')">
      <el-icon :size="16"><Close /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['edit', 'delete']);
</script>
<style scoped>
.image-aside .image-list {
  border-bottom: 1px solid #eee;
  cursor: pointer;
  @apply flex items-center p-3;
}
.image-aside .image-list:hover,
.active {
  @apply bg-blue-50;
}
</style>
