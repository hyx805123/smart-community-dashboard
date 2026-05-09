<template>
  <header class="app-header">
    <div class="header-left">
      <button class="toggle-btn" @click="appStore.toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <breadcrumb />
    </div>

    <div class="header-right">
      <div class="header-item time-display">
        <span class="date">{{ appStore.currentDate }}</span>
        <span class="time">{{ appStore.currentTime }}</span>
      </div>

      <div class="header-item weather">
        <span class="weather-icon">{{ appStore.weather.icon }}</span>
        <span>{{ appStore.weather.text }} {{ appStore.weather.temp }}°C</span>
      </div>

      <el-dropdown class="header-item" trigger="click">
        <div class="notification-bell">
          <el-badge :value="appStore.unreadCount" :max="99">
            <i class="fas fa-bell" style="font-size: 18px; color: #fff;"></i>
          </el-badge>
        </div>
        <template #dropdown>
          <el-dropdown-menu style="background: #1a1a2e; border-color: rgba(255,255,255,0.1);">
            <el-dropdown-item style="color: #fff;">
              <i class="fas fa-exclamation-circle" style="color: #ff4d4f; margin-right: 8px;"></i>
              A区大门设备离线
            </el-dropdown-item>
            <el-dropdown-item style="color: #fff;">
              <i class="fas fa-shield-alt" style="color: #faad14; margin-right: 8px;"></i>
              检测到异常行为
            </el-dropdown-item>
            <el-dropdown-item style="color: #fff;">
              <i class="fas fa-tools" style="color: #1890ff; margin-right: 8px;"></i>
              电梯例行维护提醒
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div class="header-item fullscreen-btn" @click="appStore.toggleFullscreen">
        <i :class="appStore.isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
      </div>

      <el-dropdown class="header-item user-dropdown" trigger="click">
        <div class="user-info">
          <el-avatar :size="32" :icon="UserFilled" style="background: #1890ff;" />
          <span v-if="!appStore.sidebarCollapsed" class="user-name">{{ authStore.userName }}</span>
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu style="background: #1a1a2e; border-color: rgba(255,255,255,0.1);">
            <el-dropdown-item style="color: #fff;" @click="$router.push('/dashboard')">
              <i class="fas fa-user" style="margin-right: 8px;"></i>个人中心
            </el-dropdown-item>
            <el-dropdown-item style="color: #fff;" @click="$router.push('/dashboard')">
              <i class="fas fa-cog" style="margin-right: 8px;"></i>系统设置
            </el-dropdown-item>
            <el-dropdown-item divided style="color: #ff4d4f;" @click="handleLogout">
              <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Breadcrumb from './Breadcrumb.vue'

const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  height: 64px;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.3s;
}

.header-item:hover {
  color: #fff;
}

.time-display {
  font-family: 'Consolas', monospace;
}

.time-display .date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.time-display .time {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}

.weather {
  font-size: 14px;
}

.weather-icon {
  font-size: 18px;
}

.notification-bell {
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.notification-bell:hover {
  background: rgba(255, 255, 255, 0.1);
}

.fullscreen-btn {
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-size: 14px;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .time-display .date,
  .weather,
  .user-name {
    display: none;
  }
}
</style>
