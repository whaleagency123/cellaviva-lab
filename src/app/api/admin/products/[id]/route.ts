import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'cv-admin-sess-2026-authenticated'
}

// PATCH — update product
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const body = await req.json()
    const { title, description, price, salePrice, stock, images, featured, status, comingSoon } = body

    const active = status === 'ACTIVE'
    const isComing = !active && status === 'DRAFT'

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price:      price != null ? Number(price) : undefined,
        salePrice:  salePrice     ? Number(salePrice) : null,
        stock:      stock  != null ? Number(stock)  : undefined,
        images:     images         ?? undefined,
        featured:   featured       != null ? Boolean(featured) : undefined,
        active,
        comingSoon: comingSoon     != null ? Boolean(comingSoon) : isComing,
      },
    })
    return NextResponse.json(product)
  } catch (err) {
    console.error('[admin-products PATCH]', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE — delete product
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin-products DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
