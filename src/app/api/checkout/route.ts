import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'

const schema = z.object({
  productId: z.string(),
  productSlug: z.string(),
  productTitle: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cellavivalab.com'

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: data.customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: data.productTitle,
              description: 'Plant-based scalp care by CELLAVIVA',
            },
            unit_amount: Math.round(data.price * 100),
          },
          quantity: data.quantity,
        },
      ],
      metadata: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        productId: data.productId,
        quantity: String(data.quantity),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'NL', 'BE', 'ES', 'IT', 'AU'],
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/products/${data.productSlug}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 })
    }
    void err
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 })
  }
}
