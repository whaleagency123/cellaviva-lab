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

export async function GET() {
  const customerId = await getCustomerId()
  if (!customerId) return NextResponse.json([], { status: 200 })
  try {
    const addresses = await prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json(addresses)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  const customerId = await getCustomerId()
  if (!customerId) return NextResponse.json({ error: 'Sign in to save an address' }, { status: 401 })
  try {
    const body = await req.json()
    const { label, name, line1, line2, city, postcode, country } = body
    if (!name || !line1 || !city || !postcode || !country) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 })
    }

    const existingCount = await prisma.customerAddress.count({ where: { customerId } })
    const isFirst = existingCount === 0

    const address = await prisma.customerAddress.create({
      data: {
        customerId,
        label: label || 'Home',
        name,
        line1,
        line2: line2 || null,
        city,
        postcode,
        country,
        isDefault: isFirst,
      },
    })
    return NextResponse.json(address, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 })
  }
}
