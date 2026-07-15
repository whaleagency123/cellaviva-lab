import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'

async function getCustomerId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) return null
  const customer = await prisma.customer.findUnique({ where: { email }, select: { id: true } })
  return customer?.id ?? null
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const customerId = await getCustomerId()
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const existing = await prisma.customerAddress.findUnique({ where: { id } })
  if (!existing || existing.customerId !== customerId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await req.json()

    if (body.setDefault) {
      await prisma.$transaction([
        prisma.customerAddress.updateMany({ where: { customerId }, data: { isDefault: false } }),
        prisma.customerAddress.update({ where: { id }, data: { isDefault: true } }),
      ])
      return NextResponse.json({ success: true })
    }

    const { label, name, line1, line2, city, postcode, country } = body
    const address = await prisma.customerAddress.update({
      where: { id },
      data: {
        label: label ?? undefined,
        name: name ?? undefined,
        line1: line1 ?? undefined,
        line2: line2 !== undefined ? (line2 || null) : undefined,
        city: city ?? undefined,
        postcode: postcode ?? undefined,
        country: country ?? undefined,
      },
    })
    return NextResponse.json(address)
  } catch {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const customerId = await getCustomerId()
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const existing = await prisma.customerAddress.findUnique({ where: { id } })
  if (!existing || existing.customerId !== customerId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    await prisma.customerAddress.delete({ where: { id } })

    // If the deleted address was the default, promote the next-oldest one
    if (existing.isDefault) {
      const next = await prisma.customerAddress.findFirst({
        where: { customerId },
        orderBy: { createdAt: 'asc' },
      })
      if (next) {
        await prisma.customerAddress.update({ where: { id: next.id }, data: { isDefault: true } })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}
