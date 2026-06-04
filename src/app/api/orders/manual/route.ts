import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName, customerEmail, customerPhone,
      address, city, country, postalCode,
      cartItems, shippingAmount, discountCode,
      discountAmount, paymentMethod,
    } = body

    if (!customerName || !customerEmail || !cartItems?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch product prices from DB
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

    const total = Math.max(0, subtotal + (shippingAmount ?? 0) - (discountAmount ?? 0))

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone ?? '',
        shippingAddress: { address, city, country, postalCode },
        lineItems: { create: lineItems },
        status:        'PENDING',
        paymentStatus: 'PENDING',
        stripePaymentId: `${paymentMethod?.toUpperCase() ?? 'MANUAL'}-${Date.now()}`,
        discountCode:    discountCode ?? null,
        discountAmount:  discountAmount ?? 0,
        total,
      },
      include: { lineItems: { include: { product: true } } },
    })

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      total,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      shippingAddress: { address, city, country, postalCode },
      items: order.lineItems.map(li => ({
        title:    li.product.title,
        quantity: li.quantity,
        price:    li.price,
      })),
    })
  } catch (err) {
    console.error('[manual-order]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
