import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
    const stockById = new Map(products.map((p) => [p.id, p.stock]))

    // Bundles have no stock of their own — surface the lowest stock among their
    // included products so the storefront always shows real, live availability.
    const withLiveStock = products.map((p) =>
      p.isBundle && p.bundleProductIds.length > 0
        ? { ...p, stock: Math.min(...p.bundleProductIds.map((id) => stockById.get(id) ?? 0)) }
        : p
    )

    return NextResponse.json(withLiveStock, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
