import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function isAdmin() {
  const jar = await cookies()
  return !!(jar.get('admin_session')?.value)
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(body.title     !== undefined && { title:      body.title }),
      ...(body.slug      !== undefined && { slug:       body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') }),
      ...(body.excerpt   !== undefined && { excerpt:    body.excerpt }),
      ...(body.body      !== undefined && { body:       body.body }),
      ...(body.coverEmoji !== undefined && { coverEmoji: body.coverEmoji }),
      ...(body.category  !== undefined && { category:   body.category }),
      ...(body.published !== undefined && { published:  body.published }),
    },
  })
  return NextResponse.json(post)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.blogPost.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
