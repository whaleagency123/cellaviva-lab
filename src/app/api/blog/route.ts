import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverEmoji: true,
        category: true,
        createdAt: true,
      },
    })
    return NextResponse.json(posts)
  } catch (err) {
    void err
    return NextResponse.json([], { status: 200 })
  }
}
