import { NextRequest, NextResponse } from 'next/server'
import { getAllAdmins, deleteAdmin, updateAdminPermissions, updateAdminPassword } from '@/lib/admin-users'
import { getAdminUser } from '@/lib/permissions'

async function requireSuperAdmin() {
  const u = await getAdminUser()
  return u?.role === 'super_admin' ? u : null
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  if (body.permissions !== undefined) {
    await updateAdminPermissions(id, body.permissions)
  }
  if (body.password) {
    if (body.password.length < 8) return NextResponse.json({ error: 'Password too short' }, { status: 400 })
    await updateAdminPassword(id, body.password)
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (id === me.id) return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })

  const all = await getAllAdmins()
  const target = all.find(u => u.id === id)
  if (target?.role === 'super_admin' && all.filter(u => u.role === 'super_admin').length <= 1) {
    return NextResponse.json({ error: 'Cannot delete the only super admin' }, { status: 400 })
  }

  await deleteAdmin(id)
  return NextResponse.json({ ok: true })
}
