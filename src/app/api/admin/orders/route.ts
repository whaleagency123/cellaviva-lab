import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'cv-admin-sess-2026-authenticated'
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      customerName, customerEmail, customerPhone,
      address, city, country, postalCode,
      cartItems, shippingAmount, paymentMethod,
      source, notes,
    } = body

    if (!customerName || !customerEmail || !cartItems?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const productIds = cartItems.map((i: any) => i.productId)
    const products   = await prisma.product.findMany({ where: { id: { in: productIds } } })
    const productMap = Object.fromEntries(products.map(p => [p.id, p]))

    let subtotal = 0
    const lineItems = cartItems.map((i: any) => {
      const product = productMap[i.productId]
      if (!product) throw new Error(`Product not found: ${i.productId}`)
      const unitPrice = product.salePrice ?? product.price
      subtotal += unitPrice * i.quantity
      return { productId: i.productId, quantity: i.quantity, price: unitPrice }
    })

    const total = Math.max(0, subtotal + (shippingAmount ?? 0))

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone ?? '',
        shippingAddress: { address, city, country, postalCode },
        lineItems: { create: lineItems },
        status:        'PENDING',
        paymentStatus: 'PENDING',
        stripePaymentId: `ADMIN-${source ?? 'DIRECT'}-${Date.now()}`,
        total,
        source: source ?? 'DIRECT',
        notes:  notes ?? null,
      },
      include: { lineItems: { include: { product: true } } },
    })

    return NextResponse.json({
      ok: true,
      orderId:      order.id,
      total,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      source,
      shippingAddress: { address, city, country, postalCode },
      items: order.lineItems.map(li => ({
        title:    li.product.title,
        quantity: li.quantity,
        price:    li.price,
      })),
    })
  } catch (err) {
    console.error('[admin-order]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
