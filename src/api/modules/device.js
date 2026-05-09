import request from '../request'

/**
 * 获取设备列表
 * @param {Object} params - { page, pageSize, keyword, type, status }
 */
export const getDeviceList = (params) => request.get('/device/list', { params })

/**
 * 获取设备统计
 */
export const getDeviceStats = () => request.get('/device/stats')
