import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'discount-validate', { limit: 20, windowMs: 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { code, orderTotal } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    })

    if (!discount || !discount.active) {
      return NextResponse.json({ error: 'Invalid or expired discount code' }, { status: 404 })
    }

    const now = new Date()
    if (discount.expiresAt && discount.expiresAt < now) {
      return NextResponse.json({ error: 'This discount code has expired' }, { status: 400 })
    }

    if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) {
      return NextResponse.json({ error: 'This discount code has reached its usage limit' }, { status: 400 })
    }

    if (discount.minOrder !== null && orderTotal < discount.minOrder) {
      return NextResponse.json(
        { error: `Minimum order of €${discount.minOrder.toFixed(2)} required` },
        { status: 400 },
      )
    }

    const discountAmount =
      discount.type === 'PERCENTAGE'
        ? Math.round((orderTotal * discount.value) / 100 * 100) / 100
        : Math.min(discount.value, orderTotal)

    return NextResponse.json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
