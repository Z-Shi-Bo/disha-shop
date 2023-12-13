<template>
  <div class="add-box">
    <div>
      <el-button v-if="btns.includes('create')" type="primary" size="small" @click="$emit('create')">新增</el-button>
      <el-button v-if="btns.includes('delete')" type="danger" size="small" @click="$emit('delete')">批量删除</el-button>
      <slot />
    </div>
    <div>
      <el-tooltip v-if="btns.includes('refresh')" effect="dark" content="刷新数据" placement="top">
      <el-link @click="$emit('refresh')">
        <el-icon :size="16">
          <Refresh />
        </el-icon>
      </el-link>
    </el-tooltip>
    <el-tooltip v-if="btns.includes('export')" effect="dark" content="导出数据" placement="top">
      <el-link @click="$emit('export')" class="ml-8">
        <el-icon :size="16">
          <Download />
        </el-icon>
      </el-link>
    </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  layout: {
    type: String,
    default: 'create,refresh',
  },
});

const btns = computed(() => props.layout.split(','));

defineEmits(['create', 'refresh', 'delete', 'export']);
</script>
<style scoped>
.add-box {
  @apply flex justify-between items-center mb-4;
}
</style>
