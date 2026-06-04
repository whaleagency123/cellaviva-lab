import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/lib/verification'
import { getAllAdmins, updateAdminPassword } from '@/lib/admin-users'

export async function POST(request: NextRequest) {
  const { token, code, newPassword } = await request.json()

  if (!token || !code || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const entry = await verifyCode(token, code)
  if (!entry) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  const admins = await getAllAdmins()
  const user = admins.find(u => u.email.toLowerCase() === entry.email.toLowerCase())
  if (!user) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
  }

  await updateAdminPassword(user.id, newPassword)
  return NextResponse.json({ ok: true })
}
