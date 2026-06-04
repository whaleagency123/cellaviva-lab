'use client'
import Link from 'next/link'
import { CheckCircle, Leaf, RefreshCw, Gift } from 'lucide-react'

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--sf-bg)] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-[var(--sf-accent-light)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[var(--sf-primary)]" />
        </div>

        <h1 className="text-3xl font-bold text-[var(--sf-text)] mb-3" style={{ fontFamily: 'var(--sf-font-display)' }}>
          You're Subscribed! 🎉
        </h1>
        <p className="text-[var(--sf-text-muted)] mb-8">
          Welcome to the CELLAVIVA family. Your first order is being prepared and you'll receive a
          confirmation email shortly.
        </p>

        {/* What's next */}
        <div className="bg-white rounded-3xl border border-[var(--sf-border)] p-6 mb-8 text-left">
          <h3 className="font-bold text-[var(--sf-text)] mb-4">What happens next?</h3>
          <div className="space-y-4">
            {[
              { icon: Leaf,      title: 'First delivery',     desc: 'Your first order ships within 1-2 business days.' },
              { icon: RefreshCw, title: 'Auto-renewal',       desc: 'You\'ll be charged automatically every 30 days.' },
              { icon: Gift,      title: 'Manage anytime',     desc: 'Pause, skip or cancel from your account page.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--sf-accent-light)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[var(--sf-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--sf-text)] text-sm">{title}</p>
                  <p className="text-xs text-[var(--sf-text-muted)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account"
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--sf-primary)] text-white font-semibold rounded-full text-sm hover:bg-[var(--sf-primary-dark)] transition-colors"
          >
            Manage My Subscription
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-[var(--sf-border)] text-[var(--sf-text)] font-semibold rounded-full text-sm hover:border-[var(--sf-primary)] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
