import { NextResponse } from 'next/server'
import { getShippingConfig } from '@/lib/shipping'

export const revalidate = 300 // cache 5 min

export async function GET() {
  const config = await getShippingConfig()
  return NextResponse.json(config)
}
