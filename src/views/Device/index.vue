<template>
  <div class="device-page">
    <h1 class="page-title">设备管理</h1>

    <div class="stats-row">
      <StatCard icon="fa-server" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.total" label="总设备数" />
      <StatCard icon="fa-check-circle" :iconBg="'rgba(82,196,26,0.15)'" :value="stats.online" valueColor="#52c41a" label="在线设备" />
      <StatCard icon="fa-times-circle" :iconBg="'rgba(255,77,79,0.15)'" :value="stats.offline" valueColor="#ff4d4f" label="离线设备" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="设备状态分布" :option="statusOption" />
      </div>
      <div class="chart-col">
        <ChartCard title="设备类型分布" :option="typeOption" />
      </div>
    </div>

    <DataTable
      :data="deviceList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterType" placeholder="设备类型" clearable style="width: 140px" @change="fetchList">
          <el-option label="监控设备" value="监控设备" />
          <el-option label="门禁系统" value="门禁系统" />
          <el-option label="电梯系统" value="电梯系统" />
          <el-option label="消防设备" value="消防设备" />
          <el-option label="其他设备" value="其他设备" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="设备状态" clearable style="width: 140px" @change="fetchList">
          <el-option label="正常" value="normal" />
          <el-option label="警告" value="warning" />
          <el-option label="故障" value="error" />
        </el-select>
      </template>

      <template #status="{ row }">
        <span :class="['status-tag', row.status]">
          <span class="dot"></span>
          {{ statusMap[row.status] }}
        </span>
      </template>

      <template #rowActions="{ row }">
        <el-button link type="primary" size="small" @click="viewDetail(row)">查看</el-button>
      </template>
    </DataTable>

    <el-dialog v-model="detailVisible" title="设备详情" width="500px">
      <div v-if="selectedDevice" class="device-detail">
        <p><label>设备名称：</label>{{ selectedDevice.name }}</p>
        <p><label>设备类型：</label>{{ selectedDevice.type }}</p>
        <p><label>安装位置：</label>{{ selectedDevice.location }}</p>
        <p><label>IP地址：</label>{{ selectedDevice.ip }}</p>
        <p><label>当前状态：</label>{{ statusMap[selectedDevice.status] }}</p>
        <p><label>最后更新：</label>{{ selectedDevice.lastUpdate }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import DataTable from '@/components/DataTable.vue'
import { getDeviceList, getDeviceStats } from '@/api/modules/device'

const loading = ref(false)
const deviceList = ref([])
const stats = ref({ total: 0, online: 0, offline: 0, statusDist: [], typeDist: [] })
const filterType = ref('')
const filterStatus = ref('')
const searchKeyword = ref('')
const detailVisible = ref(false)
const selectedDevice = ref(null)

const statusMap = { normal: '正常', warning: '警告', error: '故障' }

const columns = [
  { prop: 'name', label: '设备名称', minWidth: 150 },
  { prop: 'type', label: '设备类型', width: 120 },
  { prop: 'location', label: '位置', minWidth: 140 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'lastUpdate', label: '最后更新', width: 170 },
]

const statusOption = computed(() => ({
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
    data: stats.value.statusDist.map((item, idx) => ({
      ...item,
      itemStyle: { color: ['#52c41a', '#faad14', '#ff4d4f'][idx] },
    })),
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
    data: stats.value.typeDist.map((item, idx) => ({
      ...item,
      itemStyle: { color: ['#1890ff', '#13c2c2', '#722ed1', '#eb2f96', '#faad14'][idx] },
    })),
  }],
}))

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getDeviceList({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      type: filterType.value,
      status: filterStatus.value,
    })
    deviceList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getDeviceStats()
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  fetchList()
}

const viewDetail = (row) => {
  selectedDevice.value = row
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
.status-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.status-tag .dot { width: 8px; height: 8px; border-radius: 50%; }
.status-tag.normal { color: #52c41a; }
.status-tag.normal .dot { background: #52c41a; }
.status-tag.warning { color: #faad14; }
.status-tag.warning .dot { background: #faad14; }
.status-tag.error { color: #ff4d4f; }
.status-tag.error .dot { background: #ff4d4f; }
.device-detail p { margin-bottom: 12px; font-size: 14px; color: rgba(255,255,255,0.8); }
.device-detail label { color: rgba(255,255,255,0.5); display: inline-block; width: 80px; }
@media (max-width: 1200px) { .stats-row, .charts-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .stats-row, .charts-row { grid-template-columns: 1fr; } }
</style>
