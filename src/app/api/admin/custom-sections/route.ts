import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import type { CustomSection } from '@/types'

async function isAdmin() {
  const jar = await cookies()
  return !!(jar.get('admin_session')?.value)
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const row = await prisma.storeSettings.findUnique({ where: { key: 'customSections' } })
  if (!row) return NextResponse.json([])
  try { return NextResponse.json(JSON.parse(row.value)) }
  catch { return NextResponse.json([]) }
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sections: CustomSection[] = await req.json()
  await prisma.storeSettings.upsert({
    where: { key: 'customSections' },
    update: { value: JSON.stringify(sections) },
    create: { key: 'customSections', value: JSON.stringify(sections) },
  })
  return NextResponse.json({ ok: true })
}
