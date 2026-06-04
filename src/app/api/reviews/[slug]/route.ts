import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    const reviews = await prisma.review.findMany({
      where: { productSlug: slug, approved: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        authorName: true,
        rating: true,
        title: true,
        body: true,
        verified: true,
        createdAt: true,
      },
    })
    return NextResponse.json(reviews, {
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' },
    })
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
