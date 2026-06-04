import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { generateCode, storeCode } from '@/lib/verification'
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email'
import { getAllAdmins } from '@/lib/admin-users'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rl = await rateLimit(request, 'send-code', { limit: 5, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  const { email, username, purpose } = await request.json()

  if (!email || !username || !purpose) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // For reset: the user must exist
  if (purpose === 'reset') {
    const admins = await getAllAdmins()
    const user = admins.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: 'No admin found with that email' }, { status: 404 })
    }
  }

  // For invite: email must not already be taken
  if (purpose === 'invite') {
    const admins = await getAllAdmins()
    if (admins.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 409 })
    }
    if (admins.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
    }
  }

  const code = generateCode()
  const token = randomBytes(16).toString('hex')
  await storeCode(token, { code, email, username })

  try {
    if (purpose === 'reset') {
      await sendPasswordResetEmail(email, code, username)
    } else {
      await sendVerificationEmail(email, code, username)
    }
  } catch {
    // Still return token in dev so flow can continue
    if (!process.env.SMTP_HOST) {
      return NextResponse.json({ token })
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ token })
}
