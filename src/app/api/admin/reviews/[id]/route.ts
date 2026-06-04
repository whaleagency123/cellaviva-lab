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
    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(body.approved !== undefined && { approved: body.approved }),
        ...(body.verified !== undefined && { verified: body.verified }),
      },
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    void err
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
    await prisma.review.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
