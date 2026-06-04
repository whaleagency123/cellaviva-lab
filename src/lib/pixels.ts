'use client'

// Extend window with pixel globals
declare global {
  interface Window {
    fbq?:    (...args: unknown[]) => void
    dataLayer?: unknown[]
    ttq?:    { track: (event: string, data?: Record<string, unknown>) => void; page: () => void }
    pintrk?: (...args: unknown[]) => void
    snaptr?: (...args: unknown[]) => void
  }
}

const EUR = 'EUR'

export function trackPageView() {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'PageView')
  window.ttq?.page()
  window.pintrk?.('track', 'pagevisit')
  window.snaptr?.('track', 'PAGE_VIEW')
}

export function trackViewContent(p: { id: string; name: string; price: number }) {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'ViewContent', { content_ids: [p.id], content_name: p.name, value: p.price, currency: EUR })
  window.dataLayer?.push({ event: 'view_item', ecommerce: { currency: EUR, value: p.price, items: [{ item_id: p.id, item_name: p.name, price: p.price }] } })
  window.ttq?.track('ViewContent', { content_id: p.id, value: p.price, currency: EUR })
  window.pintrk?.('track', 'pagevisit', { value: p.price, currency: EUR })
}

export function trackAddToCart(p: { id: string; name: string; price: number; qty?: number }) {
  if (typeof window === 'undefined') return
  const qty = p.qty ?? 1
  window.fbq?.('track', 'AddToCart', { content_ids: [p.id], content_name: p.name, value: p.price * qty, currency: EUR })
  window.dataLayer?.push({ event: 'add_to_cart', ecommerce: { currency: EUR, value: p.price * qty, items: [{ item_id: p.id, item_name: p.name, price: p.price, quantity: qty }] } })
  window.ttq?.track('AddToCart', { content_id: p.id, value: p.price * qty, currency: EUR })
  window.pintrk?.('track', 'addtocart', { value: p.price * qty, currency: EUR })
  window.snaptr?.('track', 'ADD_CART', { price: p.price * qty, currency: EUR })
}

export function trackInitiateCheckout(value: number) {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'InitiateCheckout', { value, currency: EUR })
  window.dataLayer?.push({ event: 'begin_checkout', ecommerce: { currency: EUR, value } })
  window.ttq?.track('InitiateCheckout', { value, currency: EUR })
  window.snaptr?.('track', 'START_CHECKOUT', { price: value, currency: EUR })
}

export function trackPurchase(p: { orderId: string; value: number; items?: Array<{ id: string; name: string; price: number; qty: number }> }) {
  if (typeof window === 'undefined') return
  const gtmItems = (p.items ?? []).map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.qty }))

  window.fbq?.('track', 'Purchase', { value: p.value, currency: EUR })
  window.dataLayer?.push({ event: 'purchase', ecommerce: { transaction_id: p.orderId, value: p.value, currency: EUR, items: gtmItems } })
  window.ttq?.track('CompletePayment', { value: p.value, currency: EUR })
  window.pintrk?.('track', 'checkout', { value: p.value, currency: EUR, order_id: p.orderId })
  window.snaptr?.('track', 'PURCHASE', { price: p.value, currency: EUR, transaction_id: p.orderId })
}
