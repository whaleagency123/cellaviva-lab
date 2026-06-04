'use client'
import { useState } from 'react'
import { ApplicationGuide } from './ApplicationGuide'
import { Star, ThumbsUp, CheckCircle } from 'lucide-react'

const tabs = [
  { id: 'different', label: 'What Makes It Different?' },
  { id: 'how', label: 'How Do I Use It?' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'reviews', label: 'Reviews (1,247)' },
  { id: 'shipping', label: 'Shipping & Returns' },
]

const FULL_INGREDIENTS = [
  { name: 'Malus Domestica Fruit Cell Culture Extract', role: 'Plant Stem Cell Complex — follicle regeneration', highlight: true },
  { name: 'Phytol', role: 'DHT-suppressing anti-inflammatory from green tea chlorophyll', highlight: true },
  { name: 'Biotin (Vitamin B7)', role: 'Fermented biotin — keratin production support', highlight: true },
  { name: 'Caffeine', role: '5α-reductase inhibitor — blocks DHT at the follicle', highlight: true },
  { name: 'Serenoa Repens Fruit Extract (Saw Palmetto)', role: 'Natural 5α-reductase inhibitor', highlight: true },
  { name: 'Niacinamide', role: 'Scalp microcirculation booster, Vitamin B3', highlight: true },
  { name: 'Aqua (Purified Water)', role: 'Pharmaceutical-grade solvent base', highlight: false },
  { name: 'Cocamidopropyl Betaine', role: 'Gentle amphoteric surfactant (coconut-derived)', highlight: false },
  { name: 'Sodium Cocoyl Isethionate', role: 'Mild sulfate-free cleanser (coconut-derived)', highlight: false },
  { name: 'Glycerin', role: 'Plant-based humectant — moisture retention', highlight: false },
  { name: 'Panthenol (Pro-Vitamin B5)', role: 'Hair shaft conditioning — reduces breakage', highlight: false },
  { name: 'Arginine', role: 'Amino acid — structural protein synthesis', highlight: false },
  { name: 'Cetyl Alcohol', role: 'Fatty alcohol — emollient (coconut-derived)', highlight: false },
  { name: 'Guar Hydroxypropyltrimonium Chloride', role: 'Cationic guar — detangling and frizz control', highlight: false },
  { name: 'Sodium PCA', role: 'Natural moisturising factor — scalp hydration', highlight: false },
  { name: 'Aloe Barbadensis Leaf Juice', role: 'Soothing and hydrating', highlight: false },
  { name: 'Rosmarinus Officinalis (Rosemary) Leaf Extract', role: 'Antioxidant, circulation stimulant', highlight: false },
  { name: 'Menthol', role: 'Scalp cooling sensation — vasodilator', highlight: false },
  { name: 'Citric Acid', role: 'pH adjustment to 4.5–5.5', highlight: false },
  { name: 'Sodium Benzoate', role: 'Preservative (paraben-free, EWG: 1)', highlight: false },
  { name: 'Potassium Sorbate', role: 'Preservative (natural origin, EWG: 1)', highlight: false },
]

const REVIEWS = [
  {
    name: 'Sarah M.',
    location: 'London, UK',
    stars: 5,
    date: 'May 2026',
    title: 'I genuinely can\'t believe the results',
    body: 'I was losing clumps of hair every single morning. After 8 weeks of Stemuvita I can actually run my hand through my hair without panic. The shedding has reduced by probably 90%. My scalp also feels healthier and less irritated than it has in years.',
    helpful: 142,
    verified: true,
    photoLabel: '8 weeks in',
    avatarColor: 'from-[#52b788] to-[#1b4332]',
  },
  {
    name: 'James T.',
    location: 'Dublin, Ireland',
    stars: 5,
    date: 'May 2026',
    title: 'My barber asked what I changed',
    body: 'That\'s when I knew this was real. Hairline has visibly filled in since starting 12 weeks ago. I was sceptical because I\'d tried everything — Rogaine, biotin supplements, caffeine shampoos — and nothing worked like this. The difference is night and day.',
    helpful: 98,
    verified: true,
    photoLabel: '12 weeks',
    avatarColor: 'from-blue-400 to-blue-700',
  },
  {
    name: 'Amara L.',
    location: 'Lagos, Nigeria',
    stars: 5,
    date: 'April 2026',
    title: 'Postpartum shedding STOPPED',
    body: 'Postpartum hair loss is brutal and no one prepares you for it. I tried this on a whim after seeing it on Instagram. By week 6, shedding was almost completely gone. I now have little baby hairs growing along my hairline. I\'ve ordered 3 more bottles.',
    helpful: 231,
    verified: true,
    photoLabel: '6 weeks',
    avatarColor: 'from-amber-400 to-orange-600',
  },
  {
    name: 'Priya K.',
    location: 'Mumbai, India',
    stars: 4,
    date: 'April 2026',
    title: 'Works, but takes patience',
    body: 'Results weren\'t instant — I almost gave up at week 3. But by week 6 I could see the difference in the drain. Less hair, more volume, my ponytail feels thicker. Only giving 4 stars because I wish it was faster. But it absolutely works.',
    helpful: 67,
    verified: true,
    photoLabel: null,
    avatarColor: 'from-purple-400 to-purple-700',
  },
  {
    name: 'Elena V.',
    location: 'Mexico City, Mexico',
    stars: 5,
    date: 'March 2026',
    title: 'The cleanest shampoo I\'ve ever used',
    body: 'My scalp was so reactive to everything — itchy, flaky, oily fast. Within two washes of Stemuvita the itch was gone. Two months in and I wash my hair every 3 days instead of daily. The scalp health improvement alone is worth it even before counting the regrowth.',
    helpful: 54,
    verified: true,
    photoLabel: null,
    avatarColor: 'from-rose-400 to-rose-700',
  },
]

const RATING_DIST = [
  { stars: 5, pct: 83, count: 1035 },
  { stars: 4, pct: 11, count: 137 },
  { stars: 3, pct: 4, count: 50 },
  { stars: 2, pct: 1, count: 12 },
  { stars: 1, pct: 1, count: 13 },
]

const content: Record<string, React.ReactNode> = {
  different: (
    <div className="prose prose-sm max-w-none">
      <p className="text-gray-600 leading-relaxed mb-4">
        Stemuvita™ is the only hair cleanser on the market powered by <strong>botanical stem cell
        technology</strong> — extracted from plant cells that have the unique ability to regenerate and
        repair damaged tissue, including scalp tissue.
      </p>
      <ul className="space-y-2 text-gray-600">
        {[
          'Zero sulfates, parabens, silicones, or artificial fragrances',
          'Clinically proven in an 8-week independent study with 200 participants',
          'pH-balanced formula aligned with natural scalp chemistry (4.5–5.5)',
          'Biodegradable packaging — 100% sustainable and eco-friendly',
          'Vegan & cruelty-free — certified by PETA',
          'DHT-blocking ingredients: Saw Palmetto + Caffeine + Phytol complex',
          'Dermatologist-formulated and tested at an EU-accredited independent lab',
          '30-day money-back guarantee — no questions asked',
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-[#52b788] mt-0.5 flex-shrink-0">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  ),
  how: <ApplicationGuide />,
  ingredients: (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Active Key Ingredients</h3>
        <p className="text-xs text-gray-400">Highlighted in green — the core science behind Stemuvita™</p>
      </div>
      <div className="space-y-2 mb-8">
        {FULL_INGREDIENTS.map((ing) => (
          <div
            key={ing.name}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${ing.highlight ? 'bg-[#f0faf4] border border-[#b7e4c7]' : 'bg-gray-50'}`}
          >
            <span className={`flex-shrink-0 font-mono text-xs mt-0.5 ${ing.highlight ? 'text-[#2d6a4f]' : 'text-gray-400'}`}>
              {ing.highlight ? '★' : '·'}
            </span>
            <div>
              <p className={`font-semibold leading-tight ${ing.highlight ? 'text-[#1b4332]' : 'text-gray-700'}`}>{ing.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{ing.role}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500">
        <p className="font-semibold text-gray-700 mb-1">No compromises.</p>
        <p>Free from: sulfates (SLS/SLES), parabens, silicones, artificial fragrance, mineral oil, phthalates, formaldehyde, synthetic dyes, polyethylene glycol (PEG), triclosan.</p>
      </div>
    </div>
  ),
  reviews: (
    <div>
      {/* Rating summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        {/* Overall */}
        <div className="flex items-center gap-6">
          <div className="text-center flex-shrink-0">
            <p className="text-6xl font-black text-[#1b1b1b]">4.9</p>
            <div className="flex justify-center gap-0.5 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-400">1,247 reviews</p>
          </div>
          {/* Distribution */}
          <div className="flex-1 space-y-1.5">
            {RATING_DIST.map((r) => (
              <div key={r.stars} className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 w-3">{r.stars}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-gray-400 w-8 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Category ratings */}
        <div className="space-y-3">
          {[
            { label: 'Reduces Shedding', score: 4.9 },
            { label: 'Scalp Health', score: 4.8 },
            { label: 'Scent', score: 4.7 },
            { label: 'Value for Money', score: 4.6 },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3 text-sm">
              <span className="text-gray-600 w-36 flex-shrink-0">{c.label}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#52b788] rounded-full" style={{ width: `${(c.score / 5) * 100}%` }} />
              </div>
              <span className="text-gray-700 font-semibold w-8">{c.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-6">
        {REVIEWS.map((r) => (
          <div key={r.name} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${r.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {r.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{r.name}</p>
                    {r.verified && (
                      <span className="flex items-center gap-1 text-xs text-[#2d6a4f] font-medium">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{r.location} · {r.date}</p>
                </div>
              </div>
              {r.photoLabel && (
                <div className="flex-shrink-0 bg-[#d8f3dc] text-[#1b4332] text-xs font-bold px-2.5 py-1 rounded-full">
                  📸 {r.photoLabel}
                </div>
              )}
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < r.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
              ))}
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">{r.title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
            <div className="flex items-center gap-2 mt-3">
              <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({r.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-[#52b788] hover:text-[#2d6a4f] transition-colors">
        Load more reviews (1,242 remaining)
      </button>
    </div>
  ),
  shipping: (
    <div className="space-y-5 text-gray-600 text-sm leading-relaxed">
      <div>
        <h4 className="font-bold text-gray-900 mb-2">Free Shipping</h4>
        <p>
          We offer <strong>free standard shipping</strong> on all orders over $50 worldwide.
          Standard delivery takes 3–7 business days. Express shipping (1–3 days) is available at
          checkout for $9.99.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">Subscription Shipping</h4>
        <p>
          All <strong>Subscribe &amp; Save</strong> orders receive <strong>free priority shipping</strong> on every delivery, regardless of order value.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">30-Day Money-Back Guarantee</h4>
        <p>
          We stand behind every bottle. If for any reason you're not satisfied, contact us within <strong>30 days</strong> of delivery and we'll arrange a full refund —
          no questions asked. Products must be at least 50% unused. Return shipping is on us.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">90-Day Return Window</h4>
        <p>
          Changed your mind on an unopened product? We accept returns on any unopened, undamaged item within 90 days for a full refund.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">Order Tracking</h4>
        <p>
          Once your order ships you'll receive a confirmation email with a tracking link. You can
          also track your order anytime at{' '}
          <a href="/track-order" className="text-[#2d6a4f] underline">
            cellaviva.com/track-order
          </a>
          .
        </p>
      </div>
      <div className="bg-[#f0faf4] rounded-2xl p-4 border border-[#b7e4c7]">
        <p className="font-bold text-[#1b4332] mb-1">📦 Where We Ship</p>
        <p className="text-xs text-[#2d6a4f]">We ship to 40+ countries worldwide including the EU, UK, US, Canada, Australia, UAE, Nigeria, Singapore, and more. Duties may apply for non-EU deliveries.</p>
      </div>
    </div>
  ),
}

export function ProductTabs() {
  const [active, setActive] = useState('different')

  return (
    <div className="mt-16" id="reviews">
      {/* Tab headers */}
      <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
              active === tab.id
                ? 'border-[#2d6a4f] text-[#2d6a4f]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>{content[active]}</div>
    </div>
  )
}
