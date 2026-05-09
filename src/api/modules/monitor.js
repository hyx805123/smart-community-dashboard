import request from '../request'

/**
 * 获取监控点位列表
 * @returns {Promise<Array>}
 */
export const getMonitorList = () => request.get('/monitor/list')
