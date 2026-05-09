<template>
  <div class="car-page">
    <h1 class="page-title">车辆信息</h1>

    <div class="stats-row">
      <StatCard icon="fa-parking" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.totalSpaces" label="总车位数" />
      <StatCard icon="fa-car" :iconBg="'rgba(255,77,79,0.15)'" :value="stats.used" valueColor="#ff4d4f" label="已使用" />
      <StatCard icon="fa-check-circle" :iconBg="'rgba(82,196,26,0.15)'" :value="stats.available" valueColor="#52c41a" label="剩余" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="车位使用率趋势" :option="usageOption" />
      </div>
      <div class="chart-col">
        <ChartCard title="车辆类型分布" :option="typeOption" />
      </div>
    </div>

    <DataTable
      :data="carList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterType" placeholder="车辆类型" clearable style="width: 140px" @change="fetchList">
          <el-option label="业主" value="resident" />
          <el-option label="访客" value="visitor" />
          <el-option label="临时" value="temporary" />
        </el-select>
      </template>

      <template #type="{ row }">
        <el-tag :type="typeType(row.type)" size="small">{{ typeText(row.type) }}</el-tag>
      </template>

      <template #status="{ row }">
        <span :class="['car-status', row.status]">
          <span class="dot"></span>
          {{ row.status === 'parked' ? '已停车' : '已离开' }}
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import DataTable from '@/components/DataTable.vue'
import { getCarRecords, getCarStats } from '@/api/modules/car'

const loading = ref(false)
const carList = ref([])
const stats = ref({ totalSpaces: 0, used: 0, available: 0, usageTrend: {}, typeDist: [] })
const filterType = ref('')
const searchKeyword = ref('')

const typeMap = { resident: '业主', visitor: '访客', temporary: '临时' }

const columns = [
  { prop: 'plate', label: '车牌号', width: 130 },
  { prop: 'type', label: '车辆类型', width: 100 },
  { prop: 'action', label: '出入类型', width: 100 },
  { prop: 'time', label: '时间', width: 150 },
  { prop: 'parkingSpace', label: '停车位', width: 120 },
  { prop: 'status', label: '状态', width: 100 },
]

const typeType = (type) => ({ resident: 'primary', visitor: 'warning', temporary: 'info' }[type] || '')
const typeText = (type) => typeMap[type] || type

const usageOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: stats.value.usageTrend?.hours || [],
    axisLine: { lineStyle: { color: '#fff' } },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#fff' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: [{
    type: 'line',
    smooth: true,
    data: stats.value.usageTrend?.data || [],
    itemStyle: { color: '#1890ff' },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: 'rgba(24,144,255,0.3)' }, { offset: 1, color: 'rgba(24,144,255,0)' }],
      },
    },
  }],
}))

const typeOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item' },
  legend: { top: '5%', left: 'center', textStyle: { color: '#fff' } },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
    label: { show: false, position: 'center' },
    emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
    labelLine: { show: false },
    data: stats.value.typeDist?.map((item, idx) => ({
      ...item,
      itemStyle: { color: ['#1890ff', '#722ed1', '#faad14'][idx] },
    })) || [],
  }],
}))

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getCarRecords({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      type: filterType.value,
    })
    carList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getCarStats()
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  fetchList()
}

onMounted(() => {
  fetchList()
  fetchStats()
})
</script>

<style scoped>
.page-title { font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #fff; }
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
.charts-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px; }
.car-status { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.car-status .dot { width: 8px; height: 8px; border-radius: 50%; }
.car-status.parked { color: #ff4d4f; }
.car-status.parked .dot { background: #ff4d4f; }
.car-status.left { color: #52c41a; }
.car-status.left .dot { background: #52c41a; }
@media (max-width: 1200px) { .stats-row, .charts-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .stats-row, .charts-row { grid-template-columns: 1fr; } }
</style>
