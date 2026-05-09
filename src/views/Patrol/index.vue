<template>
  <div class="patrol-page">
    <h1 class="page-title">巡更管理</h1>

    <div class="stats-row">
      <StatCard icon="fa-user-shield" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.staffCount" label="巡更人员" />
      <StatCard icon="fa-map-marker-alt" :iconBg="'rgba(114,46,209,0.15)'" :value="stats.pointCount" valueColor="#722ed1" label="巡更点位" />
      <StatCard icon="fa-clipboard-check" :iconBg="'rgba(82,196,26,0.15)'" :value="stats.todayCount" valueColor="#52c41a" label="今日巡更" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="巡更完成率" :option="completionOption" />
      </div>
      <div class="chart-col">
        <ChartCard title="巡更异常分布" :option="abnormalOption" />
      </div>
    </div>

    <DataTable
      :data="patrolList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterStatus" placeholder="巡更状态" clearable style="width: 140px" @change="fetchList">
          <el-option label="正常" value="normal" />
          <el-option label="延迟" value="warning" />
          <el-option label="异常" value="abnormal" />
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
import { getPatrolList, getPatrolStats } from '@/api/modules/patrol'

const loading = ref(false)
const patrolList = ref([])
const stats = ref({ staffCount: 0, pointCount: 0, todayCount: 0, completionRate: [], days: [], abnormalDist: [] })
const filterStatus = ref('')
const searchKeyword = ref('')

const statusMap = { normal: '正常', warning: '延迟', abnormal: '异常' }

const columns = [
  { prop: 'staff', label: '巡更人员', width: 120 },
  { prop: 'route', label: '巡更路线', width: 140 },
  { prop: 'startTime', label: '开始时间', width: 150 },
  { prop: 'endTime', label: '结束时间', width: 150 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'abnormal', label: '异常情况', minWidth: 180 },
]

const statusType = (status) => ({ normal: 'success', warning: 'warning', abnormal: 'danger' }[status] || '')
const statusText = (status) => statusMap[status] || status

const completionOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: stats.value.days || [],
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
    data: stats.value.completionRate || [],
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

const abnormalOption = computed(() => ({
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
    data: stats.value.abnormalDist?.map((item, idx) => ({
      ...item,
      itemStyle: { color: ['#faad14', '#ff4d4f', '#722ed1', '#13c2c2'][idx] },
    })) || [],
  }],
}))

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getPatrolList({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      status: filterStatus.value,
    })
    patrolList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getPatrolStats()
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
@media (max-width: 1200px) { .stats-row, .charts-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .stats-row, .charts-row { grid-template-columns: 1fr; } }
</style>
