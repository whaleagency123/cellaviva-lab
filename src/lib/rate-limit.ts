import { prisma } from './prisma'
import { NextRequest } from 'next/server'

interface RateLimitOptions {
  limit: number     // max requests
  windowMs: number  // time window in ms
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function rateLimit(
  req: NextRequest,
  route: string,
  opts: RateLimitOptions,
): Promise<{ ok: boolean; retryAfter?: number }> {
  const ip = getIp(req)
  const key = `${route}:${ip}`
  const now = new Date()

  try {
    const existing = await prisma.rateLimit.findUnique({ where: { key } })

    if (existing && now < existing.resetAt) {
      if (existing.count >= opts.limit) {
        const retryAfter = Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000)
        return { ok: false, retryAfter }
      }
      await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } })
    } else {
      const resetAt = new Date(now.getTime() + opts.windowMs)
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      })
    }
  } catch {
    // If rate-limit DB call fails, allow the request through
    return { ok: true }
  }

  return { ok: true }
}
