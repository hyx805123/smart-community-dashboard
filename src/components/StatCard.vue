<template>
  <div class="stat-card" :style="cardStyle">
    <div class="stat-header">
      <div class="stat-icon" :style="{ background: iconBg }">
        <i :class="['fas', icon]"></i>
      </div>
      <div class="stat-trend" v-if="trend !== undefined">
        <span :class="trend >= 0 ? 'trend-up' : 'trend-down'">
          <i :class="['fas', trend >= 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
          {{ Math.abs(trend) }}%
        </span>
      </div>
    </div>
    <div class="stat-body">
      <div class="stat-value" :style="{ color: valueColor }">{{ formattedValue }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatNumber } from '@/utils/format'

const props = defineProps({
  icon: { type: String, default: 'fa-chart-line' },
  iconBg: { type: String, default: 'rgba(24, 144, 255, 0.15)' },
  value: { type: [Number, String], default: 0 },
  valueColor: { type: String, default: '#fff' },
  label: { type: String, default: '' },
  trend: { type: Number, default: undefined },
  suffix: { type: String, default: '' },
})

const formattedValue = computed(() => {
  const num = Number(props.value)
  if (!isNaN(num)) {
    return formatNumber(num) + props.suffix
  }
  return props.value + props.suffix
})

const cardStyle = computed(() => ({
  background: 'rgba(45, 45, 55, 0.6)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
}))
</script>

<style scoped>
.stat-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #1890ff;
}

.stat-trend {
  font-size: 13px;
}

.trend-up {
  color: #52c41a;
}

.trend-down {
  color: #ff4d4f;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
  font-family: 'Consolas', monospace;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
