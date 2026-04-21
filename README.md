# Map Collection / 美食收藏地图

一个基于高德地图的美食收藏管理系统，用于记录和展示收藏的餐厅、美食店铺。

A food collection management system built with AMap (Gaode Maps) for bookmarking and displaying favorite restaurants and food spots.

## Tech Stack / 技术栈

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Database | PostgreSQL 16 + Prisma 7 |
| Auth | NextAuth.js v4 (JWT + Credentials) |
| UI | shadcn/ui + Tailwind CSS 4 |
| Map | AMap JS API 2.0 (Proxy Security Mode) |
| Data Fetching | SWR |
| Validation | Zod |
| Deploy | Docker (multi-stage build) |

## Features / 功能

- Interactive map with custom colored markers for each business
- Tag-based filtering (cuisine type, visited status, etc.)
- Admin dashboard with full CRUD for businesses and tags
- POI search powered by AMap with click-to-pick location
- Secure AMap API integration via server-side proxy (no key exposure to client)
- JWT-based authentication with role-based access control

## Quick Start / 快速开始

### Docker (Recommended / 推荐)

```bash
# 1. Clone the repo
git clone <repo-url> && cd map-collection-next

# 2. Create .env from example
cp .env.example .env
# Fill in your AMap API keys and NEXTAUTH_SECRET

# 3. Start services
docker compose up -d --build

# 4. Import data (optional)
docker compose exec app npx tsx scripts/import-mysql.ts
```

Visit http://localhost:3000

### Local Development / 本地开发

```bash
# Prerequisites: Node.js 20+, PostgreSQL 16+

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Setup database
npx prisma migrate dev
npm run db:seed

# 4. Start dev server
npm run dev
```

## Environment Variables / 环境变量

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `DB_HOST` / `DB_PORT` / `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | Database connection (used by Prisma adapter) | Yes |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) | Yes |
| `NEXTAUTH_SECRET` | JWT signing secret (`openssl rand -base64 32`) | Yes |
| `AMAP_JS_API_KEY` | AMap JS API key (Web端) | Yes |
| `AMAP_SERVER_API_KEY` | AMap Web Service key (Web服务) | Yes |
| `AMAP_SECURITY_KEY` | AMap security key (jscode) | Yes |

## AMap API Key Setup / 高德 Key 配置

You need two API keys from [AMap Open Platform](https://lbs.amap.com/):

1. **JS API Key** (Web端) - Used by the frontend map SDK
2. **Server API Key** (Web服务) - Used by the backend for geocoding/POI search
3. **Security Key** (安全密钥) - Bound to the JS API key, used server-side via proxy

The security key is never exposed to the client. All secure requests are proxied through `/_AMapService` on the server.

## Project Structure / 项目结构

```
src/
├── app/
│   ├── page.tsx              # Public map page
│   ├── login/                # Login page
│   ├── admin/                # Admin dashboard (auth required)
│   │   ├── page.tsx          # Business management
│   │   └── tags/page.tsx     # Tag management
│   └── api/
│       ├── auth/             # NextAuth routes
│       ├── businesses/       # Business CRUD API
│       ├── tags/             # Tag CRUD API
│       └── amap/
│           ├── config/       # JS API key config
│           ├── search/       # POI search proxy
│           ├── geocode/      # Reverse geocoding proxy
│           └── service/      # AMap JS SDK security proxy
├── components/
│   ├── map/                  # AMap components (container, picker, search)
│   ├── business/             # Business cards, forms, table
│   ├── tag/                  # Tag badges, filters, forms
│   └── layout/               # Header, sidebar
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── auth.ts               # NextAuth configuration
│   ├── amap.ts               # AMap server-side API client
│   └── validations/          # Zod schemas
├── types/                    # TypeScript type definitions
└── middleware.ts             # Route protection
```

## Default Credentials / 默认账号

- Username: `admin`
- Password: `admin123`

**Please change the password after first login.**

## License / 许可

MIT
