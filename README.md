# 美食收藏地图

一个基于高德地图的美食收藏管理系统，用于记录和展示收藏的餐厅、美食店铺。

[English](./README_EN.md)

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 (App Router) + TypeScript |
| 数据库 | PostgreSQL 16 + Prisma 7 |
| 认证 | NextAuth.js v4 (JWT + Credentials) |
| UI | shadcn/ui + Tailwind CSS 4 |
| 地图 | 高德地图 JS API 2.0（代理安全模式） |
| 数据获取 | SWR |
| 校验 | Zod |
| 部署 | Docker（多阶段构建） |

## 功能

- 交互式地图，每个商家标记使用自定义颜色
- 标签筛选（菜系类型、是否吃过等）
- 管理后台，支持商家和标签的完整增删改查
- 基于高德 POI 的搜索和点击地图选点
- 安全的高德 API 集成，通过服务端代理，密钥不暴露给客户端
- 基于 JWT 的认证，支持角色权限控制

## 快速开始

### Docker（推荐）

```bash
# 1. 克隆仓库
git clone <repo-url> && cd map-collection-next

# 2. 创建环境配置
cp .env.example .env
# 填入高德 API Key 和 NEXTAUTH_SECRET

# 3. 启动服务
docker compose up -d --build

# 4. 导入数据（可选）
docker compose exec app npx tsx scripts/import-mysql.ts
```

访问 http://localhost:3000

### 本地开发

```bash
# 前置条件：Node.js 20+、PostgreSQL 16+

# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env

# 3. 初始化数据库
npx prisma migrate dev
npm run db:seed

# 4. 启动开发服务器
npm run dev
```

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | 是 |
| `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | 数据库连接参数（Prisma adapter 使用） | 是 |
| `NEXTAUTH_URL` | 应用地址（如 `http://localhost:3000`） | 是 |
| `NEXTAUTH_SECRET` | JWT 签名密钥（`openssl rand -base64 32`） | 是 |
| `AMAP_JS_API_KEY` | 高德 JS API Key（Web端） | 是 |
| `AMAP_SERVER_API_KEY` | 高德 Web 服务 Key（Web服务） | 是 |
| `AMAP_SECURITY_KEY` | 高德安全密钥（jscode） | 是 |

## 高德 Key 配置

在 [高德开放平台](https://lbs.amap.com/) 申请以下密钥：

1. **JS API Key**（Web端）—— 前端地图 SDK 使用
2. **Server API Key**（Web服务）—— 后端地理编码 / POI 搜索使用
3. **安全密钥**（jscode）—— 绑定 JS API Key，通过服务端代理使用

安全密钥不会暴露给客户端。所有安全请求通过 `/_AMapService` 服务端代理转发。

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 公开地图页
│   ├── login/                # 登录页
│   ├── admin/                # 管理后台（需认证）
│   │   ├── page.tsx          # 商家管理
│   │   └── tags/page.tsx     # 标签管理
│   └── api/
│       ├── auth/             # NextAuth 路由
│       ├── businesses/       # 商家 CRUD API
│       ├── tags/             # 标签 CRUD API
│       └── amap/
│           ├── config/       # JS API Key 配置
│           ├── search/       # POI 搜索代理
│           ├── geocode/      # 逆地理编码代理
│           └── service/      # 高德 JS SDK 安全代理
├── components/
│   ├── map/                  # 地图组件（容器、选点、搜索）
│   ├── business/             # 商家卡片、表单、表格
│   ├── tag/                  # 标签徽章、筛选、表单
│   └── layout/               # 头部导航、侧边栏
├── lib/
│   ├── prisma.ts             # Prisma 客户端单例
│   ├── auth.ts               # NextAuth 配置
│   ├── amap.ts               # 高德服务端 API 客户端
│   └── validations/          # Zod 校验 Schema
├── types/                    # TypeScript 类型定义
└── middleware.ts             # 路由鉴权中间件
```

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

**首次登录后请立即修改密码。**

## 许可

MIT
