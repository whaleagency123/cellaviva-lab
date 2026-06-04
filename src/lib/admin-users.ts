import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { prisma } from './prisma'

const scryptAsync = promisify(scrypt)

export interface AdminUser {
  id: string
  username: string
  email: string
  passwordHash: string
  role: string
  permissions: string  // JSON array of permission keys
  createdAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${hash.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuffer = Buffer.from(hash, 'hex')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return timingSafeEqual(hashBuffer, derived)
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  return prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } })
}

export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  return prisma.adminUser.findFirst({
    where: { username: { equals: username, mode: 'insensitive' } },
  })
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  return prisma.adminUser.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  })
}

export async function createAdmin(
  username: string,
  email: string,
  password: string,
  role = 'admin',
  permissions: string[] = [],
): Promise<AdminUser> {
  const passwordHash = await hashPassword(password)
  return prisma.adminUser.create({
    data: { username, email, passwordHash, role, permissions: JSON.stringify(permissions) },
  })
}

export async function updateAdminPermissions(id: string, permissions: string[]): Promise<void> {
  await prisma.adminUser.update({ where: { id }, data: { permissions: JSON.stringify(permissions) } })
}

export async function updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword)
  await prisma.adminUser.update({ where: { id }, data: { passwordHash } })
  return true
}

export async function deleteAdmin(id: string): Promise<boolean> {
  await prisma.adminUser.delete({ where: { id } }).catch(() => {})
  return true
}
