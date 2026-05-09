<template>
  <div class="notice-page">
    <h1 class="page-title">公告信息</h1>

    <div class="stats-row">
      <StatCard icon="fa-bullhorn" :iconBg="'rgba(24,144,255,0.15)'" :value="stats.total" label="总公告数" />
      <StatCard icon="fa-calendar-alt" :iconBg="'rgba(114,46,209,0.15)'" :value="stats.thisMonth" valueColor="#722ed1" label="本月发布" />
      <StatCard icon="fa-edit" :iconBg="'rgba(250,173,20,0.15)'" :value="stats.draft" valueColor="#faad14" label="待发布" />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="公告类型分布" :option="typeOption" />
      </div>
      <div class="chart-col latest-notice">
        <div class="notice-card">
          <h3><i class="fas fa-star" style="color: #faad14; margin-right: 8px;"></i>最新公告</h3>
          <div class="notice-content-box">
            <h4><el-tag type="danger" size="small">重要</el-tag> 关于电梯维修的通知</h4>
            <p>尊敬的业主：</p>
            <p>因C栋1单元电梯需要进行例行维护保养，将于2026年5月10日上午9:00-12:00暂停使用。给您带来不便，敬请谅解。</p>
            <p class="notice-sign">物业管理处<br>2026年5月9日</p>
          </div>
        </div>
      </div>
    </div>

    <DataTable
      :data="noticeList"
      :columns="columns"
      :loading="loading"
      @search="handleSearch"
    >
      <template #filters>
        <el-select v-model="filterType" placeholder="公告类型" clearable style="width: 140px" @change="fetchList">
          <el-option label="重要通知" value="important" />
          <el-option label="一般通知" value="normal" />
          <el-option label="活动通知" value="activity" />
        </el-select>
      </template>

      <template #type="{ row }">
        <el-tag :type="typeType(row.type)" size="small">{{ typeText(row.type) }}</el-tag>
      </template>

      <template #status="{ row }">
        <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
          {{ row.status === 'published' ? '已发布' : '草稿' }}
        </el-tag>
      </template>

      <template #rowActions="{ row }">
        <el-button link type="primary" size="small" @click="viewDetail(row)">查看</el-button>
      </template>
    </DataTable>

    <el-dialog v-model="detailVisible" title="公告详情" width="600px">
      <div v-if="selectedNotice" class="notice-detail">
        <h2>{{ selectedNotice.title }}</h2>
        <div class="notice-meta">
          <el-tag :type="typeType(selectedNotice.type)">{{ typeText(selectedNotice.type) }}</el-tag>
          <span>{{ selectedNotice.publisher }}</span>
          <span>{{ selectedNotice.publishTime }}</span>
        </div>
        <div class="notice-body">{{ selectedNotice.content }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import DataTable from '@/components/DataTable.vue'
import { getNoticeList, getNoticeStats } from '@/api/modules/notice'

const loading = ref(false)
const noticeList = ref([])
const stats = ref({ total: 0, thisMonth: 0, draft: 0, typeDist: [] })
const filterType = ref('')
const searchKeyword = ref('')
const detailVisible = ref(false)
const selectedNotice = ref(null)

const typeMap = { important: '重要通知', normal: '一般通知', activity: '活动通知' }

const columns = [
  { prop: 'title', label: '公告标题', minWidth: 200 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'publishTime', label: '发布时间', width: 120 },
  { prop: 'publisher', label: '发布人', width: 130 },
  { prop: 'status', label: '状态', width: 90 },
]

const typeType = (type) => ({ important: 'danger', normal: 'primary', activity: 'success' }[type] || '')
const typeText = (type) => typeMap[type] || type

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
      itemStyle: { color: ['#ff4d4f', '#1890ff', '#52c41a', '#722ed1'][idx] },
    })) || [],
  }],
}))

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getNoticeList({
      page: 1,
      pageSize: 100,
      keyword: searchKeyword.value,
      type: filterType.value,
    })
    noticeList.value = res.list || []
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  stats.value = await getNoticeStats()
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  fetchList()
}

const viewDetail = (row) => {
  selectedNotice.value = row
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
.notice-card { background: rgba(45, 45, 55, 0.6); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); height: 100%; }
.notice-card h3 { font-size: 16px; font-weight: 500; margin-bottom: 16px; color: rgba(255,255,255,0.8); }
.notice-content-box { background: rgba(0,0,0,0.2); border-radius: 8px; padding: 16px; line-height: 1.8; }
.notice-content-box h4 { font-size: 15px; margin-bottom: 12px; color: #fff; }
.notice-content-box p { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 8px; }
.notice-sign { text-align: right; margin-top: 16px; color: rgba(255,255,255,0.5) !important; }
.notice-detail h2 { font-size: 20px; margin-bottom: 16px; color: #fff; }
.notice-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; font-size: 13px; color: rgba(255,255,255,0.5); }
.notice-body { font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.8); }
@media (max-width: 1200px) { .stats-row, .charts-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .stats-row, .charts-row { grid-template-columns: 1fr; } }
</style>
