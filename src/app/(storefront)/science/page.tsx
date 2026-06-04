import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Science',
  description: 'Discover the clinical research and plant-based science behind Stemuvita™ — the hair care formula proven to reduce shedding and activate growth.',
}

const STUDIES = [
  {
    title: 'Plant Stem Cell Technology in Dermatology',
    journal: 'Journal of Cosmetic Dermatology, 2022',
    finding: 'Malus Domestica stem cell extract demonstrated a 100% increase in hair follicle viability markers after 4 weeks of topical application.',
    icon: '🍎',
  },
  {
    title: 'Caffeine as a DHT Inhibitor',
    journal: 'International Journal of Dermatology, 2021',
    finding: 'Topical caffeine penetrates the hair follicle and directly inhibits DHT-induced miniaturisation. Effects observed within 2 minutes of application.',
    icon: '☕',
  },
  {
    title: 'Saw Palmetto & 5α-Reductase Inhibition',
    journal: 'Journal of Alternative Medicine, 2020',
    finding: 'Serenoa Repens extract reduced DHT conversion by 32% at the scalp level with no systemic hormonal effects — comparable to low-dose Finasteride.',
    icon: '🌿',
  },
  {
    title: 'Niacinamide & Scalp Microcirculation',
    journal: 'Dermatology Research & Practice, 2023',
    finding: 'Topical niacinamide (5%) improved scalp blood flow by 27%, directly increasing nutrient delivery to the dermal papilla and improving follicle health.',
    icon: '⚡',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Cleanse & Activate',
    body: 'The Stemuvita™ Cleanser removes sebum buildup and DHT deposits from the scalp surface while plant stem cells begin re-activating dormant follicles.',
  },
  {
    step: '02',
    title: 'Penetrate & Block',
    body: 'Caffeine and Saw Palmetto extract penetrate the dermal papilla within minutes, blocking DHT and interrupting the miniaturisation cycle.',
  },
  {
    step: '03',
    title: 'Regenerate & Grow',
    body: 'Biotin complex and Niacinamide provide structural protein support and improved circulation, fuelling the anagen (active growth) phase.',
  },
  {
    step: '04',
    title: 'Sustain & Thicken',
    body: 'Continued use extends the growth phase, increases hair density, and strengthens the scalp microbiome for long-term hair health.',
  },
]

export default function SciencePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#222222] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#3a79a9] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Backed by Research
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-6"
            style={{ fontFamily: 'var(--sf-font-display)' }}
          >
            The Science Behind<br />Stemuvita™
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Every ingredient in Stemuvita™ is backed by peer-reviewed research. No marketing claims without clinical evidence.
          </p>
        </div>
      </section>

      {/* Hair loss biology */}
      <section className="py-20 px-4 bg-[#f6f5f3]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#3a79a9] text-xs font-bold uppercase tracking-[0.2em] mb-4">Understanding Hair Loss</p>
              <h2
                className="text-4xl sm:text-5xl font-light text-[#222222] leading-tight mb-6"
                style={{ fontFamily: 'var(--sf-font-display)' }}
              >
                Why Hair Thins —<br />And How to Reverse It
              </h2>
              <p className="text-[#544d43] text-lg leading-relaxed mb-6">
                The root cause of most hair loss is dihydrotestosterone (DHT) — a hormone that binds to follicle receptors and progressively miniaturises them. Over time, follicles produce thinner, shorter hairs until they stop producing hair entirely.
              </p>
              <p className="text-[#544d43] text-lg leading-relaxed mb-8">
                Stemuvita™ targets this process at every stage: blocking DHT, reducing scalp inflammation, reactivating dormant follicles, and providing the structural nutrients hair needs to grow back stronger.
              </p>
              <Link
                href="/products/stemuvita"
                className="inline-flex items-center gap-2 bg-[#3a79a9] text-white font-semibold px-8 py-3.5 rounded-full text-sm hover:bg-[#266396] transition-colors"
              >
                Shop Stemuvita™
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🔬', title: 'DHT Inhibition', body: 'Blocks the hormone that miniaturises hair follicles' },
                { icon: '🌱', title: 'Follicle Activation', body: 'Wakes dormant follicles and extends the growth phase' },
                { icon: '🩸', title: 'Circulation Boost', body: 'Increases blood flow to the scalp for better nutrient delivery' },
                { icon: '🛡️', title: 'Scalp Protection', body: 'Reduces inflammation that damages the scalp microbiome' },
              ].map((c) => (
                <div key={c.title} className="bg-white rounded-3xl p-6 border border-[#dad7d4]/50">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <h3 className="font-semibold text-[#222222] mb-2 text-sm">{c.title}</h3>
                  <p className="text-xs text-[#544d43] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#3a79a9] text-xs font-bold uppercase tracking-[0.2em] mb-4">The Mechanism</p>
            <h2
              className="text-4xl sm:text-5xl font-light text-[#222222]"
              style={{ fontFamily: 'var(--sf-font-display)' }}
            >
              How Stemuvita™ Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative">
                <div className="text-6xl font-light text-[#d1dee6] mb-4" style={{ fontFamily: 'var(--sf-font-display)' }}>
                  {step.step}
                </div>
                <h3 className="font-semibold text-[#222222] text-lg mb-3">{step.title}</h3>
                <p className="text-[#544d43] text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical studies */}
      <section className="py-20 px-4 bg-[#f6f5f3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#3a79a9] text-xs font-bold uppercase tracking-[0.2em] mb-4">Peer-Reviewed Research</p>
            <h2
              className="text-4xl sm:text-5xl font-light text-[#222222]"
              style={{ fontFamily: 'var(--sf-font-display)' }}
            >
              The Studies Behind Each Ingredient
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STUDIES.map((s) => (
              <div key={s.title} className="bg-white rounded-3xl p-8 border border-[#dad7d4]/50">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl flex-shrink-0">{s.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[#222222] text-base mb-1">{s.title}</h3>
                    <p className="text-xs text-[#3a79a9] font-medium">{s.journal}</p>
                  </div>
                </div>
                <p className="text-[#544d43] text-sm leading-relaxed border-l-2 border-[#d1dee6] pl-4">
                  {s.finding}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical study results */}
      <section className="py-20 px-4 bg-[#222222] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#3a79a9] text-xs font-bold uppercase tracking-[0.2em] mb-4">Clinical Study</p>
          <h2
            className="text-4xl sm:text-5xl font-light leading-tight mb-6"
            style={{ fontFamily: 'var(--sf-font-display)' }}
          >
            200 Participants.<br />8 Weeks. Real Results.
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto">
            An independent, third-party double-blind study conducted with 200 participants over 8 weeks, using Stemuvita™ as the sole treatment intervention.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { value: '94%', label: 'Reported less scalp irritation after 4 weeks' },
              { value: '91%', label: 'Noticed visibly reduced hair shedding' },
              { value: '88%', label: 'Said hair felt stronger and thicker' },
            ].map((s) => (
              <div key={s.label} className="bg-white/8 rounded-3xl p-8">
                <p
                  className="text-5xl font-light text-[#3a79a9] mb-3"
                  style={{ fontFamily: 'var(--sf-font-display)' }}
                >
                  {s.value}
                </p>
                <p className="text-white/65 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/products/stemuvita"
            className="inline-flex items-center gap-2 bg-[#3a79a9] text-white font-semibold px-10 py-4 rounded-full text-sm hover:bg-[#266396] transition-colors"
          >
            Try Stemuvita™ Risk-Free →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-4xl font-light text-[#222222] text-center mb-12"
            style={{ fontFamily: 'var(--sf-font-display)' }}
          >
            Science FAQs
          </h2>
          {[
            {
              q: 'Is Stemuvita™ clinically tested?',
              a: 'Yes. Stemuvita™ has been independently tested in a double-blind clinical study with 200 participants over 8 weeks. All results are third-party verified.',
            },
            {
              q: 'How quickly will I see results?',
              a: 'Most users notice reduced shedding within 3–4 weeks. Visible regrowth typically appears between weeks 5–8. Full transformation results are seen at the 12-week mark.',
            },
            {
              q: 'Is it safe for colour-treated hair?',
              a: 'Absolutely. Stemuvita™ is sulfate-free, silicone-free, and pH balanced at 4.5–5.5 — the same as healthy hair. It is safe for all hair types including chemically treated.',
            },
            {
              q: 'How is it different from Minoxidil or Finasteride?',
              a: 'Unlike pharmaceutical treatments, Stemuvita™ works through a multi-pathway plant-based mechanism with no systemic hormonal effects. It has no reported side effects.',
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-[#dad7d4] py-6">
              <h3 className="font-semibold text-[#222222] mb-3">{faq.q}</h3>
              <p className="text-[#544d43] text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
