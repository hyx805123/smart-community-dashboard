import request from '../request'

/**
 * 获取公告列表
 * @param {Object} params - { page, pageSize, keyword, type }
 */
export const getNoticeList = (params) => request.get('/notice/list', { params })

/**
 * 获取公告统计
 */
export const getNoticeStats = () => request.get('/notice/stats')
