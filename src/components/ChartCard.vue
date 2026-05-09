<template>
  <div class="chart-card">
    <div class="chart-header" v-if="title">
      <h3 class="chart-title">{{ title }}</h3>
      <slot name="extra" />
    </div>
    <div ref="chartRef" class="chart-body" :style="{ height: height + 'px' }"></div>
    <div v-if="loading" class="chart-loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  title: { type: String, default: '' },
  height: { type: Number, default: 280 },
  option: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value, 'dark')
  chartInstance.setOption(props.option, true)
}

const resizeChart = () => {
  chartInstance?.resize()
}

watch(
  () => props.option,
  () => {
    nextTick(() => {
      if (chartInstance) {
        chartInstance.setOption(props.option, true)
      } else {
        initChart()
      }
    })
  },
  { deep: true }
)

onMounted(() => {
  nextTick(initChart)
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped>
.chart-card {
  background: rgba(45, 45, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.chart-body {
  width: 100%;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}
</style>
