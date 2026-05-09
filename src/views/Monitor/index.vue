<template>
  <div class="monitor-page">
    <div class="page-header">
      <h1 class="page-title">实时监控</h1>
      <div class="layout-toggle">
        <el-radio-group v-model="layout" size="small">
          <el-radio-button label="4">4画面</el-radio-button>
          <el-radio-button label="6">6画面</el-radio-button>
          <el-radio-button label="9">9画面</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="monitor-grid" :class="`layout-${layout}`">
      <div
        v-for="camera in cameras"
        :key="camera.id"
        class="monitor-card"
        @dblclick="toggleFullscreen(camera.id)"
      >
        <div class="camera-header">
          <div class="camera-info">
            <h3>{{ camera.name }}</h3>
            <span class="camera-location">{{ camera.location }}</span>
          </div>
          <div class="camera-status">
            <span class="status-dot" :class="camera.status"></span>
            <span :class="['status-label', camera.status]">
              {{ statusText(camera.status) }}
            </span>
          </div>
        </div>
        <div class="video-area" :class="{ offline: camera.status === 'offline' }">
          <div class="video-placeholder">
            <i
              :class="[
                'fas',
                camera.status === 'offline' ? 'fa-video-slash' : 'fa-video',
                'fa-3x',
              ]"
            ></i>
            <p>{{ camera.status === 'offline' ? '视频离线' : '模拟视频流' }}</p>
            <p class="ip-text">{{ camera.ip }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMonitorList } from '@/api/modules/monitor'

const layout = ref('4')
const cameras = ref([])

const statusText = (status) => {
  const map = { online: '在线', offline: '离线', warning: '异常' }
  return map[status] || status
}

const toggleFullscreen = (id) => {
  const el = document.querySelector(`.monitor-card:nth-child(${cameras.value.findIndex((c) => c.id === id) + 1}) .video-area`)
  if (el) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen().catch(() => {})
    }
  }
}

onMounted(async () => {
  cameras.value = await getMonitorList()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}

.monitor-grid {
  display: grid;
  gap: 20px;
}

.layout-4 {
  grid-template-columns: repeat(2, 1fr);
}

.layout-6 {
  grid-template-columns: repeat(3, 1fr);
}

.layout-9 {
  grid-template-columns: repeat(3, 1fr);
}

.monitor-card {
  background: rgba(45, 45, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease;
}

.monitor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.camera-info h3 {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
}

.camera-location {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.camera-status {
  display: flex;
  align-items: center;
  gap: 6px;
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

.status-dot.warning {
  background: #faad14;
}

.status-label {
  font-size: 12px;
}

.status-label.online {
  color: #52c41a;
}

.status-label.offline {
  color: #ff4d4f;
}

.status-label.warning {
  color: #faad14;
}

.video-area {
  aspect-ratio: 16 / 9;
  background: #0a0a0a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.video-area.offline {
  background: #1a1a1a;
}

.video-placeholder {
  text-align: center;
  color: rgba(255, 255, 255, 0.2);
}

.video-placeholder i {
  margin-bottom: 8px;
}

.video-placeholder p {
  font-size: 13px;
  margin-bottom: 4px;
}

.ip-text {
  font-size: 11px !important;
  color: rgba(255, 255, 255, 0.15) !important;
  font-family: 'Consolas', monospace;
}

@media (max-width: 1200px) {
  .layout-6,
  .layout-9 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .monitor-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
