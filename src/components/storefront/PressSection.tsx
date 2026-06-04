import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { PressItem } from '@/types'
import { DEFAULT_SETTINGS } from '@/lib/defaults'

interface PressSectionProps {
  items?: PressItem[]
}

export function PressSection({ items = DEFAULT_SETTINGS.pressItems }: PressSectionProps) {
  return (
    <section className="py-12 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">As Seen In</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {items.map((p) => (
              <span key={p.name} className={`${p.style} text-gray-300 hover:text-gray-500 transition-colors duration-300 cursor-default select-none`}>
                {p.name}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
