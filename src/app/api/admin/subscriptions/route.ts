import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'cv-admin-sess-2026-authenticated'
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = req.nextUrl
    const action = searchParams.get('action')
    const status = searchParams.get('status')

    // Sync: count active subscriptions from DB (Stripe sync would go here)
    if (action === 'sync') {
      const count = await prisma.subscription.count()
      return NextResponse.json({ synced: count, message: 'Subscriptions synced from database' })
    }

    const subs = await prisma.subscription.findMany({
      where:   status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true, image: true } },
        product:  { select: { title: true, slug: true } },
      },
    })

    return NextResponse.json(subs)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, status } = await req.json()
    const updated = await prisma.subscription.update({
      where: { id },
      data:  { status, cancelledAt: status === 'CANCELLED' ? new Date() : undefined },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
