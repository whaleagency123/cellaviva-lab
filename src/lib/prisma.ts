import 'server-only'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function buildClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.')
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter } as any)
}

// Global singleton — one connection for the entire server lifetime
export const prisma: PrismaClient =
  global.__prisma ?? (global.__prisma = buildClient())
