import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE  = 'cv-admin-sess-2026-authenticated'

async function isAdmin() {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

function deriveStatus(lastOrderDate: string): 'ACTIVE' | 'NEW' | 'AT_RISK' | 'CHURNED' {
  const days = (Date.now() - new Date(lastOrderDate).getTime()) / 86_400_000
  if (days < 30) return 'ACTIVE'
  if (days < 90) return 'AT_RISK'
  return 'CHURNED'
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    // Merge: registered customers + customers derived from orders
    const [registeredCustomers, orders] = await Promise.all([
      prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        include: { subscriptions: { select: { id: true, status: true, pricePerCycle: true } } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, customerName: true, customerEmail: true,
          customerPhone: true, total: true, status: true, createdAt: true,
        },
      }),
    ])

    // Build order stats per email
    const orderStats = new Map<string, {
      totalOrders: number; totalSpent: number
      firstOrder: string; lastOrder: string
      orders: { id: string; date: string; total: number; status: string }[]
    }>()
    for (const o of orders) {
      const key = o.customerEmail.toLowerCase()
      const d   = o.createdAt.toISOString().slice(0, 10)
      if (!orderStats.has(key)) {
        orderStats.set(key, { totalOrders: 0, totalSpent: 0, firstOrder: d, lastOrder: d, orders: [] })
      }
      const s = orderStats.get(key)!
      s.totalOrders++; s.totalSpent += o.total
      if (d < s.firstOrder) s.firstOrder = d
      if (d > s.lastOrder)  s.lastOrder  = d
      s.orders.push({ id: o.id, date: d, total: o.total, status: o.status })
    }

    // Build unified customer list
    const seen = new Set<string>()
    const result: object[] = []

    for (const c of registeredCustomers) {
      seen.add(c.email.toLowerCase())
      const stats = orderStats.get(c.email.toLowerCase())
      result.push({
        id:               c.id,
        name:             c.name ?? c.email.split('@')[0],
        email:            c.email,
        phone:            c.phone ?? '',
        avatarUrl:        c.image ?? null,
        image:            c.image,
        provider:         c.provider ?? 'email',
        joinedAt:         c.createdAt.toISOString().slice(0, 10),
        location:         '',
        country:          '',
        tags:             [],
        notes:            '',
        emailSubscribed:  false,
        smsSubscribed:    false,
        totalOrders:      stats?.totalOrders ?? 0,
        totalSpent:       stats?.totalSpent  ?? 0,
        avgOrderValue:    stats && stats.totalOrders > 0 ? Math.round(stats.totalSpent / stats.totalOrders * 100) / 100 : 0,
        ltv:              stats?.totalSpent ?? 0,
        lastOrder:        stats?.lastOrder  ?? null,
        firstOrder:       stats?.firstOrder ?? null,
        orders:           (stats?.orders ?? []).map(o => ({ ...o, items: [] })),
        subscriptions:    c.subscriptions.length,
        activeSubCount:   c.subscriptions.filter(s => s.status === 'ACTIVE').length,
        status:           stats ? deriveStatus(stats.lastOrder) : 'NEW',
      })
    }

    // Add order-only customers (not registered via OAuth)
    for (const [email, stats] of orderStats) {
      if (seen.has(email)) continue
      const firstOrder = orders.find(o => o.customerEmail.toLowerCase() === email)
      result.push({
        id:               email,
        name:             firstOrder?.customerName ?? email.split('@')[0],
        email,
        phone:            firstOrder?.customerPhone ?? '',
        avatarUrl:        null,
        image:            null,
        provider:         'guest',
        joinedAt:         stats.firstOrder,
        location:         '',
        country:          '',
        tags:             [],
        notes:            '',
        emailSubscribed:  false,
        smsSubscribed:    false,
        totalOrders:      stats.totalOrders,
        totalSpent:       stats.totalSpent,
        avgOrderValue:    Math.round(stats.totalSpent / stats.totalOrders * 100) / 100,
        ltv:              stats.totalSpent,
        lastOrder:        stats.lastOrder,
        firstOrder:       stats.firstOrder,
        orders:           stats.orders.map(o => ({ ...o, items: [] })),
        subscriptions:    0,
        activeSubCount:   0,
        status:           deriveStatus(stats.lastOrder),
      })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
