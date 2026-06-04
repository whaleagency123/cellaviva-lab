import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'review-submit', { limit: 3, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { productSlug, authorName, authorEmail, rating, title, body: reviewBody } = body

    if (!productSlug || !authorName || !authorEmail || !rating || !title || !reviewBody) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }
    if (authorName.length > 100 || title.length > 200 || reviewBody.length > 2000) {
      return NextResponse.json({ error: 'Field exceeds maximum length' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        productSlug,
        authorName:  authorName.trim(),
        authorEmail: authorEmail.toLowerCase().trim(),
        rating:      Number(rating),
        title:       title.trim(),
        body:        reviewBody.trim(),
        approved:    false, // requires admin approval before going live
      },
    })

    return NextResponse.json(
      { success: true, id: review.id, message: 'Thank you! Your review is pending approval.' },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
