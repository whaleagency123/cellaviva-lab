import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | CELLAVIVA',
  description: 'Sign in to your CELLAVIVA account to manage orders and subscriptions.',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
