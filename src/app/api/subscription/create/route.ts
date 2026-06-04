import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'subscription-create', { limit: 5, windowMs: 60 * 1000 })
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  try {
    const session  = await getServerSession(authOptions)
    const { productSlug, successUrl, cancelUrl } = await req.json()

    if (!productSlug) return NextResponse.json({ error: 'productSlug required' }, { status: 400 })

    // Get the Stripe price ID saved by the seed script
    const priceRow = await prisma.storeSettings.findUnique({
      where: { key: `stripePriceId_${productSlug}` },
    })

    if (!priceRow) {
      return NextResponse.json({ error: 'Subscription price not configured for this product' }, { status: 404 })
    }

    const stripe   = getStripe()
    const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3002'

    // Find or create Stripe customer if user is logged in
    let stripeCustomerId: string | undefined
    if (session?.user?.email) {
      const customer = await prisma.customer.findUnique({ where: { email: session.user.email } })

      if (customer?.providerId && customer.providerId.startsWith('cus_')) {
        stripeCustomerId = customer.providerId
      } else {
        // Create Stripe customer
        const sc = await stripe.customers.create({
          email: session.user.email,
          name:  session.user.name ?? undefined,
          metadata: { customerId: customer?.id ?? '' },
        })
        stripeCustomerId = sc.id

        // Save Stripe customer ID to DB
        if (customer) {
          await prisma.customer.update({
            where: { email: session.user.email },
            data:  { providerId: sc.id },
          })
        }
      }
    }

    // Create Stripe Checkout Session in subscription mode
    const checkoutSession = await stripe.checkout.sessions.create({
      mode:        'subscription',
      customer:    stripeCustomerId,
      line_items:  [{ price: priceRow.value, quantity: 1 }],
      success_url: successUrl ?? `${BASE_URL}/checkout/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  cancelUrl  ?? `${BASE_URL}/subscribe`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          productSlug,
          customerEmail: session?.user?.email ?? '',
        },
        trial_period_days: 0,
      },
      metadata: {
        productSlug,
        customerEmail: session?.user?.email ?? '',
      },
    })

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
