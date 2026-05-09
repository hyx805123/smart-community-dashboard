<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-wrapper" :class="{ collapsed: appStore.sidebarCollapsed }">
      <AppHeader />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const appStore = useAppStore()
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #0d1117;
}

.main-wrapper {
  flex: 1;
  margin-left: 200px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.main-wrapper.collapsed {
  margin-left: 64px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 64px;
  }
}
</style>
