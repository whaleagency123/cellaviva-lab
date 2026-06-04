import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { THEME_DEFAULTS } from '@/lib/storefront-theme-shared'

const SF_KEYS = Object.keys(THEME_DEFAULTS)

export async function GET() {
  try {
    const rows = await prisma.storeSettings.findMany({
      where: { key: { in: SF_KEYS } },
    })
    const map: Record<string, string> = {}
    for (const r of rows) map[r.key] = r.value
    return NextResponse.json(map)
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Record<string, string> = await req.json()
    const filtered = Object.fromEntries(
      Object.entries(body).filter(([k]) => SF_KEYS.includes(k))
    )
    const upserts = Object.entries(filtered).map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
    await Promise.all(upserts)
    return NextResponse.json({ success: true })
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
