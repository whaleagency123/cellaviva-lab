import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import type { StoreSettings } from '@/types'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE  = 'cv-admin-sess-2026-authenticated'

async function isAdmin() {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

export async function GET() {
  // Public endpoint — storefront components read settings without auth
  try {
    const rows = await prisma.storeSettings.findMany()
    const map: Record<string, string> = {}
    for (const r of rows) map[r.key] = r.value
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const settings: Partial<StoreSettings> = await req.json()

    // Use Promise.all instead of $transaction — pgBouncer transaction mode
    // does not support Prisma interactive transactions
    const upserts = Object.entries(settings).map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        create: { key, value: typeof value === 'string' ? value : JSON.stringify(value) },
        update: { value: typeof value === 'string' ? value : JSON.stringify(value) },
      })
    )

    await Promise.all(upserts)
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
