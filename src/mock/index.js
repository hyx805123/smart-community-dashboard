import Mock from 'mockjs'
import './modules/dashboard'
import './modules/device'
import './modules/community'
import './modules/operation'

Mock.setup({
  timeout: '300-800',
})

export function setupMock() {
  console.log('[Mock] Mock service initialized')
}
