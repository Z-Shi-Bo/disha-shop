<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between items-center">
        <p>订单统计</p>
        <p>
          <el-check-tag :checked="isChecked === 'month'" @change="onChange('month')">近一个月</el-check-tag>
          <el-check-tag class="mx-2" :checked="isChecked === 'week'" @change="onChange('week')">近一周</el-check-tag>
          <el-check-tag :checked="isChecked === 'hour'" @change="onChange('hour')">近24小时</el-check-tag>
        </p>
      </div>
    </template>
    <div id="chart" class="h-300px"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import * as echarts from 'echarts';
const $api = inject('api');
const isChecked = ref('week');
const onChange = (type) => {
  isChecked.value = type;
  queryChartData();
};
// 渲染Dom节点
let myChart = null;
onMounted(() => {
  const chartInstall = document.getElementById('chart');
  if (chartInstall) {
    myChart = echarts.init(chartInstall);
    queryChartData();
  }
});

// 获取图表数据
const queryChartData = () => {
  $api.statistics.statistics3({ type: isChecked.value }).then((res) => {
    initChart(res);
  });
};

const initChart = (chartData) => {
  // 绘制图表
  myChart.setOption(
    {
      tooltip: {},
      xAxis: {
        data: chartData.x,
      },
      yAxis: {},
      series: [
        {
          name: '',
          type: 'bar',
          data: chartData.y,
        },
      ],
    },
    true
  );
};
</script>
<style scoped>
::v-deep(.el-card__body) {
  padding: 0;
}
</style>
