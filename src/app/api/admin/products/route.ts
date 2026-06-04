import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function isAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'cv-admin-sess-2026-authenticated'
}

function toSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// GET — list all products (admin sees everything)
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST — create product
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { title, description, price, salePrice, stock, images, featured, status, comingSoon } = body

    if (!title || price == null) {
      return NextResponse.json({ error: 'title and price are required' }, { status: 400 })
    }

    const baseSlug = toSlug(title)
    // Ensure slug uniqueness
    let slug = baseSlug
    let suffix = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`
    }

    const active = status === 'ACTIVE'
    const isComing = !active && status === 'DRAFT'

    const product = await prisma.product.create({
      data: {
        slug,
        title,
        description: description ?? '',
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        stock: Number(stock ?? 0),
        images: images ?? [],
        featured: Boolean(featured),
        active,
        comingSoon: comingSoon ?? isComing,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error('[admin-products POST]', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
