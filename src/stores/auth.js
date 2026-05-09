import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => user.value?.name || '管理员')
  const userRole = computed(() => user.value?.role || 'admin')

  const setDemoUser = () => {
    const demoUser = {
      id: 1,
      name: '系统管理员',
      role: 'admin',
      avatar: '',
    }
    token.value = 'demo-token-' + Date.now()
    user.value = demoUser
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(demoUser))
  }

  const login = async (credentials) => {
    // 预留：真实登录接口
    // const res = await authApi.login(credentials)
    // token.value = res.token
    // user.value = res.user
    // localStorage.setItem('token', res.token)
    // localStorage.setItem('user', JSON.stringify(res.user))

    // Mock 登录
    const mockUser = {
      id: 1,
      name: credentials.username || '管理员',
      role: 'admin',
      avatar: '',
    }
    token.value = 'mock-token-' + Date.now()
    user.value = mockUser
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isLoggedIn,
    userName,
    userRole,
    setDemoUser,
    login,
    logout,
  }
})
