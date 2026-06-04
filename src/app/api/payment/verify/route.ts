import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createOrderFromPaymentIntent } from '@/lib/create-order'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !id.startsWith('pi_')) {
    return NextResponse.json({ error: 'Invalid payment intent ID' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const pi = await stripe.paymentIntents.retrieve(id)

    if (pi.status !== 'succeeded') {
      return NextResponse.json(
        { error: `Payment not completed (status: ${pi.status})` },
        { status: 400 },
      )
    }

    const order = await createOrderFromPaymentIntent(pi)

    return NextResponse.json({
      ok: true,
      orderId: order?.id ?? null,
      customerEmail: pi.metadata?.customerEmail ?? '',
      customerName: pi.metadata?.customerName ?? '',
      total: (pi.amount ?? 0) / 100,
      currency: pi.currency ?? 'eur',
    })
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
