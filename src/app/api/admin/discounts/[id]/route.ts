import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE = 'cv-admin-sess-2026-authenticated'

async function isAdmin() {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const body = await req.json()
    const updated = await prisma.discountCode.update({
      where: { id },
      data: {
        ...(body.code !== undefined && { code: body.code.toUpperCase().trim() }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.value !== undefined && { value: Number(body.value) }),
        ...(body.minOrder !== undefined && { minOrder: body.minOrder ? Number(body.minOrder) : null }),
        ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit ? Number(body.usageLimit) : null }),
        ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await prisma.discountCode.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
