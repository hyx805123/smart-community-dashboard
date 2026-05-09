<template>
  <div class="data-table-wrapper">
    <div class="table-toolbar">
      <div class="toolbar-left">
        <el-input
          v-if="searchable"
          v-model="searchKeyword"
          placeholder="搜索..."
          clearable
          style="width: 240px"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <i class="fas fa-search"></i>
          </template>
        </el-input>
        <slot name="filters" />
      </div>
      <div class="toolbar-right">
        <el-button v-if="exportable" type="primary" plain @click="handleExport">
          <i class="fas fa-download" style="margin-right: 6px;"></i>导出Excel
        </el-button>
        <slot name="actions" />
      </div>
    </div>

    <el-table
      :data="displayData"
      v-loading="loading"
      style="width: 100%"
      :header-cell-style="{ background: 'rgba(0,0,0,0.2)', color: '#fff' }"
      :cell-style="{ color: 'rgba(255,255,255,0.85)' }"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :sortable="col.sortable"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <slot :name="col.prop" :row="row">
            {{ row[col.prop] }}
          </slot>
        </template>
      </el-table-column>

      <el-table-column v-if="$slots.rowActions" label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <slot name="rowActions" :row="row" />
        </template>
      </el-table-column>
    </el-table>

    <div class="table-pagination" v-if="paginated">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { exportToExcel } from '@/utils/export'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  searchable: { type: Boolean, default: true },
  exportable: { type: Boolean, default: true },
  paginated: { type: Boolean, default: true },
  pageSize: { type: Number, default: 10 },
})

const emit = defineEmits(['search', 'pageChange', 'sizeChange'])

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(props.pageSize)

// 如果数据已经分页（来自API），直接显示；否则前端分页
const isServerPaginated = computed(() => {
  // 简单判断：如果data长度和total差异大，说明是服务端分页
  return false // 默认前端分页，可通过props控制
})

const displayData = computed(() => {
  if (props.paginated && !isServerPaginated.value) {
    const start = (currentPage.value - 1) * pageSize.value
    return props.data.slice(start, start + pageSize.value)
  }
  return props.data
})

const total = computed(() => props.data.length)

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handlePageChange = (page) => {
  emit('pageChange', page)
}

const handleSizeChange = (size) => {
  emit('sizeChange', size)
}

const handleExport = () => {
  exportToExcel(props.data, props.columns, '数据导出')
}

watch(searchKeyword, (val) => {
  if (!val) emit('search', '')
})
</script>

<style scoped>
.data-table-wrapper {
  background: rgba(45, 45, 55, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table__empty-text) {
  color: rgba(255, 255, 255, 0.4);
}
</style>
