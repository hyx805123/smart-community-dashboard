import Mock from 'mockjs'

const deviceTypes = ['监控设备', '门禁系统', '电梯系统', '消防设备', '照明系统', '其他设备']
const deviceStatuses = ['normal', 'warning', 'error']
const locations = ['A区大门', 'B区停车场', 'C栋', 'D区后门', '中心公园', 'A栋大堂', 'B栋2单元', 'C栋配电室']

// 设备列表
Mock.mock('/api/device/list', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const type = params.get('type') || ''
  const status = params.get('status') || ''

  let list = Mock.mock({
    'items|45': [{
      'id|+1': 1,
      'name': /(门禁|摄像头|电梯|消防|照明)-[A-D]区-\d{2}/,
      'type|1': deviceTypes,
      'location|1': locations,
      'status|1': deviceStatuses,
      'lastUpdate': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'ip': /192\.168\.1\.\d{3}/,
    }],
  }).items

  if (keyword) {
    list = list.filter((item) => item.name.includes(keyword) || item.location.includes(keyword))
  }
  if (type) {
    list = list.filter((item) => item.type === type)
  }
  if (status) {
    list = list.filter((item) => item.status === status)
  }

  const total = list.length
  const start = (page - 1) * pageSize
  const paginated = list.slice(start, start + pageSize)

  return {
    code: 200,
    data: { list: paginated, total, page, pageSize },
  }
})

// 设备统计
Mock.mock('/api/device/stats', 'get', () => {
  return {
    code: 200,
    data: {
      total: 156,
      online: 142,
      offline: 14,
      statusDist: [
        { name: '正常', value: 120 },
        { name: '警告', value: 22 },
        { name: '故障', value: 14 },
      ],
      typeDist: [
        { name: '监控设备', value: 45 },
        { name: '门禁系统', value: 30 },
        { name: '电梯系统', value: 25 },
        { name: '消防设备', value: 35 },
        { name: '其他设备', value: 21 },
      ],
    },
  }
})

// 告警列表
Mock.mock('/api/alarm/list', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const level = params.get('level') || ''
  const status = params.get('status') || ''

  const alarmTypes = ['设备离线', '异常行为', '温度异常', '非法闯入', '消防告警', '门禁异常']
  const alarmLevels = ['critical', 'warning', 'info']
  const alarmStatuses = ['pending', 'processing', 'resolved']

  let list = Mock.mock({
    'items|32': [{
      'id|+1': 1,
      'time': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'type|1': alarmTypes,
      'level|1': alarmLevels,
      'location|1': locations,
      'status|1': alarmStatuses,
      'description': '@csentence(10, 30)',
    }],
  }).items

  // 确保前几条数据固定用于演示
  list[0] = { id: 1, time: '2026-05-09 10:30:15', type: '设备离线', level: 'critical', location: 'A区大门', status: 'pending', description: '大门监控设备网络连接中断' }
  list[1] = { id: 2, time: '2026-05-09 10:28:45', type: '异常行为', level: 'warning', location: 'B区停车场', status: 'processing', description: '检测到可疑人员徘徊' }
  list[2] = { id: 3, time: '2026-05-09 10:25:30', type: '温度异常', level: 'info', location: 'C栋配电室', status: 'resolved', description: '配电室温度超过阈值' }

  if (keyword) {
    list = list.filter((item) => item.type.includes(keyword) || item.location.includes(keyword))
  }
  if (level) list = list.filter((item) => item.level === level)
  if (status) list = list.filter((item) => item.status === status)

  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 200,
    data: { list: list.slice(start, start + pageSize), total, page, pageSize },
  }
})

// 告警统计
Mock.mock('/api/alarm/stats', 'get', () => {
  return {
    code: 200,
    data: {
      today: 15,
      pending: 8,
      resolved: 7,
      trend: {
        hours: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        critical: [3, 2, 4, 5, 3, 2, 1],
        warning: [5, 4, 6, 4, 5, 3, 2],
        info: [7, 5, 8, 6, 4, 5, 3],
      },
      typeDist: [
        { name: '设备离线', value: 35 },
        { name: '异常行为', value: 25 },
        { name: '温度异常', value: 20 },
        { name: '非法闯入', value: 15 },
        { name: '其他', value: 10 },
      ],
    },
  }
})

// 处理告警
Mock.mock(/\/api\/alarm\/\d+\/resolve/, 'post', () => {
  return { code: 200, data: true, message: '处理成功' }
})
