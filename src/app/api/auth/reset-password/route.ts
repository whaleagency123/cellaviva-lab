import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password || typeof token !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Verify the token exists and hasn't expired
    const entry = await prisma.verificationCode.findUnique({ where: { token } })
    if (!entry || entry.code !== 'RESET' || new Date() > entry.expiresAt) {
      return NextResponse.json({ error: 'Invalid or expired reset link. Please request a new one.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Save hashed password to customer record
    await prisma.customer.update({
      where: { email: entry.email },
      data:  { hashedPassword },
    })

    // Consume the token
    await prisma.verificationCode.delete({ where: { token } }).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
