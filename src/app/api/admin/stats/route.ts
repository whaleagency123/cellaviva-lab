import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'cv-admin-sess-2026-authenticated'
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const now = new Date()
    const start30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [allOrders, recentOrders, products] = await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum:   { total: true },
        _count: { id: true },
      }),
      prisma.order.findMany({
        where:   { createdAt: { gte: start30 } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, customerName: true, total: true,
          status: true, createdAt: true,
        },
      }),
      prisma.product.findMany({
        where:  { active: true },
        select: { id: true, title: true, stock: true },
        orderBy: { stock: 'asc' },
        take: 5,
      }),
    ])

    return NextResponse.json({
      totalRevenue: allOrders._sum.total ?? 0,
      totalOrders:  allOrders._count.id  ?? 0,
      recentOrders: recentOrders.map(o => ({
        id:         o.id,
        customer:   o.customerName,
        date:       o.createdAt.toISOString(),
        status:     o.status,
        total:      o.total,
      })),
      lowStock: products.map(p => ({
        name:      p.title,
        stock:     p.stock,
        threshold: 50,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
