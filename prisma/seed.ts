import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    },
  });

  await prisma.library.upsert({
    where: { userId_name: { userId: user.id, name: "مكتبة الملك فهد" } },
    update: {},
    create: { name: "مكتبة الملك فهد", address: "الرياض", userId: user.id },
  });

  await prisma.library.upsert({
    where: { userId_name: { userId: user.id, name: "مكتبة الملك عبدالعزيز" } },
    update: {},
    create: { name: "مكتبة الملك عبدالعزيز", address: "الدمام", userId: user.id },
  });

  console.log("تم إضافة بيانات تجريبية بنجاح");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });