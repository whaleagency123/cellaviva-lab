import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart | CELLAVIVA',
  description: 'Review your CELLAVIVA order. Free shipping on orders over $50.',
  robots: { index: false, follow: false },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
