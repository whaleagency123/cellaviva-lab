import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Your Order | CELLAVIVA',
  description: 'Track the status of your CELLAVIVA order in real time.',
  robots: { index: false, follow: false },
}

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children
}
