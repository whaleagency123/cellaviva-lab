import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscribe & Save 15% | CELLAVIVA',
  description: 'Get Stemuvita™ delivered automatically every 30 days and save up to 22%. Pause or cancel anytime.',
  robots: { index: true, follow: true },
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return children
}
