import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import pg from "pg";

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
  // 创建默认管理员（密码随机生成）
  const adminPassword = "admin123"; // 生产环境应使用随机密码
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created: ${admin.username}`);

  // 创建默认标签
  const tags = [
    { name: "餐饮", color: "#ff6b6b" },
    { name: "购物", color: "#51cf66" },
    { name: "娱乐", color: "#339af0" },
    { name: "景点", color: "#ff922b" },
    { name: "住宿", color: "#845ef7" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  console.log("Default tags created");

  // 创建示例商家
  const businesses = [
    {
      name: "西安钟楼",
      address: "西安市碑林区东大街与南大街交汇处",
      latitude: 34.261433,
      longitude: 108.946465,
      description: "西安标志性建筑，明代古建筑",
    },
    {
      name: "大雁塔",
      address: "西安市雁塔区大雁塔南广场",
      latitude: 34.21955,
      longitude: 108.964466,
      description: "唐代古塔，佛教文化圣地",
    },
    {
      name: "回民街",
      address: "西安市莲湖区北院门",
      latitude: 34.264355,
      longitude: 108.940299,
      description: "西安著名美食街，回族文化聚集地",
    },
  ];

  for (const b of businesses) {
    const existing = await prisma.business.findFirst({
      where: { name: b.name },
    });
    if (!existing) {
      await prisma.business.create({ data: b });
    }
  }

  console.log("Sample businesses created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
