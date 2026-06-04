import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | CELLAVIVA',
  description: 'Complete your CELLAVIVA order securely. 30-day money-back guarantee.',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
