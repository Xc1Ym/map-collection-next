/**
 * MySQL → PostgreSQL 数据迁移脚本
 *
 * 用法：
 *   1. 确保 PostgreSQL 已运行并执行过 prisma migrate
 *   2. npm install mysql2
 *   3. 配置下方 MySQL 和 PG 连接信息
 *   4. npx tsx scripts/migrate-mysql-to-pg.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// PostgreSQL 连接
const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  database: "map_collection",
  user: "postgres",
  password: "password",
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("开始数据迁移...\n");

  // 注意：此脚本需要安装 mysql2 并手动配置连接
  // 此处使用 Prisma 直接查询作为示例
  // 实际使用时请替换为 mysql2 连接

  console.log("请确保：");
  console.log("1. PostgreSQL 已创建 schema（prisma migrate deploy）");
  console.log("2. MySQL 数据可访问");
  console.log("3. 已安装 mysql2: npm install mysql2");
  console.log("\n迁移步骤：");
  console.log("1. 从 MySQL 导出 users, tags, businesses, business_tags");
  console.log("2. 转换 role 字段：admin→ADMIN, user→USER");
  console.log("3. 使用 prisma.createMany 批量写入 PostgreSQL");
  console.log("4. 重置自增序列\n");

  // 验证 PG 连接
  const userCount = await prisma.user.count();
  const tagCount = await prisma.tag.count();
  const bizCount = await prisma.business.count();
  const btCount = await prisma.businessTag.count();

  console.log("当前 PostgreSQL 数据：");
  console.log(`  Users: ${userCount}`);
  console.log(`  Tags: ${tagCount}`);
  console.log(`  Businesses: ${bizCount}`);
  console.log(`  BusinessTags: ${btCount}`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
