import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendCustomerPasswordResetEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalised = email.trim().toLowerCase()

    // Rate-limit by IP — max 3 requests per 15 min
    const limited = await rateLimit(req, 'pwd-reset', { limit: 3, windowMs: 15 * 60 * 1000 })
    if (!limited.ok) {
      return NextResponse.json({ error: 'Too many requests. Please wait before trying again.' }, { status: 429 })
    }

    // Always respond 200 even if email not found (prevent user enumeration)
    const customer = await prisma.customer.findUnique({ where: { email: normalised } })
    if (!customer) {
      return NextResponse.json({ ok: true })
    }

    // Generate a secure token valid for 1 hour
    const token     = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.verificationCode.upsert({
      where:  { token },
      create: { token, code: 'RESET', email: normalised, username: customer.name ?? normalised, expiresAt },
      update: { code: 'RESET', email: normalised, username: customer.name ?? normalised, expiresAt },
    })

    const baseUrl  = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`
    await sendCustomerPasswordResetEmail(normalised, resetUrl)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[forgot-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
