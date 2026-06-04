import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE  = 'cv-admin-sess-2026-authenticated'

async function isAdmin() {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

const PAYMENT_KEYS = [
  'paymentEnabled',
  'paymentCurrency',
  'paymentShippingThreshold',
  'paymentShippingFee',
  'paymentTaxRate',
  'paymentEnableWallets',
  // Payout bank account
  'payoutAccountHolder',
  'payoutBankName',
  'payoutIBAN',
  'payoutBIC',
  'payoutAccountNumber',
]

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const action = req.nextUrl.searchParams.get('action')

  if (action === 'test') {
    try {
      const stripe = getStripe()
      // Lightweight call to verify the key works
      await stripe.paymentMethods.list({ limit: 1 })
      const key = process.env.STRIPE_SECRET_KEY ?? ''
      const mode = key.startsWith('sk_live') ? 'live' : 'test'
      return NextResponse.json({ ok: true, mode })
    } catch (err: any) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 200 })
    }
  }

  try {
    const rows = await prisma.storeSettings.findMany({
      where: { key: { in: PAYMENT_KEYS } },
    })
    const map: Record<string, string> = {}
    for (const r of rows) map[r.key] = r.value
    return NextResponse.json(map)
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body: Record<string, string> = await req.json()
    const filtered = Object.fromEntries(
      Object.entries(body).filter(([k]) => PAYMENT_KEYS.includes(k)),
    )
    const upserts = Object.entries(filtered).map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    )
    await Promise.all(upserts)
    return NextResponse.json({ success: true })
  } catch (err) {
    void err
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
