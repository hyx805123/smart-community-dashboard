import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Sidebar
  const sidebarCollapsed = ref(false)
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // Clock
  const currentTime = ref('')
  const currentDate = ref('')
  let clockTimer = null

  const startClock = () => {
    const update = () => {
      const now = new Date()
      currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
      currentDate.value = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
      })
    }
    update()
    clockTimer = setInterval(update, 1000)
  }

  const stopClock = () => {
    if (clockTimer) clearInterval(clockTimer)
  }

  // Weather (mock)
  const weather = ref({ text: '晴', temp: 26, icon: '☀️' })

  // Notifications
  const unreadCount = computed(() => {
    // Mock: 从alarm等模块获取未读数
    return 3
  })

  // Fullscreen
  const isFullscreen = ref(false)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      isFullscreen.value = true
    } else {
      document.exitFullscreen().catch(() => {})
      isFullscreen.value = false
    }
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    currentTime,
    currentDate,
    startClock,
    stopClock,
    weather,
    unreadCount,
    isFullscreen,
    toggleFullscreen,
  }
})
