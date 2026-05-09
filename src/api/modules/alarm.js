import request from '../request'

/**
 * 获取告警列表
 * @param {Object} params - { page, pageSize, keyword, level, status }
 */
export const getAlarmList = (params) => request.get('/alarm/list', { params })

/**
 * 获取告警统计
 */
export const getAlarmStats = () => request.get('/alarm/stats')

/**
 * 处理告警
 * @param {number} id 告警ID
 */
export const resolveAlarm = (id) => request.post(`/alarm/${id}/resolve`)
