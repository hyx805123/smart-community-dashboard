import Mock from 'mockjs'

// 社区概况数据
Mock.mock('/api/dashboard/stats', 'get', () => {
  return {
    code: 200,
    data: {
      population: 2345,
      households: 1200,
      parkingUsage: 85,
      deviceOnlineRate: 98.5,
      populationTrend: [2100, 2150, 2200, 2250, 2300, 2345],
      householdTrend: [1000, 1050, 1100, 1150, 1180, 1200],
      months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
  }
})

// 监控概览
Mock.mock('/api/dashboard/monitorOverview', 'get', () => {
  return {
    code: 200,
    data: {
      cameras: [
        { name: '大门监控', status: 'online' },
        { name: '停车场监控', status: 'online' },
        { name: '后门监控', status: 'offline' },
        { name: '儿童游乐场', status: 'online' },
      ],
      todayVisitors: 156,
      todayAlarms: 15,
      todayCars: 328,
    },
  }
})

// 监控点位列表
Mock.mock('/api/monitor/list', 'get', () => {
  const cameras = [
    { id: 1, name: '大门监控点', location: 'A区大门', status: 'online', ip: '192.168.1.101' },
    { id: 2, name: '停车场监控点', location: 'B区停车场', status: 'online', ip: '192.168.1.102' },
    { id: 3, name: '小区公园监控点', location: '中心公园', status: 'offline', ip: '192.168.1.103' },
    { id: 4, name: '儿童游乐场监控点', location: 'C区游乐场', status: 'online', ip: '192.168.1.104' },
    { id: 5, name: '电梯厅监控点', location: 'A栋大堂', status: 'online', ip: '192.168.1.105' },
    { id: 6, name: '后门监控点', location: 'D区后门', status: 'warning', ip: '192.168.1.106' },
  ]
  return { code: 200, data: cameras }
})
