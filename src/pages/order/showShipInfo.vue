<template>
  <el-drawer title="物流信息" v-model="visible" direction="rtl" size="30%"
    :destroy-on-close="true" :show-close="true">
    <div class="flex items-center mb-3">
      <el-image :src="shipInfo.logo" style="width: 60px; height: 60px" fit="cover" class="border rounded"></el-image>
      <div class="ml-2">
        <p>物流公司：{{ shipInfo.typename }}</p>
        <p>物流单号：{{ shipInfo.number }}</p>
      </div>
    </div>
    <el-divider />
    <el-timeline v-if="shipInfo.list.length > 0">
      <el-timeline-item v-for="(item, index) in shipInfo.list" :key="index" :timestamp="item.time" placement="top" class="pr-4">
        <span>{{ item.status }}</span>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
  
</template>

<script setup>
import { ref, inject } from 'vue';
const $api = inject('api');
const props = defineProps({
  info: Object,
});
const visible = ref(false);
const open = (id) => {
  return getShipInfo(id);
};

// 获取物流详情信息
const shipInfo = ref(null);
const getShipInfo = (id) => {
  return $api.order.getShipInfo(id).then((res) => {
    shipInfo.value = res.result;
    visible.value = true;
    console.log(shipInfo.value);
  })
}
defineExpose({
  open,
});
</script>
