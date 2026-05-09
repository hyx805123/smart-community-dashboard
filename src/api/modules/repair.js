import request from '../request'

/**
 * 获取报修列表
 * @param {Object} params - { page, pageSize, keyword, status, priority }
 */
export const getRepairList = (params) => request.get('/repair/list', { params })

/**
 * 获取报修统计
 */
export const getRepairStats = () => request.get('/repair/stats')

/**
 * 更新报修状态
 * @param {number} id
 * @param {string} status
 */
export const updateRepairStatus = (id, status) =>
  request.post(`/repair/${id}/status`, { status })
