import request from '../request'

/**
 * 获取巡更记录
 * @param {Object} params - { page, pageSize, keyword, status }
 */
export const getPatrolList = (params) => request.get('/patrol/list', { params })

/**
 * 获取巡更统计
 */
export const getPatrolStats = () => request.get('/patrol/stats')
