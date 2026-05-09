<template>
  <div class="house-page">
    <h1 class="page-title">房屋信息</h1>

    <div class="stats-row">
      <StatCard icon="fa-building" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.total" label="总房屋数" />
      <StatCard icon="fa-home" :iconBg="'rgba(82,196,26,0.15)'" :value="stats.occupied" valueColor="#52c41a" label="自住" />
      <StatCard icon="fa-key" :iconBg="'rgba(250,173,20,0.15)'" :value="stats.rented" valueColor="#faad14" label="出租" />
      <StatCard icon="fa-door-open" :iconBg="'rgba(114,46,209,0.15)'" :value="stats.vacant" valueColor="#722ed1" label="空置" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="房屋类型分布" :option="typeOption" />
      </div>
      <div class="chart-col">
        <ChartCard title="楼栋分布" :option="buildingOption" />
      </div>
    </div>

    <DataTable
      :data="houseList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterStatus" placeholder="使用状态" clearable style="width: 140px" @change="fetchList">
          <el-option label="自住" value="occupied" />
          <el-option label="出租" value="rented" />
          <el-option label="空置" value="vacant" />
        </el-select>
      </template>

      <template #status="{ row }">
        <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import DataTable from '@/components/DataTable.vue'
import { getHouseList, getHouseStats } from '@/api/modules/house'

const loading = ref(false)
const houseList = ref([])
const stats = ref({ total: 0, occupied: 0, rented: 0, vacant: 0, typeDist: [], buildingDist: [] })
const filterStatus = ref('')
const searchKeyword = ref('')

const statusMap = { occupied: '自住', rented: '出租', vacant: '空置' }

const columns = [
  { prop: 'code', label: '房屋编号', width: 120 },
  { prop: 'building', label: '楼栋', width: 100 },
  { prop: 'unit', label: '单元', width: 100 },
  { prop: 'floor', label: '楼层', width: 80 },
  { prop: 'room', label: '房号', width: 80 },
  { prop: 'type', label: '房屋类型', width: 120 },
  { prop: 'status', label: '使用状态', width: 100 },
  { prop: 'owner', label: '业主', width: 100 },
  { prop: 'moveInDate', label: '入住时间', width: 120 },
]

const statusType = (status) => ({ occupied: 'success', rented: 'warning', vacant: 'info' }[status] || '')
const statusText = (status) => statusMap[status] || status

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
      itemStyle: { color: ['#1890ff', '#13c2c2', '#722ed1', '#eb2f96'][idx] },
    })) || [],
  }],
}))

const buildingOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: stats.value.buildingDist?.map((i) => i.name) || [],
    axisLine: { lineStyle: { color: '#fff' } },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#fff' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: [{
    type: 'bar',
    data: stats.value.buildingDist?.map((i) => i.value) || [],
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: '#1890ff' }, { offset: 1, color: '#722ed1' }],
      },
    },
  }],
}))

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getHouseList({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      status: filterStatus.value,
    })
    houseList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getHouseStats()
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
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.charts-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px; }
@media (max-width: 1200px) { .stats-row, .charts-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .stats-row, .charts-row { grid-template-columns: 1fr; } }
</style>
