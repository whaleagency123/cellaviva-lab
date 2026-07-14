import 'server-only'
import Stripe from 'stripe'
import { prisma } from './prisma'

interface CartItem {
  productId: string
  quantity: number
}

export async function createOrderFromPaymentIntent(
  pi: Stripe.PaymentIntent,
): Promise<{ id: string } | null> {
  if (pi.status !== 'succeeded') return null

  const existing = await prisma.order.findFirst({ where: { stripePaymentId: pi.id } })
  if (existing) return existing

  const { customerName, customerEmail, customerPhone, cartItemsJson, shippingAmount } =
    pi.metadata ?? {}

  if (!customerName || !customerEmail || !cartItemsJson) return null

  let cartItems: CartItem[]
  try {
    cartItems = JSON.parse(cartItemsJson)
  } catch {
    return null
  }

  // Fetch all products in one query
  const ids = cartItems.map((c) => c.productId)
  const products = await prisma.product.findMany({ where: { id: { in: ids } } })
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  const lineItems = cartItems
    .map((c) => {
      const p = productMap[c.productId]
      if (!p) return null
      return { productId: p.id, quantity: c.quantity, price: p.salePrice ?? p.price }
    })
    .filter(Boolean) as { productId: string; quantity: number; price: number }[]

  if (lineItems.length === 0) return null

  const itemsTotal = lineItems.reduce((s, l) => s + l.price * l.quantity, 0)
  const shipping = parseFloat(shippingAmount ?? '0') || 0
  const total = itemsTotal + shipping

  const order = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      customerPhone: customerPhone ?? null,
      shippingAddress: {},
      status: 'PENDING',
      paymentStatus: 'PAID',
      stripePaymentId: pi.id,
      total,
      lineItems: {
        create: lineItems,
      },
    },
  })

  // Decrement stock for all items — bundles decrement their included products' real
  // inventory instead of any stock of their own.
  const decrements = new Map<string, number>()
  for (const l of lineItems) {
    const p = productMap[l.productId]
    const targets = p?.isBundle && p.bundleProductIds.length > 0 ? p.bundleProductIds : [l.productId]
    for (const id of targets) {
      decrements.set(id, (decrements.get(id) ?? 0) + l.quantity)
    }
  }
  await Promise.all(
    [...decrements.entries()].map(([id, qty]) =>
      prisma.product.update({
        where: { id },
        data: { stock: { decrement: qty } },
      }),
    ),
  )

  return order
}
