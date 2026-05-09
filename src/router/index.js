import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '社区概况', icon: 'fa-chart-line' },
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/Monitor/index.vue'),
        meta: { title: '实时监控', icon: 'fa-video' },
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/views/Device/index.vue'),
        meta: { title: '设备管理', icon: 'fa-tools' },
      },
      {
        path: 'alarm',
        name: 'Alarm',
        component: () => import('@/views/Alarm/index.vue'),
        meta: { title: '告警管理', icon: 'fa-bell' },
      },
      {
        path: 'people',
        name: 'People',
        component: () => import('@/views/People/index.vue'),
        meta: { title: '人员信息', icon: 'fa-users' },
      },
      {
        path: 'house',
        name: 'House',
        component: () => import('@/views/House/index.vue'),
        meta: { title: '房屋信息', icon: 'fa-home' },
      },
      {
        path: 'car',
        name: 'Car',
        component: () => import('@/views/Car/index.vue'),
        meta: { title: '车辆信息', icon: 'fa-car' },
      },
      {
        path: 'patrol',
        name: 'Patrol',
        component: () => import('@/views/Patrol/index.vue'),
        meta: { title: '巡更管理', icon: 'fa-shield-alt' },
      },
      {
        path: 'repair',
        name: 'Repair',
        component: () => import('@/views/Repair/index.vue'),
        meta: { title: '报修管理', icon: 'fa-wrench' },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/Notice/index.vue'),
        meta: { title: '公告信息', icon: 'fa-bullhorn' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (!to.meta.public && !authStore.token) {
    // 演示环境：自动跳过登录，直接设置默认用户
    authStore.setDemoUser()
    next()
    // 生产环境请使用下面这行：
    // next('/login')
  } else {
    next()
  }
})

export default router
