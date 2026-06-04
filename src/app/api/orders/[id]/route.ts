import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const patchSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  paymentStatus: z.enum(['PENDING', 'AUTHORIZED', 'PAID', 'REFUNDED', 'FAILED']).optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = patchSchema.parse(body)

    const order = await prisma.order.update({
      where: { id },
      data,
    })

    return NextResponse.json(order)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 })
    }
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const order = await prisma.order.findUniqueOrThrow({
      where: { id },
      include: { lineItems: { include: { product: true } } },
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
