<template>
  <div class="alarm-page">
    <h1 class="page-title">告警管理</h1>

    <div class="stats-row">
      <StatCard icon="fa-bell" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.today" label="今日告警" />
      <StatCard icon="fa-exclamation-triangle" :iconBg="'rgba(255,77,79,0.15)'" :value="stats.pending" valueColor="#ff4d4f" label="待处理" />
      <StatCard icon="fa-check" :iconBg="'rgba(82,196,26,0.15)'" :value="stats.resolved" valueColor="#52c41a" label="已处理" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="告警趋势" :option="trendOption" />
      </div>
      <div class="chart-col">
        <ChartCard title="告警类型分布" :option="typeOption" />
      </div>
    </div>

    <DataTable
      :data="alarmList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterLevel" placeholder="告警级别" clearable style="width: 140px" @change="fetchList">
          <el-option label="紧急" value="critical" />
          <el-option label="警告" value="warning" />
          <el-option label="提示" value="info" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="处理状态" clearable style="width: 140px" @change="fetchList">
          <el-option label="待处理" value="pending" />
          <el-option label="处理中" value="processing" />
          <el-option label="已处理" value="resolved" />
        </el-select>
      </template>

      <template #level="{ row }">
        <el-tag :type="levelType(row.level)" size="small">{{ levelText(row.level) }}</el-tag>
      </template>

      <template #status="{ row }">
        <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
      </template>

      <template #rowActions="{ row }">
        <el-button v-if="row.status !== 'resolved'" link type="success" size="small" @click="handleResolve(row)">
          标记处理
        </el-button>
        <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
      </template>
    </DataTable>

    <el-dialog v-model="detailVisible" title="告警详情" width="500px">
      <div v-if="selectedAlarm" class="alarm-detail">
        <p><label>告警时间：</label>{{ selectedAlarm.time }}</p>
        <p><label>告警类型：</label>{{ selectedAlarm.type }}</p>
        <p><label>告警级别：</label><el-tag :type="levelType(selectedAlarm.level)">{{ levelText(selectedAlarm.level) }}</el-tag></p>
        <p><label>告警位置：</label>{{ selectedAlarm.location }}</p>
        <p><label>当前状态：</label><el-tag :type="statusType(selectedAlarm.status)">{{ statusText(selectedAlarm.status) }}</el-tag></p>
        <p><label>详细描述：</label>{{ selectedAlarm.description }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import DataTable from '@/components/DataTable.vue'
import { getAlarmList, getAlarmStats, resolveAlarm } from '@/api/modules/alarm'

const loading = ref(false)
const alarmList = ref([])
const stats = ref({ today: 0, pending: 0, resolved: 0, trend: {}, typeDist: [] })
const filterLevel = ref('')
const filterStatus = ref('')
const searchKeyword = ref('')
const detailVisible = ref(false)
const selectedAlarm = ref(null)

const levelMap = { critical: '紧急', warning: '警告', info: '提示' }
const statusMap = { pending: '待处理', processing: '处理中', resolved: '已处理' }

const columns = [
  { prop: 'time', label: '告警时间', width: 170 },
  { prop: 'type', label: '告警类型', width: 120 },
  { prop: 'level', label: '告警级别', width: 100 },
  { prop: 'location', label: '告警位置', minWidth: 140 },
  { prop: 'status', label: '状态', width: 100 },
]

const levelType = (level) => ({ critical: 'danger', warning: 'warning', info: 'info' }[level] || '')
const levelText = (level) => levelMap[level] || level
const statusType = (status) => ({ pending: 'warning', processing: 'primary', resolved: 'success' }[status] || '')
const statusText = (status) => statusMap[status] || status

const trendOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  legend: { data: ['紧急告警', '警告', '提示'], textStyle: { color: '#fff' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: stats.value.trend?.hours || [],
    axisLine: { lineStyle: { color: '#fff' } },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#fff' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: [
    { name: '紧急告警', type: 'line', stack: 'Total', data: stats.value.trend?.critical || [], itemStyle: { color: '#ff4d4f' } },
    { name: '警告', type: 'line', stack: 'Total', data: stats.value.trend?.warning || [], itemStyle: { color: '#faad14' } },
    { name: '提示', type: 'line', stack: 'Total', data: stats.value.trend?.info || [], itemStyle: { color: '#1890ff' } },
  ],
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
      itemStyle: { color: ['#ff4d4f', '#faad14', '#1890ff', '#722ed1', '#13c2c2'][idx] },
    })) || [],
  }],
}))

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getAlarmList({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      level: filterLevel.value,
      status: filterStatus.value,
    })
    alarmList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getAlarmStats()
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  fetchList()
}

const handleResolve = async (row) => {
  await resolveAlarm(row.id)
  ElMessage.success('已标记为已处理')
  fetchList()
  fetchStats()
}

const viewDetail = (row) => {
  selectedAlarm.value = row
  detailVisible.value = true
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
.alarm-detail p { margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.8); }
.alarm-detail label { color: rgba(255,255,255,0.5); display: inline-block; width: 80px; }
@media (max-width: 1200px) { .stats-row, .charts-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .stats-row, .charts-row { grid-template-columns: 1fr; } }
</style>
