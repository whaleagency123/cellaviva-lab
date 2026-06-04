import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hair Care Quiz | Find Your Perfect Routine — CELLAVIVA',
  description: 'Take our 60-second quiz to discover the ideal Stemuvita™ routine for your hair type, concern, and goals.',
  openGraph: { title: 'Find Your Perfect Hair Routine', description: 'Personalised recommendations in 60 seconds.', type: 'website' },
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children
}
