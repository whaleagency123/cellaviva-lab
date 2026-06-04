import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import nodemailer from 'nodemailer'

const schema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  phone:   z.string().max(30).optional(),
  message: z.string().min(1).max(2000),
})

function createTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return nodemailer.createTransport({ jsonTransport: true })
  return nodemailer.createTransport({
    host, port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

const BRAND_GREEN = '#2E5B41'

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 'contact', { limit: 5, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Save to DB
    await prisma.contactInquiry.create({ data })

    // Auto-reply to user
    const from = process.env.SMTP_FROM || 'CELLAVIVA <hello@cellaviva.com>'
    const transport = createTransport()

    const autoReplyHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f0;font-family:system-ui,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="background:${BRAND_GREEN};border-radius:16px 16px 0 0;padding:24px 32px">
  <span style="font-size:22px;font-weight:900;color:#E7EFE4">CELLAVIVA</span>
</td></tr>
<tr><td style="background:#fff;padding:32px;border:1px solid #e0e0e0;border-top:none">
  <h2 style="margin:0 0 12px;color:#142718">We got your message!</h2>
  <p style="color:#52796F;margin-bottom:16px">Hi <strong>${data.name}</strong>, thank you for reaching out. We have received your message and will get back to you within <strong>2 business hours</strong>.</p>
  <div style="background:#E7EFE4;border-radius:12px;padding:16px 20px;margin-bottom:24px;border-left:4px solid ${BRAND_GREEN}">
    <p style="margin:0;font-size:13px;color:#52796F;font-style:italic">"${data.message.slice(0, 200)}${data.message.length > 200 ? '…' : ''}"</p>
  </div>
  <p style="color:#142718;font-size:14px;margin-bottom:8px">In the meantime, you might find answers in our:</p>
  <ul style="color:#52796F;font-size:14px;padding-left:20px;margin-bottom:24px">
    <li><a href="https://cellaviva.com/products" style="color:${BRAND_GREEN}">Product pages</a></li>
    <li><a href="https://cellaviva.com/blog" style="color:${BRAND_GREEN}">Hair Care Blog</a></li>
    <li><a href="https://cellaviva.com/track-order" style="color:${BRAND_GREEN}">Track your order</a></li>
  </ul>
</td></tr>
<tr><td style="background:#E7EFE4;border-radius:0 0 16px 16px;padding:16px 32px;border:1px solid #d4e6d0;border-top:none">
  <p style="margin:0;font-size:11px;color:#52796F;text-align:center">CELLAVIVA &middot; Dublin, Ireland &middot; hello@cellaviva.com</p>
</td></tr>
</table></td></tr></table></body></html>`

    await transport.sendMail({
      from, to: data.email,
      subject: `We received your message, ${data.name.split(' ')[0]}! — CELLAVIVA`,
      html: autoReplyHtml,
    }).catch(() => {}) // non-fatal if email fails

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
