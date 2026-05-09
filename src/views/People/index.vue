<template>
  <div class="people-page">
    <h1 class="page-title">人员信息</h1>

    <div class="stats-row">
      <StatCard icon="fa-users" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.total" label="总人数" />
      <StatCard icon="fa-user-check" :iconBg="'rgba(82,196,26,0.15)'" :value="stats.resident" valueColor="#52c41a" label="常住人口" />
      <StatCard icon="fa-user-friends" :iconBg="'rgba(114,46,209,0.15)'" :value="stats.visitor" valueColor="#722ed1" label="访客" />
      <StatCard icon="fa-id-badge" :iconBg="'rgba(250,173,20,0.15)'" :value="stats.staff" valueColor="#faad14" label="工作人员" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="人员分布" :option="distOption" />
      </div>
      <div class="chart-col">
        <ChartCard title="年龄分布" :option="ageOption" />
      </div>
    </div>

    <DataTable
      :data="peopleList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterType" placeholder="人员类型" clearable style="width: 140px" @change="fetchList">
          <el-option label="常住" value="resident" />
          <el-option label="访客" value="visitor" />
          <el-option label="工作人员" value="staff" />
        </el-select>
      </template>

      <template #type="{ row }">
        <el-tag :type="typeType(row.type)" size="small">{{ typeText(row.type) }}</el-tag>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import DataTable from '@/components/DataTable.vue'
import { getPeopleList, getPeopleStats } from '@/api/modules/people'

const loading = ref(false)
const peopleList = ref([])
const stats = ref({ total: 0, resident: 0, visitor: 0, staff: 0, dist: [], ageDist: [] })
const filterType = ref('')
const searchKeyword = ref('')

const typeMap = { resident: '常住', visitor: '访客', staff: '工作人员' }

const columns = [
  { prop: 'name', label: '姓名', width: 100 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'building', label: '楼栋', width: 100 },
  { prop: 'unit', label: '单元', width: 100 },
  { prop: 'room', label: '房号', width: 100 },
  { prop: 'phone', label: '联系方式', width: 140 },
  { prop: 'lastAccess', label: '最近出入', width: 150 },
]

const typeType = (type) => ({ resident: 'primary', visitor: 'warning', staff: 'success' }[type] || '')
const typeText = (type) => typeMap[type] || type

const distOption = computed(() => ({
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
    data: stats.value.dist?.map((item, idx) => ({
      ...item,
      itemStyle: { color: ['#1890ff', '#722ed1', '#52c41a'][idx] },
    })) || [],
  }],
}))

const ageOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: stats.value.ageDist?.map((i) => i.name) || [],
    axisLine: { lineStyle: { color: '#fff' } },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#fff' } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: [{
    type: 'bar',
    data: stats.value.ageDist?.map((i) => i.value) || [],
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
    const res = await getPeopleList({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      type: filterType.value,
    })
    peopleList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getPeopleStats()
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
