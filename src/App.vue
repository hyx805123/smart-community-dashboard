<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(() => {
  appStore.startClock()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  background: #0d1117;
  color: #fff;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
}
::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.3);
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Element Plus 暗色主题覆盖 */
.el-table {
  --el-table-bg-color: transparent !important;
  --el-table-tr-bg-color: transparent !important;
  --el-table-header-bg-color: rgba(0,0,0,0.2) !important;
  --el-table-row-hover-bg-color: rgba(255,255,255,0.05) !important;
  --el-table-border-color: rgba(255,255,255,0.1) !important;
  color: #fff !important;
}
.el-table th.el-table__cell {
  background-color: rgba(0,0,0,0.2) !important;
  color: #fff !important;
}
.el-pagination {
  --el-pagination-bg-color: transparent !important;
  --el-pagination-button-color: #fff !important;
  --el-pagination-hover-color: #1890ff !important;
}
.el-input__wrapper,
.el-select .el-input__wrapper {
  background-color: rgba(255,255,255,0.05) !important;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1) inset !important;
}
.el-input__inner {
  color: #fff !important;
}
.el-dialog {
  --el-dialog-bg-color: #1a1a2e !important;
  --el-dialog-title-font-size: 18px;
}
.el-dialog__title {
  color: #fff !important;
}
</style>
