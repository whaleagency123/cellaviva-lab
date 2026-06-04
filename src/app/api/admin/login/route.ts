import { NextRequest, NextResponse } from 'next/server'
import { getAdminByEmail, verifyPassword, getAllAdmins, createAdmin } from '@/lib/admin-users'
import { SESSION_TOKEN, COOKIE_NAME } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const USER_ID_COOKIE = 'admin_user_id'

const DEFAULT_EMAIL    = process.env.ADMIN_EMAIL    ?? 'admin@cellaviva.com'
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Zxcvbnm@2026'
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME ?? 'Admin'

export async function POST(request: NextRequest) {
  const rl = await rateLimit(request, 'admin-login', { limit: 10, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }
  const { email, password } = await request.json()

  // Seed default super_admin if no admins exist
  const all = await getAllAdmins()
  if (all.length === 0) {
    await createAdmin(DEFAULT_USERNAME, DEFAULT_EMAIL, DEFAULT_PASSWORD, 'super_admin', [])
  }

  const user = await getAdminByEmail(email)
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const COOKIE_OPTS = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, SESSION_TOKEN, COOKIE_OPTS)
  response.cookies.set(USER_ID_COOKIE, user.id, COOKIE_OPTS)
  return response
}
