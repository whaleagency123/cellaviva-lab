import nodemailer from 'nodemailer'

const BRAND_GREEN = '#2E5B41'
const BG_LIGHT    = '#E7EFE4'

function emailWrapper(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:system-ui,-apple-system,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
<tr><td style="background:${BRAND_GREEN};border-radius:16px 16px 0 0;padding:24px 32px">
  <span style="font-size:22px;font-weight:900;color:${BG_LIGHT};letter-spacing:-1px">CELLAVIVA</span>
  <p style="margin:4px 0 0;font-size:11px;color:rgba(231,239,228,0.6);text-transform:uppercase;letter-spacing:0.15em">Plant-Based Hair Care</p>
</td></tr>
<tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e8e8e8;border-right:1px solid #e8e8e8">
  ${body}
</td></tr>
<tr><td style="background:${BG_LIGHT};border-radius:0 0 16px 16px;padding:20px 32px;border:1px solid #d4e6d0;border-top:none">
  <p style="margin:0;font-size:11px;color:#52796F;text-align:center">
    CELLAVIVA &middot; Dublin, Ireland &middot; hello@cellaviva.com<br>
    <a href="https://cellaviva.com/privacy" style="color:${BRAND_GREEN}">Privacy Policy</a> &nbsp;&middot;&nbsp;
    <a href="https://cellaviva.com/terms" style="color:${BRAND_GREEN}">Terms</a>
  </p>
</td></tr>
</table></td></tr></table></body></html>`
}

export async function sendOrderConfirmationEmail(opts: {
  to: string
  customerName: string
  orderId: string
  total: number
  items: Array<{ title: string; quantity: number; price: number }>
  shippingCity?: string | null
  shippingCountry?: string | null
}) {
  const { to, customerName, orderId, total, items, shippingCity, shippingCountry } = opts
  const transport = createTransport()
  const from = process.env.SMTP_FROM || 'CELLAVIVA <orders@cellaviva.com>'
  const shortId = orderId.slice(0, 10).toUpperCase()

  const rows = items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#142718">${i.title}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#142718;text-align:center">&times;${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:600;color:#142718;text-align:right">&euro;${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join('')

  const body = `
<h2 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#142718">Order Confirmed!</h2>
<p style="margin:0 0 24px;font-size:15px;color:#52796F">Hi <strong>${customerName}</strong>, thank you for your order. We are preparing it now.</p>
<div style="background:#E7EFE4;border-radius:12px;padding:16px 20px;margin-bottom:24px">
  <p style="margin:0;font-size:12px;color:#52796F;text-transform:uppercase;letter-spacing:0.1em">Order Number</p>
  <p style="margin:4px 0 0;font-size:20px;font-weight:900;color:#2E5B41;font-family:monospace">${shortId}</p>
</div>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
  <thead><tr>
    <th style="text-align:left;font-size:11px;color:#52796F;text-transform:uppercase;padding-bottom:8px">Product</th>
    <th style="text-align:center;font-size:11px;color:#52796F;text-transform:uppercase;padding-bottom:8px">Qty</th>
    <th style="text-align:right;font-size:11px;color:#52796F;text-transform:uppercase;padding-bottom:8px">Price</th>
  </tr></thead>
  <tbody>${rows}</tbody>
  <tfoot><tr>
    <td colspan="2" style="padding-top:12px;font-size:15px;font-weight:700;color:#142718">Total</td>
    <td style="padding-top:12px;font-size:18px;font-weight:900;color:#2E5B41;text-align:right">&euro;${total.toFixed(2)}</td>
  </tr></tfoot>
</table>
${shippingCity ? `<p style="font-size:14px;color:#52796F;margin-bottom:24px">Shipping to: <strong>${shippingCity}${shippingCountry ? `, ${shippingCountry}` : ''}</strong></p>` : ''}
<div style="background:#f8f8f8;border-radius:12px;padding:16px 20px;margin-bottom:24px">
  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#142718">What happens next?</p>
  <p style="margin:0;font-size:13px;color:#52796F;line-height:1.7">
    1. We pack your order within 1 business day<br>
    2. You will receive a shipping confirmation with tracking<br>
    3. Delivery in 3-7 business days
  </p>
</div>
<p style="font-size:13px;color:#52796F;margin:0">Questions? <a href="mailto:hello@cellaviva.com" style="color:#2E5B41;font-weight:600">Contact us</a> anytime.</p>`

  const info = await transport.sendMail({
    from, to,
    subject: `Your CELLAVIVA order is confirmed (${shortId})`,
    html: emailWrapper(body),
  })

  if (!process.env.SMTP_HOST) {
    console.log(`\n📧 [DEV] Order confirmation for ${to}: ${orderId}\n`)
  }

  return info
}

function createTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  // Development fallback: log to console
  if (!host || !user || !pass) {
    return nodemailer.createTransport({ jsonTransport: true })
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

export async function sendVerificationEmail(to: string, code: string, username: string) {
  const from = process.env.SMTP_FROM || 'CELLAVIVA Admin <noreply@cellaviva.com>'
  const transport = createTransport()

  const info = await transport.sendMail({
    from,
    to,
    subject: 'CELLAVIVA Admin — Email Verification Code',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">CELLA<span style="color:#4ade80">VIVA</span></h2>
        <p style="color:#555;margin-bottom:24px">Admin Panel — Email Verification</p>
        <p style="margin-bottom:16px">Hi <strong>${username}</strong>, your verification code is:</p>
        <div style="background:#f4f4f4;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#111">${code}</span>
        </div>
        <p style="color:#888;font-size:13px">This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  })

  // Dev mode: log code to console since no SMTP is configured
  if (!process.env.SMTP_HOST) {
    console.log(`\n📧 [DEV] Verification code for ${to}: ${code}\n`)
  }

  return info
}

export async function sendCustomerPasswordResetEmail(to: string, resetUrl: string) {
  const from = process.env.SMTP_FROM || 'CELLAVIVA <noreply@cellaviva.com>'
  const transport = createTransport()

  const body = `
<h2 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#142718">Reset your password</h2>
<p style="margin:0 0 24px;font-size:15px;color:#52796F">We received a request to reset the password for your CELLAVIVA account.</p>
<p style="margin:0 0 24px;font-size:15px;color:#52796F">Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
<div style="text-align:center;margin-bottom:32px">
  <a href="${resetUrl}" style="display:inline-block;background:#2E5B41;color:#E7EFE4;font-size:15px;font-weight:700;padding:14px 32px;border-radius:9999px;text-decoration:none">Reset Password</a>
</div>
<p style="font-size:13px;color:#52796F;margin:0">If you did not request this, you can safely ignore this email. Your password will not change.</p>`

  const info = await transport.sendMail({
    from, to,
    subject: 'Reset your CELLAVIVA password',
    html: emailWrapper(body),
  })

  if (!process.env.SMTP_HOST) {
    console.log(`\n📧 [DEV] Customer password reset for ${to}: ${resetUrl}\n`)
  }

  return info
}

export async function sendPasswordResetEmail(to: string, code: string, username: string) {
  const from = process.env.SMTP_FROM || 'CELLAVIVA Admin <noreply@cellaviva.com>'
  const transport = createTransport()

  const info = await transport.sendMail({
    from,
    to,
    subject: 'CELLAVIVA Admin — Password Reset Code',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">CELLA<span style="color:#4ade80">VIVA</span></h2>
        <p style="color:#555;margin-bottom:24px">Admin Panel — Password Reset</p>
        <p style="margin-bottom:16px">Hi <strong>${username}</strong>, use this code to reset your password:</p>
        <div style="background:#f4f4f4;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <span style="font-size:36px;font-weight:900;letter-spacing:12px;color:#111">${code}</span>
        </div>
        <p style="color:#888;font-size:13px">This code expires in 10 minutes. If you did not request a reset, ignore this email.</p>
      </div>
    `,
  })

  if (!process.env.SMTP_HOST) {
    console.log(`\n📧 [DEV] Password reset code for ${to}: ${code}\n`)
  }

  return info
}
