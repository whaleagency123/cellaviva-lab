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

  // Decrement stock for all items
  await Promise.all(
    lineItems.map((l) =>
      prisma.product.update({
        where: { id: l.productId },
        data: { stock: { decrement: l.quantity } },
      }),
    ),
  )

  return order
}
