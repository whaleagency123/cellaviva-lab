import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { IngredientItem } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

const CERTIFICATIONS = [
  { label: '100% Vegan', icon: '🌱' },
  { label: 'Cruelty-Free', icon: '🐰' },
  { label: 'Sulfate-Free', icon: '✅' },
  { label: 'Paraben-Free', icon: '✅' },
  { label: 'Silicone-Free', icon: '✅' },
  { label: 'Dermatologist Tested', icon: '👨‍⚕️' },
  { label: 'pH Balanced 4.5–5.5', icon: '⚗️' },
  { label: 'Recyclable Packaging', icon: '♻️' },
]

interface IngredientsSectionProps {
  ingredients?: IngredientItem[]
}

export function IngredientsSection({ ingredients = DEFAULT_SETTINGS.ingredients }: IngredientsSectionProps) {
  return (
    <section className="py-24 bg-[var(--sf-dark-section)] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="text-xs font-bold text-[var(--sf-primary)] uppercase tracking-[0.2em] mb-3">The Science</p>
          <h2 className="text-4xl sm:text-5xl font-light leading-tight" style={{ fontFamily: 'var(--sf-font-display)' }}>
            Every Ingredient Has<br className="hidden sm:block" /> A Reason to Be There
          </h2>
          <p className="mt-4 text-white/55 max-w-xl mx-auto text-lg">
            No fillers. No fragrance. No marketing fluff. Just clinically-active ingredients chosen for one purpose: making your hair grow back.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {ingredients.map((ing, i) => (
            <ScrollReveal key={ing.id} direction="up" delay={i * 80}>
              <div className={`rounded-[var(--sf-radius-card)] p-6 h-full transition-all card-tilt ${ing.highlight ? 'bg-[var(--sf-primary)] text-white' : 'bg-white/8 text-white hover:bg-white/12'}`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{ing.icon}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">{ing.role}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{ing.name}</h3>
                <p className={`text-xs mb-3 font-medium ${ing.highlight ? 'text-white/70' : 'text-white/45'}`}>Source: {ing.source}</p>
                <p className={`text-sm leading-relaxed ${ing.highlight ? 'text-white/85' : 'text-white/65'}`}>{ing.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up">
          <div className="bg-white/8 rounded-[var(--sf-radius-card)] p-8 mb-10">
            <h3 className="text-lg font-semibold text-center mb-6 text-[var(--sf-primary)]">What You Will NEVER Find in Stemuvita™</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Sulfates (SLS/SLES)', 'Parabens', 'Silicones', 'Artificial Fragrances', 'Mineral Oil', 'Phthalates', 'Formaldehyde', 'Synthetic Dyes', 'Polyethylene Glycol', 'Triclosan'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 bg-white/8 rounded-full px-3.5 py-1.5 text-sm text-white/65">
                  <span className="text-red-400">✗</span> {item}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={80}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CERTIFICATIONS.map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2 bg-white/8 rounded-2xl px-3 py-4 text-center">
                <span className="text-2xl">{c.icon}</span>
                <p className="text-xs font-semibold text-white/75 leading-tight">{c.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
