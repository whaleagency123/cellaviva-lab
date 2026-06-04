import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function isAdmin() {
  const jar = await cookies()
  return !!(jar.get('admin_session')?.value)
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { title, slug, excerpt, body: postBody, coverEmoji, category, published } = body

  if (!title?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

  const post = await prisma.blogPost.create({
    data: {
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      excerpt: excerpt ?? '',
      body: postBody ?? '',
      coverEmoji: coverEmoji ?? '🌿',
      category: category ?? 'Hair Care',
      published: published ?? false,
    },
  })
  return NextResponse.json(post, { status: 201 })
}
