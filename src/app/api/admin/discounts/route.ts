import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE = 'cv-admin-sess-2026-authenticated'

async function isAdmin() {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const discounts = await prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(discounts)
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { code, type, value, minOrder, usageLimit, expiresAt, active } = body

    if (!code || !type || value == null) {
      return NextResponse.json({ error: 'code, type, and value are required' }, { status: 400 })
    }
    if (!['PERCENTAGE', 'FIXED'].includes(type)) {
      return NextResponse.json({ error: 'type must be PERCENTAGE or FIXED' }, { status: 400 })
    }

    const discount = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        value: Number(value),
        minOrder: minOrder ? Number(minOrder) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: active !== false,
      },
    })
    return NextResponse.json(discount, { status: 201 })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A discount code with this name already exists' }, { status: 409 })
    }
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
