<template>
  <div class="repair-page">
    <h1 class="page-title">报修管理</h1>

    <div class="stats-row">
      <StatCard icon="fa-wrench" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.total" label="总报修" />
      <StatCard icon="fa-clock" :iconBg="'rgba(250,173,20,0.15)'" :value="stats.pending" valueColor="#faad14" label="待处理" />
      <StatCard icon="fa-spinner" :iconBg="'rgba(114,46,209,0.15)'" :value="stats.processing" valueColor="#722ed1" label="处理中" />
      <StatCard icon="fa-check-circle" :iconBg="'rgba(82,196,26,0.15)'" :value="stats.completed" valueColor="#52c41a" label="已完成" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="报修类型分布" :option="typeOption" />
      </div>
      <div class="chart-col">
        <ChartCard title="处理时效分析" :option="efficiencyOption" />
      </div>
    </div>

    <DataTable
      :data="repairList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterStatus" placeholder="报修状态" clearable style="width: 140px" @change="fetchList">
          <el-option label="待处理" value="pending" />
          <el-option label="处理中" value="processing" />
          <el-option label="已完成" value="completed" />
        </el-select>
        <el-select v-model="filterPriority" placeholder="优先级" clearable style="width: 140px" @change="fetchList">
          <el-option label="高" value="high" />
          <el-option label="中" value="medium" />
          <el-option label="低" value="low" />
        </el-select>
      </template>

      <template #priority="{ row }">
        <span :class="['priority-tag', row.priority]">
          <span class="dot"></span>
          {{ priorityText(row.priority) }}
        </span>
      </template>

      <template #status="{ row }">
        <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
      </template>

      <template #rowActions="{ row }">
        <el-button v-if="row.status === 'pending'" link type="primary" size="small" @click="updateStatus(row, 'processing')">
          接单
        </el-button>
        <el-button v-if="row.status === 'processing'" link type="success" size="small" @click="updateStatus(row, 'completed')">
          完成
        </el-button>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import DataTable from '@/components/DataTable.vue'
import { getRepairList, getRepairStats, updateRepairStatus } from '@/api/modules/repair'

const loading = ref(false)
const repairList = ref([])
const stats = ref({ total: 0, pending: 0, processing: 0, completed: 0, typeDist: [], efficiency: {} })
const filterStatus = ref('')
const filterPriority = ref('')
const searchKeyword = ref('')

const priorityMap = { high: '高', medium: '中', low: '低' }
const statusMap = { pending: '待处理', processing: '处理中', completed: '已完成' }

const columns = [
  { prop: 'code', label: '报修编号', width: 170 },
  { prop: 'type', label: '报修类型', width: 120 },
  { prop: 'location', label: '报修位置', minWidth: 160 },
  { prop: 'priority', label: '优先级', width: 90 },
  { prop: 'createTime', label: '报修时间', width: 150 },
  { prop: 'status', label: '状态', width: 100 },
]

const priorityType = (p) => ({ high: 'danger', medium: 'warning', low: 'success' }[p] || '')
const priorityText = (p) => priorityMap[p] || p
const statusType = (s) => ({ pending: 'warning', processing: 'primary', completed: 'success' }[s] || '')
const statusText = (s) => statusMap[s] || s

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
      itemStyle: { color: ['#1890ff', '#13c2c2', '#722ed1', '#eb2f96', '#faad14'][idx] },
    })) || [],
  }],
}))

const efficiencyOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: stats.value.efficiency?.days || [],
    axisLine: { lineStyle: { color: '#fff' } },
  },
  yAxis: {
    type: 'value',
    name: '平均处理时间(小时)',
    axisLine: { lineStyle: { color: '#fff' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: [{
    type: 'line',
    smooth: true,
    data: stats.value.efficiency?.data || [],
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

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getRepairList({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      status: filterStatus.value,
      priority: filterPriority.value,
    })
    repairList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getRepairStats()
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  fetchList()
}

const updateStatus = async (row, status) => {
  await updateRepairStatus(row.id, status)
  ElMessage.success('状态更新成功')
  fetchList()
  fetchStats()
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
.priority-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.priority-tag .dot { width: 8px; height: 8px; border-radius: 50%; }
.priority-tag.high { color: #ff4d4f; }
.priority-tag.high .dot { background: #ff4d4f; }
.priority-tag.medium { color: #faad14; }
.priority-tag.medium .dot { background: #faad14; }
.priority-tag.low { color: #52c41a; }
.priority-tag.low .dot { background: #52c41a; }
@media (max-width: 1200px) { .stats-row, .charts-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .stats-row, .charts-row { grid-template-columns: 1fr; } }
</style>
