import { prisma } from './prisma'

export interface ShippingConfig {
  threshold: number // free shipping above this amount
  fee: number       // shipping cost below threshold
}

const DEFAULT: ShippingConfig = { threshold: 50, fee: 9.99 }

export async function getShippingConfig(): Promise<ShippingConfig> {
  try {
    const rows = await prisma.storeSettings.findMany({
      where: { key: { in: ['paymentShippingThreshold', 'paymentShippingFee'] } },
    })
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    return {
      threshold: parseFloat(map.paymentShippingThreshold ?? '') || DEFAULT.threshold,
      fee:       parseFloat(map.paymentShippingFee       ?? '') || DEFAULT.fee,
    }
  } catch {
    return DEFAULT
  }
}

export function calcShipping(cartTotal: number, config: ShippingConfig): number {
  return cartTotal >= config.threshold ? 0 : config.fee
}
