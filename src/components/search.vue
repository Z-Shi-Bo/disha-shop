<template>
  <el-form class="w-full" :model="model" label-width="80px" :inline="false" size="small">
    <el-row :gutter="24">
      <slot />
      <template v-if="showSearch">
        <slot name="showSearch" />
      </template>
      <el-col :span="8" :offset="showSearch ? 0 : 8">
        <el-form-item>
          <div class="w-full flex items-center justify-end">
            <el-button type="primary" size="small" @click="$emit('search')">搜索</el-button>
            <el-button size="small" plain @click="$emit('reset')">重置</el-button>
            <el-button type="primary" text size="small" v-if="isRenderExpansion" @click="showSearch = !showSearch">
              {{ showSearch ? '收起' : '展开' }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                <ArrowDown v-else />
              </el-icon>
            </el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue';
defineProps({
  // isRenderExpansion: {
  //   type: Boolean,
  //   default: true,
  // },
  model: {
    type: Object,
  },
});
const emit = defineEmits(['search', 'reset']);
const showSearch = ref(false);
const slots = useSlots();
const isRenderExpansion = ref(!!slots.showSearch);
</script>
<style scoped></style>
