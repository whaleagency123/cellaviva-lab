import 'server-only'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { PERMISSION_KEYS } from './permissions-shared'

export type { Permission } from './permissions-shared'
export { PERMISSION_KEYS, PERMISSION_LABELS } from './permissions-shared'
import type { Permission } from './permissions-shared'

export interface AdminUserWithPerms {
  id: string
  username: string
  email: string
  role: string
  permissions: Permission[]
}

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE  = 'cv-admin-sess-2026-authenticated'
const USER_ID_COOKIE = 'admin_user_id'

export async function getAdminUser(): Promise<AdminUserWithPerms | null> {
  try {
    const jar     = await cookies()
    const session = jar.get(SESSION_COOKIE)?.value
    if (session !== SESSION_VALUE) return null

    const userId = jar.get(USER_ID_COOKIE)?.value

    if (!userId) {
      const su = await prisma.adminUser.findFirst({ where: { role: 'super_admin' } })
      if (!su) return null
      return { id: su.id, username: su.username, email: su.email, role: su.role, permissions: [...PERMISSION_KEYS] }
    }

    const user = await prisma.adminUser.findUnique({ where: { id: userId } })
    if (!user) return null

    const permissions: Permission[] =
      user.role === 'super_admin'
        ? [...PERMISSION_KEYS]
        : (() => { try { return JSON.parse(user.permissions) as Permission[] } catch { return [] } })()

    return { id: user.id, username: user.username, email: user.email, role: user.role, permissions }
  } catch {
    return null
  }
}

export async function hasPermission(perm: Permission): Promise<boolean> {
  const user = await getAdminUser()
  if (!user) return false
  if (user.role === 'super_admin') return true
  return user.permissions.includes(perm)
}

export async function isAdminSession(): Promise<boolean> {
  try {
    const jar = await cookies()
    return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
  } catch {
    return false
  }
}
