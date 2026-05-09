import request from '../request'

/**
 * 获取车辆出入记录
 * @param {Object} params - { page, pageSize, keyword, type }
 */
export const getCarRecords = (params) => request.get('/car/records', { params })

/**
 * 获取车辆统计
 */
export const getCarStats = () => request.get('/car/stats')
