import { getAdminByUsername, getAdminByEmail, verifyPassword, createAdmin, getAllAdmins } from './admin-users'

export const SESSION_TOKEN = 'cv-admin-sess-2026-authenticated'
export const COOKIE_NAME   = 'admin_session'

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME ?? 'Admin'
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Zxcvbnm@2026'
const DEFAULT_EMAIL    = process.env.ADMIN_EMAIL    ?? 'admin@cellaviva.com'

async function ensureDefaultAdmin() {
  const all = await getAllAdmins()
  if (all.length === 0) {
    await createAdmin(DEFAULT_USERNAME, DEFAULT_EMAIL, DEFAULT_PASSWORD, 'super_admin')
  }
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  await ensureDefaultAdmin()
  const user = await getAdminByUsername(username)
  if (!user) return false
  return verifyPassword(password, user.passwordHash)
}

export async function validateCredentialsByEmail(email: string, password: string): Promise<boolean> {
  await ensureDefaultAdmin()
  const user = await getAdminByEmail(email)
  if (!user) return false
  return verifyPassword(password, user.passwordHash)
}
