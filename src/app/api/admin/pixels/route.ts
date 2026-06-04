import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminSession } from '@/lib/permissions'

const PIXEL_KEYS = ['meta_pixel_id', 'gtm_id', 'tiktok_pixel_id', 'pinterest_tag_id', 'snapchat_pixel_id'] as const

export async function GET() {
  if (!await isAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.storeSettings.findMany({
    where: { key: { in: [...PIXEL_KEYS] } },
  })

  const result: Record<string, string> = {}
  for (const row of rows) result[row.key] = row.value

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  if (!await isAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { key, value } = await req.json()

  if (!PIXEL_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
  }

  if (value && value.trim()) {
    await prisma.storeSettings.upsert({
      where:  { key },
      create: { key, value: value.trim() },
      update: { value: value.trim() },
    })
  } else {
    // Empty value = remove pixel
    await prisma.storeSettings.deleteMany({ where: { key } })
  }

  return NextResponse.json({ ok: true })
}
