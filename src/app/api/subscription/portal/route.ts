import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3002'
  const { returnUrl } = await req.json().catch(() => ({}))

  const customer = await prisma.customer.findUnique({ where: { email: session.user.email } })
  const stripeCustomerId = customer?.providerId?.startsWith('cus_') ? customer.providerId : null

  if (!stripeCustomerId) {
    return NextResponse.json({ error: 'No Stripe customer found. Please subscribe first.' }, { status: 404 })
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer:   stripeCustomerId,
    return_url: returnUrl ?? `${BASE_URL}/account`,
  })

  return NextResponse.json({ url: portalSession.url })
}
