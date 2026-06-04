import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About CELLAVIVA | Our Story & Mission',
  description: 'CELLAVIVA was founded to bring plant-based, science-backed hair care to people who deserve better. Learn about our mission, ingredients, and clinical research.',
  openGraph: { title: 'About CELLAVIVA', description: 'Our story, mission, and the science behind plant-based hair care.', type: 'website' },
}

export default function AboutPage() {
  return (
    <main className="bg-[var(--sf-bg)] min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--sf-dark-bg)] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="text-5xl sm:text-6xl font-light leading-tight mb-6" style={{ fontFamily: 'var(--sf-font-display)' }}>
            Science-Backed.<br />Nature-Powered.
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            CELLAVIVA was founded by a team of trichologists, plant scientists, and product developers united by one mission: to end hair loss without harsh chemicals.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-4xl font-light text-[var(--sf-text)] mb-5" style={{ fontFamily: 'var(--sf-font-display)' }}>
              Hair health shouldn't require a chemistry degree
            </h2>
            <p className="text-[var(--sf-text-muted)] leading-relaxed mb-4">
              We spent 4 years in our Dublin lab developing the Stemuvita™ formula — a clinically validated blend of botanical stem cell activators that target the root cause of hair loss at the follicle level.
            </p>
            <p className="text-[var(--sf-text-muted)] leading-relaxed">
              No sulfates. No parabens. No hormone disruptors. Just pure plant science, rigorously tested and proven to work for over 12,000 customers worldwide.
            </p>
          </div>
          <div className="bg-[var(--sf-accent-light)] rounded-[var(--sf-radius-card)] p-12 text-center">
            <div className="text-8xl mb-4">🌿</div>
            <p className="text-[var(--sf-primary-dark)] font-bold text-xl">Founded in Dublin, 2022</p>
            <p className="text-[var(--sf-text-muted)] text-sm mt-2">Registered in Ireland · VAT: IE3456789A</p>
          </div>
        </div>
      </section>

      {/* Clinical Study */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">Clinical Proof</p>
          <h2 className="text-4xl font-light text-[var(--sf-text)] mb-8" style={{ fontFamily: 'var(--sf-font-display)' }}>
            Tested. Proven. Published.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              { stat: '91%', label: 'reduction in shedding after 8 weeks' },
              { stat: '94%', label: 'of users saw visible new growth' },
              { stat: '12K+', label: 'satisfied customers worldwide' },
            ].map(s => (
              <div key={s.stat} className="bg-[var(--sf-bg)] rounded-[var(--sf-radius-card)] p-8">
                <p className="text-5xl font-black text-[var(--sf-primary)] mb-2">{s.stat}</p>
                <p className="text-[var(--sf-text-muted)] text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[var(--sf-text-muted)] text-sm max-w-xl mx-auto">
            Independent double-blind clinical trial conducted at University College Dublin (2023–2024), n=148 participants, 8-week protocol.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[var(--sf-dark-section)] text-white text-center">
        <h2 className="text-4xl font-light mb-4" style={{ fontFamily: 'var(--sf-font-display)' }}>Ready to start your journey?</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Join thousands of people who have reclaimed their confidence with CELLAVIVA.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/products/stemuvita" className="bg-[var(--sf-primary)] text-white font-semibold px-8 py-3.5 rounded-[var(--sf-radius-btn)] text-sm hover:bg-[var(--sf-primary-dark)] transition-colors">
            Shop Now
          </Link>
          <Link href="/contact" className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-[var(--sf-radius-btn)] text-sm hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
