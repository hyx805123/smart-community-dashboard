<template>
  <div class="breadcrumb">
    <template v-for="(item, index) in breadcrumbs" :key="item.path">
      <router-link v-if="index < breadcrumbs.length - 1" :to="item.path" class="breadcrumb-link">
        {{ item.title }}
      </router-link>
      <span v-else class="breadcrumb-current">{{ item.title }}</span>
      <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const items = [{ title: '首页', path: '/dashboard' }]
  if (route.meta?.title && route.path !== '/dashboard') {
    items.push({ title: route.meta.title, path: route.path })
  }
  return items
})
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-link:hover {
  color: #1890ff;
}

.breadcrumb-current {
  color: #fff;
  font-weight: 500;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.3);
}
</style>
