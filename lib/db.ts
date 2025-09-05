import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "next_crud"
});