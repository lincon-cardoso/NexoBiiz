import { PrismaClient } from "@prisma/client";

// Singleton pattern para evitar múltiplas instâncias no serverless
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

export const prisma: PrismaClient = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
