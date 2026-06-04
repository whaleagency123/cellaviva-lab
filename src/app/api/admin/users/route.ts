import { NextRequest, NextResponse } from 'next/server'
import { getAllAdmins, createAdmin } from '@/lib/admin-users'
import { getAdminUser } from '@/lib/permissions'

async function requireSuperAdmin() {
  const u = await getAdminUser()
  return u?.role === 'super_admin' ? u : null
}

export async function GET() {
  if (!(await requireSuperAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const all = await getAllAdmins()
  return NextResponse.json(all.map(({ passwordHash: _, ...u }) => u))
}

export async function POST(req: NextRequest) {
  const me = await requireSuperAdmin()
  if (!me) return NextResponse.json({ error: 'Unauthorized — please log out and log back in' }, { status: 401 })

  const { username, email, password, role, permissions } = await req.json()

  if (!username?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'Username, email and password are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  // Check for existing username/email before attempting create
  const all = await getAllAdmins()
  if (all.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
    return NextResponse.json({ error: `Username "${username}" is already taken` }, { status: 409 })
  }
  if (all.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return NextResponse.json({ error: `Email "${email}" is already registered` }, { status: 409 })
  }

  try {
    const user = await createAdmin(
      username.trim(),
      email.trim().toLowerCase(),
      password,
      role ?? 'admin',
      Array.isArray(permissions) ? permissions : [],
    )
    const { passwordHash: _, ...safe } = user
    return NextResponse.json(safe, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Failed to create user: ${message}` }, { status: 500 })
  }
}
