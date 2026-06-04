import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Module-level currency — set by CurrencyLoader on the client after reading admin settings
let _storeCurrency = 'USD'
export function setStoreCurrency(c: string) { _storeCurrency = c.toUpperCase() }

export function formatPrice(amount: number, currency?: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? _storeCurrency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getDeliveryWindow() {
  const start = new Date()
  start.setDate(start.getDate() + 3)
  const end = new Date()
  end.setDate(end.getDate() + 5)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} - ${fmt(end)} Shipped`
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
