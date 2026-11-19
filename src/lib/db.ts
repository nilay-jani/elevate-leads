import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getDatabaseUrl(): string {
  const cwd = process.cwd();
  const prismaDb = path.join(cwd, "prisma", "dev.db");
  const rootDb = path.join(cwd, "dev.db");

  if (fs.existsSync(prismaDb) && fs.statSync(prismaDb).size > 0) {
    return `file:${prismaDb}`;
  }
  if (fs.existsSync(rootDb) && fs.statSync(rootDb).size > 0) {
    return `file:${rootDb}`;
  }
  return `file:${prismaDb}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  initialized: boolean | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export async function ensureDatabaseTables() {
  if (globalForPrisma.initialized) return;
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Hospital" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "nameNormalized" TEXT NOT NULL,
        "bedCount" INTEGER,
        "bedCapacityStatus" TEXT NOT NULL DEFAULT 'CONFIRMED',
        "bedEvidence" TEXT,
        "category" TEXT NOT NULL DEFAULT 'Independent Nursing Home',
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "country" TEXT NOT NULL DEFAULT 'India',
        "address" TEXT NOT NULL,
        "pincode" TEXT,
        "phone" TEXT,
        "phoneNormalized" TEXT,
        "website" TEXT,
        "domain" TEXT,
        "email" TEXT,
        "emailNormalized" TEXT,
        "emailSourceUrl" TEXT,
        "hospitalSourceUrl" TEXT,
        "emailStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
        "isQualified" BOOLEAN NOT NULL DEFAULT false,
        "websiteOpportunity" TEXT,
        "auditScore" INTEGER NOT NULL DEFAULT 65,
        "discoveryDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "discoveryRunId" TEXT,
        "notes" TEXT,
        "reviewed" BOOLEAN NOT NULL DEFAULT false,
        "contactStatus" TEXT NOT NULL DEFAULT 'NEW',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GeoConfig" (
        "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
        "targetCountry" TEXT NOT NULL DEFAULT 'India',
        "dailyTarget" INTEGER NOT NULL DEFAULT 30,
        "maxBeds" INTEGER NOT NULL DEFAULT 25,
        "minBeds" INTEGER NOT NULL DEFAULT 5,
        "activeCitiesJson" TEXT NOT NULL,
        "currentCityIndex" INTEGER NOT NULL DEFAULT 0,
        "searchRadiusKm" INTEGER NOT NULL DEFAULT 25,
        "autoRotate" BOOLEAN NOT NULL DEFAULT true,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "DiscoveryRun" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "completedAt" DATETIME,
        "cityTarget" TEXT NOT NULL,
        "stateTarget" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'RUNNING',
        "totalFound" INTEGER NOT NULL DEFAULT 0,
        "qualifiedCount" INTEGER NOT NULL DEFAULT 0,
        "verifiedEmailsCount" INTEGER NOT NULL DEFAULT 0,
        "unverifiedEmailsCount" INTEGER NOT NULL DEFAULT 0,
        "missingEmailsCount" INTEGER NOT NULL DEFAULT 0,
        "duplicatesSkipped" INTEGER NOT NULL DEFAULT 0,
        "reportSummary" TEXT,
        "logs" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    globalForPrisma.initialized = true;
  } catch (err) {
    console.warn("Table initialization note:", err);
  }
}
