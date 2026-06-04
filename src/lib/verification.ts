import { randomInt } from 'crypto'
import { prisma } from './prisma'

export function generateCode(): string {
  return String(randomInt(100000, 999999))
}

export async function storeCode(token: string, data: { code: string; email: string; username: string }) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min
  await prisma.verificationCode.upsert({
    where: { token },
    create: { token, ...data, expiresAt },
    update: { ...data, expiresAt },
  })
}

export async function verifyCode(
  token: string,
  code: string,
): Promise<{ email: string; username: string } | null> {
  const entry = await prisma.verificationCode.findUnique({ where: { token } })
  if (!entry) return null
  if (new Date() > entry.expiresAt) {
    await prisma.verificationCode.delete({ where: { token } }).catch(() => {})
    return null
  }
  if (entry.code !== code) return null
  await prisma.verificationCode.delete({ where: { token } }).catch(() => {})
  return { email: entry.email, username: entry.username }
}

export async function getCodeEntry(token: string): Promise<{ email: string; username: string } | null> {
  const entry = await prisma.verificationCode.findUnique({ where: { token } })
  if (!entry || new Date() > entry.expiresAt) return null
  return { email: entry.email, username: entry.username }
}
