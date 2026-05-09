import Mock from 'mockjs'

const peopleTypes = ['resident', 'visitor', 'staff']
const houseTypes = ['三室两厅', '两室一厅', '一室一厅', '四室两厅']
const houseStatuses = ['occupied', 'rented', 'vacant']
const carTypes = ['resident', 'visitor', 'temporary']
const buildings = ['A栋', 'B栋', 'C栋', 'D栋', 'E栋']

// 人员列表
Mock.mock('/api/people/list', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const type = params.get('type') || ''

  let list = Mock.mock({
    'items|48': [{
      'id|+1': 1,
      'name': '@cname',
      'type|1': peopleTypes,
      'building|1': buildings,
      'unit': /[1-3]单元/,
      'room': /\d{3}/,
      'phone': /1[3-9]\d{9}/,
      'lastAccess': '@datetime("yyyy-MM-dd HH:mm")',
      'age|18-80': 1,
    }],
  }).items

  if (keyword) list = list.filter((i) => i.name.includes(keyword) || i.phone.includes(keyword))
  if (type) list = list.filter((i) => i.type === type)

  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 200,
    data: { list: list.slice(start, start + pageSize), total, page, pageSize },
  }
})

// 人员统计
Mock.mock('/api/people/stats', 'get', () => ({
  code: 200,
  data: {
    total: 1256,
    resident: 986,
    visitor: 158,
    staff: 112,
    dist: [
      { name: '常住人口', value: 986 },
      { name: '访客', value: 158 },
      { name: '工作人员', value: 112 },
    ],
    ageDist: [
      { name: '0-18岁', value: 156 },
      { name: '19-30岁', value: 285 },
      { name: '31-45岁', value: 420 },
      { name: '46-60岁', value: 280 },
      { name: '60岁以上', value: 115 },
    ],
  },
}))

// 房屋列表
Mock.mock('/api/house/list', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const status = params.get('status') || ''

  let list = Mock.mock({
    'items|50': [{
      'id|+1': 1,
      'code': /[A-E]-\d-\d{4}/,
      'building|1': buildings,
      'unit': /[1-3]单元/,
      'floor|1-18': 1,
      'room': /\d{2}/,
      'type|1': houseTypes,
      'status|1': houseStatuses,
      'owner': '@cname',
      'phone': /1[3-9]\d{9}/,
      'moveInDate': '@date("yyyy-MM-dd")',
    }],
  }).items

  if (keyword) list = list.filter((i) => i.code.includes(keyword) || i.owner.includes(keyword))
  if (status) list = list.filter((i) => i.status === status)

  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 200,
    data: { list: list.slice(start, start + pageSize), total, page, pageSize },
  }
})

// 房屋统计
Mock.mock('/api/house/stats', 'get', () => ({
  code: 200,
  data: {
    total: 856,
    occupied: 625,
    rented: 186,
    vacant: 45,
    typeDist: [
      { name: '三室两厅', value: 320 },
      { name: '两室一厅', value: 240 },
      { name: '一室一厅', value: 180 },
      { name: '四室两厅', value: 116 },
    ],
    buildingDist: [
      { name: 'A栋', value: 180 },
      { name: 'B栋', value: 186 },
      { name: 'C栋', value: 165 },
      { name: 'D栋', value: 170 },
      { name: 'E栋', value: 155 },
    ],
  },
}))

// 车辆记录
Mock.mock('/api/car/records', 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page')) || 1
  const pageSize = parseInt(params.get('pageSize')) || 10
  const keyword = params.get('keyword') || ''
  const type = params.get('type') || ''

  let list = Mock.mock({
    'items|40': [{
      'id|+1': 1,
      'plate': /京[A-C][A-Z]\d{4,5}/,
      'type|1': carTypes,
      'action|1': ['进入', '离开'],
      'time': '@datetime("yyyy-MM-dd HH:mm")',
      'parkingSpace': /[A-C]区-\d{3}/,
      'status|1': ['parked', 'left'],
    }],
  }).items

  if (keyword) list = list.filter((i) => i.plate.includes(keyword))
  if (type) list = list.filter((i) => i.type === type)

  const total = list.length
  const start = (page - 1) * pageSize
  return {
    code: 200,
    data: { list: list.slice(start, start + pageSize), total, page, pageSize },
  }
})

// 车辆统计
Mock.mock('/api/car/stats', 'get', () => ({
  code: 200,
  data: {
    totalSpaces: 500,
    used: 386,
    available: 114,
    usageRate: 77.2,
    usageTrend: {
      hours: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      data: [30, 25, 65, 85, 70, 95, 55],
    },
    typeDist: [
      { name: '业主车辆', value: 250 },
      { name: '访客车辆', value: 86 },
      { name: '临时车辆', value: 50 },
    ],
  },
}))
