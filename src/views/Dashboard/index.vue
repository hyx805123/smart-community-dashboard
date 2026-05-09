<template>
  <div class="dashboard-page">
    <h1 class="page-title">社区概况</h1>

    <div class="stats-grid">
      <StatCard
        icon="fa-users"
        :iconBg="'rgba(82, 196, 26, 0.15)'"
        :value="stats.population"
        valueColor="#52c41a"
        label="常住人口"
        suffix="人"
        :trend="5.2"
      />
      <StatCard
        icon="fa-home"
        :iconBg="'rgba(24, 144, 255, 0.15)'"
        :value="stats.households"
        valueColor="#1890ff"
        label="总户数"
        suffix="户"
        :trend="3.8"
      />
      <StatCard
        icon="fa-car"
        :iconBg="'rgba(250, 173, 20, 0.15)'"
        :value="stats.parkingUsage"
        valueColor="#faad14"
        label="车位使用率"
        suffix="%"
      />
      <StatCard
        icon="fa-server"
        :iconBg="'rgba(114, 46, 209, 0.15)'"
        :value="stats.deviceOnlineRate"
        valueColor="#722ed1"
        label="设备在线率"
        suffix="%"
      />
    </div>

    <div class="charts-row">
      <div class="chart-col">
        <ChartCard title="人口趋势" :option="populationOption" :loading="loading" />
      </div>
      <div class="chart-col">
        <ChartCard title="户数趋势" :option="householdOption" :loading="loading" />
      </div>
    </div>

    <div class="overview-grid">
      <div class="overview-card">
        <h3><i class="fas fa-video" style="color: #1890ff; margin-right: 8px;"></i>监控设备状态</h3>
        <div class="status-list">
          <div
            v-for="cam in monitorOverview.cameras"
            :key="cam.name"
            class="status-item"
          >
            <span
              class="status-dot"
              :class="cam.status"
            ></span>
            <span>{{ cam.name }}</span>
            <span :class="['status-text', cam.status]">
              {{ cam.status === 'online' ? '在线' : '离线' }}
            </span>
          </div>
        </div>
      </div>

      <div class="overview-card">
        <h3><i class="fas fa-user-clock" style="color: #52c41a; margin-right: 8px;"></i>今日访客统计</h3>
        <div class="big-number" style="color: #52c41a;">{{ monitorOverview.todayVisitors }}</div>
        <div class="sub-label">人次</div>
      </div>

      <div class="overview-card">
        <h3><i class="fas fa-bell" style="color: #ff4d4f; margin-right: 8px;"></i>设备告警统计</h3>
        <div class="big-number" style="color: #ff4d4f;">{{ monitorOverview.todayAlarms }}</div>
        <div class="sub-label">条未处理</div>
      </div>

      <div class="overview-card">
        <h3><i class="fas fa-car-side" style="color: #faad14; margin-right: 8px;"></i>车辆进出记录</h3>
        <div class="big-number" style="color: #faad14;">{{ monitorOverview.todayCars }}</div>
        <div class="sub-label">辆次</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { getDashboardStats, getMonitorOverview } from '@/api/modules/dashboard'

const loading = ref(false)
const stats = ref({
  population: 0,
  households: 0,
  parkingUsage: 0,
  deviceOnlineRate: 0,
  populationTrend: [],
  householdTrend: [],
  months: [],
})
const monitorOverview = ref({
  cameras: [],
  todayVisitors: 0,
  todayAlarms: 0,
  todayCars: 0,
})

const populationOption = computed(() => ({
  backgroundColor: 'transparent',
  grid: { top: 10, right: 10, bottom: 20, left: 40, containLabel: true },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: stats.value.months,
    axisLine: { lineStyle: { color: '#666' } },
    axisLabel: { color: '#fff' },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#666' } },
    axisLabel: { color: '#fff' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: [{
    data: stats.value.populationTrend,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    itemStyle: { color: '#52c41a' },
    lineStyle: { width: 3 },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(82,196,26,0.3)' },
          { offset: 1, color: 'rgba(82,196,26,0)' },
        ],
      },
    },
  }],
}))

const householdOption = computed(() => ({
  backgroundColor: 'transparent',
  grid: { top: 10, right: 10, bottom: 20, left: 40, containLabel: true },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: stats.value.months,
    axisLine: { lineStyle: { color: '#666' } },
    axisLabel: { color: '#fff' },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#666' } },
    axisLabel: { color: '#fff' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
  },
  series: [{
    data: stats.value.householdTrend,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    itemStyle: { color: '#1890ff' },
    lineStyle: { width: 3 },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(24,144,255,0.3)' },
          { offset: 1, color: 'rgba(24,144,255,0)' },
        ],
      },
    },
  }],
}))

const fetchData = async () => {
  loading.value = true
  try {
    const [statsRes, overviewRes] = await Promise.all([
      getDashboardStats(),
      getMonitorOverview(),
    ])
    stats.value = statsRes
    monitorOverview.value = overviewRes
  } finally {
    loading.value = false
  }
}

let refreshTimer = null
onMounted(() => {
  fetchData()
  refreshTimer = setInterval(fetchData, 30000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.overview-card {
  background: rgba(45, 45, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.overview-card h3 {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #52c41a;
}

.status-dot.offline {
  background: #ff4d4f;
}

.status-text {
  margin-left: auto;
  font-size: 12px;
}

.status-text.online {
  color: #52c41a;
}

.status-text.offline {
  color: #ff4d4f;
}

.big-number {
  font-size: 36px;
  font-weight: bold;
  font-family: 'Consolas', monospace;
}

.sub-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

@media (max-width: 1200px) {
  .stats-grid,
  .charts-row,
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid,
  .charts-row,
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
