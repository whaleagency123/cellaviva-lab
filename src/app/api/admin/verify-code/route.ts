import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/lib/verification'
import { createAdmin } from '@/lib/admin-users'

export async function POST(request: NextRequest) {
  const { token, code, password } = await request.json()

  if (!token || !code) {
    return NextResponse.json({ error: 'Missing token or code' }, { status: 400 })
  }

  const entry = await verifyCode(token, code)
  if (!entry) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  if (password) {
    await createAdmin(entry.username, entry.email, password, 'admin')
  }

  return NextResponse.json({ ok: true, email: entry.email, username: entry.username })
}
