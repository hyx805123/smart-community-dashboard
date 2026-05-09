<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="logo">
      <img src="/assets/logo.svg" alt="智慧社区" />
      <span v-show="!appStore.sidebarCollapsed" class="logo-text">智慧社区</span>
    </div>

    <nav class="nav-menu">
      <router-link
        v-for="route in menuRoutes"
        :key="route.path"
        :to="route.path"
        class="nav-item"
        :class="{ active: $route.path === route.path }"
      >
        <i :class="['fas', route.meta.icon]"></i>
        <span v-show="!appStore.sidebarCollapsed" class="nav-title">{{ route.meta.title }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer" v-show="!appStore.sidebarCollapsed">
      <div class="version">v1.0.0</div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import router from '@/router'

const appStore = useAppStore()
const $route = useRoute()

const menuRoutes = computed(() => {
  const layoutRoute = router.getRoutes().find((r) => r.name === 'Layout')
  return layoutRoute ? layoutRoute.children : []
})
</script>

<style scoped>
.sidebar {
  width: 200px;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(10px);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0 16px;
}

.logo img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
  white-space: nowrap;
  overflow: hidden;
}

.nav-menu {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.nav-item i {
  width: 20px;
  text-align: center;
  font-size: 16px;
  color: #1890ff;
  flex-shrink: 0;
}

.nav-title {
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-item.active {
  background: rgba(24, 144, 255, 0.15);
  color: #1890ff;
}

.nav-item.active i {
  color: #1890ff;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.version {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .sidebar {
    width: 64px;
  }
  .logo-text,
  .nav-title,
  .sidebar-footer {
    display: none !important;
  }
}
</style>
