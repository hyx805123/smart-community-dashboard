import * as XLSX from 'xlsx'

/**
 * 导出数据为 Excel 文件
 * @param {Array} data 数据数组
 * @param {Array} columns 列配置 [{ prop, label }]
 * @param {String} filename 文件名
 */
export function exportToExcel(data, columns, filename = '导出数据') {
  if (!data || data.length === 0) {
    return
  }

  const exportData = data.map((row) => {
    const obj = {}
    columns.forEach((col) => {
      obj[col.label] = row[col.prop]
    })
    return obj
  })

  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  const dateStr = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`)
}

/**
 * 导出表格为 CSV
 */
export function exportToCSV(data, columns, filename = '导出数据') {
  if (!data || data.length === 0) return

  const headers = columns.map((c) => c.label).join(',')
  const rows = data
    .map((row) => {
      return columns
        .map((col) => {
          const val = row[col.prop]
          if (val === null || val === undefined) return ''
          const str = String(val).replace(/"/g, '""')
          return str.includes(',') ? `"${str}"` : str
        })
        .join(',')
    })
    .join('\n')

  const csvContent = '\uFEFF' + headers + '\n' + rows
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
