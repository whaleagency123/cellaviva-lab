'use client'
import { useEffect } from 'react'
import { setStoreCurrency } from '@/lib/utils'

export function CurrencyLoader() {
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        if (d.paymentCurrency) setStoreCurrency(d.paymentCurrency)
      })
      .catch(() => {})
  }, [])
  return null
}
