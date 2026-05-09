import request from '../request'

/**
 * 获取人员列表
 * @param {Object} params - { page, pageSize, keyword, type }
 */
export const getPeopleList = (params) => request.get('/people/list', { params })

/**
 * 获取人员统计
 */
export const getPeopleStats = () => request.get('/people/stats')
