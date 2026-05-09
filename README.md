# 智慧社区监控大屏

基于 Vue 3 + Vite 的智慧社区弱电/智能化项目管理平台，面向物业公司、住户、租户等用户群体，提供社区概况、实时监控、设备管理、告警管理、人员信息、房屋信息、车辆信息、巡更管理、报修管理、公告信息等十大功能模块。

## 功能特性

- 社区概况数据可视化（ECharts 图表 + 实时刷新）
- 实时监控多画面布局（4/6/9 宫格切换 + 双击全屏）
- 设备台账管理（搜索 / 筛选 / 分页 / 导出 / 详情）
- 告警集中处理（级别筛选 / 标记处理 / 趋势分析）
- 人员 / 房屋 / 车辆信息管理
- 巡更记录与完成率统计
- 报修工单状态流转（待处理 → 处理中 → 已完成）
- 公告发布与类型分布
- 数据导出 Excel（SheetJS）
- 演示环境 Mock 数据（开发环境自动加载）
- 真实 API 接口预留（生产环境一键切换）

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5+ | 前端框架 |
| Vite | 8.0+ | 构建工具 |
| Vue Router | 4.6+ | 路由管理 |
| Pinia | 3.0+ | 状态管理 |
| Element Plus | 2.14+ | UI 组件库 |
| ECharts | 6.0+ | 数据可视化 |
| Axios | 1.16+ | HTTP 请求 |
| MockJS | 1.1+ | Mock 数据 |
| SheetJS (xlsx) | 0.18+ | Excel 导出 |

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认访问地址：`http://localhost:5173`

### 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
  api/          # API 接口层（Axios 封装 + 各模块接口）
  components/   # 公共组件（布局 / 侧边栏 / 表格 / 图表等）
  mock/         # Mock 数据服务（开发环境）
  router/       # Vue Router 配置
  stores/       # Pinia 状态管理
  utils/        # 工具函数（格式化 / 导出）
  views/        # 页面视图（10 个功能模块 + 登录页）
```

## Mock 切换真实 API

1. 修改 `src/main.js`，注释掉或删除 `setupMock()` 调用
2. 配置 `.env.production`：
   ```env
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```
3. 确保后端接口路径与 Mock 定义一致（均以 `/api` 为前缀）
4. 重新构建部署

## 文档

- `docs/优化说明技术文档.md` — 项目架构、技术选型、API 接口文档
- `docs/项目使用文档.md` — 系统功能说明、操作指南、常见问题
- `docs/部署说明文档.md` — 环境搭建、Nginx/Docker 部署、问题排查

## 原项目

原纯 HTML 项目完整备份在 `legacy/` 目录中。
