import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { createOrderFromPaymentIntent } from '@/lib/create-order'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    void err
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await createOrderFromPaymentIntent(pi)
        await prisma.order.updateMany({
          where: { stripePaymentId: pi.id },
          data: { paymentStatus: 'PAID', status: 'PROCESSING' },
        })
        // Send order confirmation email
        const order = await prisma.order.findFirst({
          where: { stripePaymentId: pi.id },
          include: { lineItems: { include: { product: { select: { title: true } } } } },
        })
        if (order) {
          sendOrderConfirmationEmail({
            to:              order.customerEmail,
            customerName:    order.customerName,
            orderId:         order.id,
            total:           order.total,
            shippingCity:    (order.shippingAddress as Record<string, string>)?.city ?? null,
            shippingCountry: (order.shippingAddress as Record<string, string>)?.country ?? null,
            items: order.lineItems.map(li => ({
              title:    li.product?.title ?? 'Product',
              quantity: li.quantity,
              price:    li.price,
            })),
          }).catch(() => {}) // non-fatal
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        await prisma.order.updateMany({
          where: { stripePaymentId: pi.id },
          data: { paymentStatus: 'FAILED' },
        })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          const piId = charge.payment_intent as string
          // Find the order and restore stock for each line item
          const order = await prisma.order.findFirst({
            where: { stripePaymentId: piId },
            include: { lineItems: { include: { product: true } } },
          })
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: { paymentStatus: 'REFUNDED', status: 'CANCELLED' },
            })
            // Restore inventory — bundles restore their included products' real
            // inventory instead of any stock of their own.
            const increments = new Map<string, number>()
            for (const item of order.lineItems) {
              const targets = item.product?.isBundle && item.product.bundleProductIds.length > 0
                ? item.product.bundleProductIds
                : [item.productId]
              for (const id of targets) {
                increments.set(id, (increments.get(id) ?? 0) + item.quantity)
              }
            }
            await Promise.all(
              [...increments.entries()].map(([id, qty]) =>
                prisma.product.update({
                  where: { id },
                  data: { stock: { increment: qty } },
                }).catch(() => {}),
              ),
            )
          }
        }
        break
      }

      // Legacy: still handle hosted checkout sessions in case any are in-flight
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_intent && session.metadata) {
          const { customerName, customerEmail, productId, quantity } = session.metadata
          if (customerName && customerEmail && productId) {
            const product = await prisma.product.findUnique({ where: { id: productId } })
            if (product) {
              const qty = parseInt(quantity ?? '1')
              const price = product.salePrice ?? product.price
              const exists = await prisma.order.findFirst({
                where: { stripePaymentId: session.payment_intent as string },
              })
              if (!exists) {
                await prisma.order.create({
                  data: {
                    customerName,
                    customerEmail,
                    shippingAddress: (session as any).shipping_details ?? {},
                    status: 'PENDING',
                    paymentStatus: 'PAID',
                    stripePaymentId: session.payment_intent as string,
                    total: price * qty,
                    lineItems: { create: [{ productId: product.id, quantity: qty, price }] },
                  },
                })
                await prisma.product.update({
                  where: { id: productId },
                  data: { stock: { decrement: qty } },
                })
              }
            }
          }
        }
        break
      }

      // ── Subscription created (first checkout) ────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.subscription) {
          const meta       = session.metadata ?? {}
          const productSlug = meta.productSlug ?? ''
          const customerEmail = meta.customerEmail ?? session.customer_details?.email ?? ''
          const subId = session.subscription as string

          // Find customer in our DB
          const customer = customerEmail
            ? await prisma.customer.findUnique({ where: { email: customerEmail } }).catch(() => null)
            : null

          if (customer && productSlug) {
            const product = await prisma.product.findUnique({ where: { slug: productSlug } }).catch(() => null)
            if (product) {
              await prisma.subscription.upsert({
                where:  { stripeSubscriptionId: subId },
                create: {
                  customerId:           customer.id,
                  stripeSubscriptionId: subId,
                  stripeCustomerId:     session.customer as string ?? null,
                  productId:            product.id,
                  status:               'ACTIVE',
                  pricePerCycle:        (session.amount_total ?? 0) / 100,
                  intervalDays:         30,
                  nextBillingAt:        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
                update: { status: 'ACTIVE' },
              }).catch(() => {})

              // Update customer's Stripe customer ID
              if (session.customer) {
                await prisma.customer.update({
                  where: { id: customer.id },
                  data:  { providerId: session.customer as string },
                }).catch(() => {})
              }
            }
          }
        }
        // Also handle legacy one-time checkout
        else if (session.mode === 'payment' && session.payment_intent && session.metadata) {
          const { customerName, customerEmail, productId, quantity } = session.metadata
          if (customerName && customerEmail && productId) {
            const product = await prisma.product.findUnique({ where: { id: productId } })
            if (product) {
              const qty   = parseInt(quantity ?? '1')
              const price = product.salePrice ?? product.price
              const exists = await prisma.order.findFirst({ where: { stripePaymentId: session.payment_intent as string } })
              if (!exists) {
                await prisma.order.create({
                  data: {
                    customerName, customerEmail,
                    shippingAddress: (session as any).shipping_details ?? {},
                    status: 'PENDING', paymentStatus: 'PAID',
                    stripePaymentId: session.payment_intent as string,
                    total: price * qty,
                    lineItems: { create: [{ productId: product.id, quantity: qty, price }] },
                  },
                })
                await prisma.product.update({ where: { id: productId }, data: { stock: { decrement: qty } } })
              }
            }
          }
        }
        break
      }

      // ── Subscription renewal (monthly payment) ────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
        if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
          // Update next billing date
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: invoice.subscription },
            data:  {
              status:        'ACTIVE',
              nextBillingAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          }).catch(() => {})
        }
        break
      }

      // ── Subscription cancelled ────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data:  { status: 'CANCELLED', cancelledAt: new Date() },
        }).catch(() => {})
        break
      }

      // ── Subscription updated (paused/resumed) ─────────────────────────
      case 'customer.subscription.updated': {
        const sub    = event.data.object as Stripe.Subscription
        const status = sub.status === 'active' ? 'ACTIVE' : sub.status === 'paused' ? 'PAUSED' : 'PAST_DUE'
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data:  { status },
        }).catch(() => {})
        break
      }

      // ── Payment failed ────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
        if (invoice.subscription) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: invoice.subscription },
            data:  { status: 'PAST_DUE' },
          }).catch(() => {})
        }
        break
      }

      default:
        break // unhandled events are intentionally ignored
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
