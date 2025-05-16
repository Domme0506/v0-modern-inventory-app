import { PrismaClient } from "@prisma/client"

// PrismaClient ist an das globale Objekt angehängt, um zu verhindern,
// dass zu viele Instanzen im Entwicklungsmodus erstellt werden
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
