import request from '../request'

/**
 * 获取房屋列表
 * @param {Object} params - { page, pageSize, keyword, status }
 */
export const getHouseList = (params) => request.get('/house/list', { params })

/**
 * 获取房屋统计
 */
export const getHouseStats = () => request.get('/house/stats')
