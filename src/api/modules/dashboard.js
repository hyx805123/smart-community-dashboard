import request from '../request'

/**
 * 获取社区概况统计数据
 * @returns {Promise<{population, households, parkingUsage, deviceOnlineRate, populationTrend, householdTrend, months}>}
 */
export const getDashboardStats = () => request.get('/dashboard/stats')

/**
 * 获取监控概览数据
 * @returns {Promise<{cameras, todayVisitors, todayAlarms, todayCars}>}
 */
export const getMonitorOverview = () => request.get('/dashboard/monitorOverview')
