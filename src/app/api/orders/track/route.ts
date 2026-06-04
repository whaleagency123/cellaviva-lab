import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'order-track', { limit: 10, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const { orderId, email } = await req.json()

    if (!orderId || !email || typeof orderId !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Order ID and email are required' }, { status: 400 })
    }

    // Limit input lengths to prevent abuse
    if (orderId.length > 100 || email.length > 200) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedId    = orderId.trim()

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: normalizedId },
          { stripePaymentId: normalizedId },
        ],
        customerEmail: { equals: normalizedEmail, mode: 'insensitive' },
      },
      include: {
        lineItems: {
          include: { product: { select: { id: true, title: true } } },
        },
      },
    })

    if (!order) {
      // Generic message — don't reveal whether the order or email exists
      return NextResponse.json(
        { error: 'Order not found. Please check your order ID and email.' },
        { status: 404 },
      )
    }

    // Return only the minimum info needed to track status — no full shipping address
    return NextResponse.json({
      id:            order.id,
      status:        order.status,
      paymentStatus: order.paymentStatus,
      total:         order.total,
      createdAt:     order.createdAt,
      // Partial shipping address — city/country only, not full street
      shippingCity:    (order.shippingAddress as Record<string, unknown>)?.city ?? null,
      shippingCountry: (order.shippingAddress as Record<string, unknown>)?.country ?? null,
      lineItems: order.lineItems.map((item) => ({
        quantity: item.quantity,
        price:    item.price,
        title:    item.product?.title ?? 'Product',
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
