import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | CELLAVIVA',
  description: 'Get in touch with the CELLAVIVA team. We\'re here to help with orders, product questions, and anything else.',
  openGraph: { title: 'Contact CELLAVIVA', description: 'Reach our support team — we respond within 2 hours.', type: 'website' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
