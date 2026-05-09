import Mock from 'mockjs'

const patrolStatuses = ['normal', 'warning', 'abnormal']
const repairTypes = ['水电维修', '门窗维修', '公共设施', '电梯故障', '其他']
const repairStatuses = ['pending', 'processing', 'completed']
const repairPriorities = ['high', 'medium', 'low']
const noticeTypes = ['important', 'normal', 'activity']
const noticeStatuses = ['published', 'draft']

// 巡更记录
Mock.mock('/api/patrol/list', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const status = params.get('status') || ''

  let list = Mock.mock({
    'items|35': [{
      'id|+1': 1,
      'staff': '@cname',
      'route': /[A-C]区-\d号线/,
      'startTime': '@datetime("yyyy-MM-dd HH:mm")',
      'endTime': '@datetime("yyyy-MM-dd HH:mm")',
      'status|1': patrolStatuses,
      'abnormal': '@csentence(5, 15)',
    }],
  }).items

  if (keyword) list = list.filter((i) => i.staff.includes(keyword) || i.route.includes(keyword))
  if (status) list = list.filter((i) => i.status === status)

  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 200,
    data: { list: list.slice(start, start + pageSize), total, page, pageSize },
  }
})

// 巡更统计
Mock.mock('/api/patrol/stats', 'get', () => ({
  code: 200,
  data: {
    staffCount: 12,
    pointCount: 36,
    todayCount: 128,
    completionRate: [95, 98, 92, 96, 94, 90, 93],
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    abnormalDist: [
      { name: '超时', value: 15 },
      { name: '漏检', value: 10 },
      { name: '路线偏离', value: 8 },
      { name: '其他', value: 5 },
    ],
  },
}))

// 报修列表
Mock.mock('/api/repair/list', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const status = params.get('status') || ''
  const priority = params.get('priority') || ''

  let list = Mock.mock({
    'items|38': [{
      'id|+1': 1,
      'code': /RP\d{14}\d{4}/,
      'type|1': repairTypes,
      'location': /[A-E]栋\d单元\d{4}|[A-C]区[\u4e00-\u9fa5]{2,4}/,
      'priority|1': repairPriorities,
      'status|1': repairStatuses,
      'createTime': '@datetime("yyyy-MM-dd HH:mm")',
      'description': '@csentence(10, 30)',
    }],
  }).items

  if (keyword) list = list.filter((i) => i.code.includes(keyword) || i.location.includes(keyword))
  if (status) list = list.filter((i) => i.status === status)
  if (priority) list = list.filter((i) => i.priority === priority)

  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 200,
    data: { list: list.slice(start, start + pageSize), total, page, pageSize },
  }
})

// 报修统计
Mock.mock('/api/repair/stats', 'get', () => ({
  code: 200,
  data: {
    total: 156,
    pending: 45,
    processing: 68,
    completed: 43,
    typeDist: [
      { name: '水电维修', value: 35 },
      { name: '门窗维修', value: 25 },
      { name: '公共设施', value: 20 },
      { name: '电梯故障', value: 15 },
      { name: '其他', value: 5 },
    ],
    efficiency: {
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      data: [4.5, 3.8, 5.2, 4.0, 3.5, 6.0, 5.5],
    },
  },
}))

// 更新报修状态
Mock.mock(/\/api\/repair\/\d+\/status/, 'post', () => ({
  code: 200,
  data: true,
  message: '状态更新成功',
}))

// 公告列表
Mock.mock('/api/notice/list', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const type = params.get('type') || ''

  let list = Mock.mock({
    'items|30': [{
      'id|+1': 1,
      'title': '@ctitle(8, 20)',
      'type|1': noticeTypes,
      'publishTime': '@date("yyyy-MM-dd")',
      'publisher': /物业管理处|社区文化中心|业主委员会/,
      'status|1': noticeStatuses,
      'content': '@cparagraph(2, 5)',
    }],
  }).items

  if (keyword) list = list.filter((i) => i.title.includes(keyword))
  if (type) list = list.filter((i) => i.type === type)

  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 200,
    data: { list: list.slice(start, start + pageSize), total, page, pageSize },
  }
})

// 公告统计
Mock.mock('/api/notice/stats', 'get', () => ({
  code: 200,
  data: {
    total: 156,
    thisMonth: 45,
    draft: 12,
    typeDist: [
      { name: '重要通知', value: 45 },
      { name: '一般通知', value: 65 },
      { name: '活动通知', value: 35 },
      { name: '其他', value: 11 },
    ],
  },
}))
