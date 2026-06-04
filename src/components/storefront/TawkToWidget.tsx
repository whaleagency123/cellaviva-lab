'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

export function TawkToWidget() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID
  const widgetId = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID ?? 'default'

  useEffect(() => {
    if (!propertyId) return
    if (document.getElementById('tawk-to-script')) return

    window.Tawk_API = window.Tawk_API ?? {}
    window.Tawk_LoadStart = new Date()

    const s1 = document.createElement('script')
    const s0 = document.getElementsByTagName('script')[0]
    s1.id = 'tawk-to-script'
    s1.async = true
    s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    s0?.parentNode?.insertBefore(s1, s0)

    return () => {
      // Cleanup on unmount (e.g., admin panel navigation)
      document.getElementById('tawk-to-script')?.remove()
    }
  }, [propertyId, widgetId])

  return null
}
