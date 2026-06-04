import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE  = 'cv-admin-sess-2026-authenticated'

async function isAdmin() {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const row = await prisma.storeSettings.findUnique({ where: { key: 'elementOverrides' } })
    return NextResponse.json({ overrides: row?.value ?? '{}' })
  } catch {
    return NextResponse.json({ overrides: '{}' })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { overrides } = await req.json()
    await prisma.storeSettings.upsert({
      where:  { key: 'elementOverrides' },
      create: { key: 'elementOverrides', value: overrides },
      update: { value: overrides },
    })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
