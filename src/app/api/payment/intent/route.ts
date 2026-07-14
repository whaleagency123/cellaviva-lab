import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

const CartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(99),
})

const BodySchema = z.object({
  customerName: z.string().min(1).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(30).optional().default(''),
  cartItems: z.array(CartItemSchema).min(1).max(20),
  shippingAmount: z.number().min(0).max(500),
  discountCode: z.string().max(50).optional().nullable(),
  discountAmount: z.number().min(0).max(10000).optional().default(0),
})

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'payment-intent', { limit: 10, windowMs: 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  try {
    const raw = await req.json()
    const body = BodySchema.safeParse(raw)
    if (!body.success) {
      return NextResponse.json({ error: 'Invalid request', details: body.error.flatten() }, { status: 400 })
    }

    const { customerName, customerEmail, customerPhone, cartItems, shippingAmount, discountCode, discountAmount } = body.data

    // Always fetch and verify prices server-side — never trust client-supplied amounts
    const ids = cartItems.map((c) => c.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, active: true },
      select: { id: true, price: true, salePrice: true, stock: true, title: true, isBundle: true, bundleProductIds: true },
    })

    if (products.length !== ids.length) {
      return NextResponse.json({ error: 'One or more products are unavailable' }, { status: 400 })
    }

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

    // Bundles have no stock of their own — availability is the lowest stock among
    // their included products, so fetch stock for any component not already loaded.
    const componentIds = [...new Set(products.flatMap((p) => (p.isBundle ? p.bundleProductIds : [])))]
      .filter((id) => !productMap[id])
    const componentStock = componentIds.length > 0
      ? await prisma.product.findMany({ where: { id: { in: componentIds } }, select: { id: true, stock: true } })
      : []
    const componentStockMap = Object.fromEntries(componentStock.map((p) => [p.id, p.stock]))

    function effectiveStock(p: (typeof products)[number]): number {
      if (!p.isBundle || p.bundleProductIds.length === 0) return p.stock
      return Math.min(...p.bundleProductIds.map((id) => productMap[id]?.stock ?? componentStockMap[id] ?? 0))
    }

    for (const item of cartItems) {
      const p = productMap[item.productId]
      if (effectiveStock(p) < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for "${p.title}"` }, { status: 400 })
      }
    }

    const itemsTotal = cartItems.reduce((sum, item) => {
      const p = productMap[item.productId]
      return sum + (p.salePrice ?? p.price) * item.quantity
    }, 0)

    const cartItemsForMeta = cartItems

    if (itemsTotal <= 0) {
      return NextResponse.json({ error: 'Could not determine order total' }, { status: 400 })
    }

    const total = Math.max(0, itemsTotal + shippingAmount - (discountAmount ?? 0))
    const amountInCents = Math.round(total * 100)

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        customerName,
        customerEmail,
        customerPhone,
        cartItemsJson: JSON.stringify(cartItemsForMeta),
        shippingAmount: String(shippingAmount),
        ...(discountCode && { discountCode }),
        ...(discountAmount && { discountAmount: String(discountAmount) }),
      },
    })

    // Increment usage count for validated discount
    if (discountCode) {
      await prisma.discountCode.updateMany({
        where: { code: discountCode.toUpperCase(), active: true },
        data: { usedCount: { increment: 1 } },
      }).catch(() => {}) // non-fatal
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, total })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
