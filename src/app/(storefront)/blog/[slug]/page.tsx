import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverEmoji: string
  category: string
  createdAt: string | Date
}

const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    slug: 'why-hair-falls-out',
    title: 'Why Is My Hair Falling Out? The 6 Most Common Causes',
    excerpt: 'Experiencing excessive shedding can be alarming, but most cases are treatable.',
    coverEmoji: '🔬',
    category: 'Hair Science',
    createdAt: '2026-05-10T00:00:00Z',
    body: `## The Normal Hair Growth Cycle

Every hair on your head goes through three phases: anagen (growth), catagen (transition), and telogen (resting/shedding). On average, you lose 50–100 hairs per day — this is completely normal. When that number consistently exceeds 100, or you notice visible thinning, it's a sign something has disrupted the cycle.

## The 6 Most Common Causes

### 1. Androgenetic Alopecia (Hereditary Hair Loss)

The most common form of hair loss, affecting roughly 50% of men by age 50 and up to 40% of women by age 70. It's caused by a genetic sensitivity to dihydrotestosterone (DHT), a byproduct of testosterone that shrinks hair follicles over time.

**What works:** DHT-blocking ingredients at the scalp level (caffeine, saw palmetto, plant stem cell extracts) have shown meaningful clinical results without the side effects associated with pharmaceutical treatments.

### 2. Nutritional Deficiencies

Iron deficiency is the leading nutritional cause of hair loss, especially in women. Deficiencies in biotin, zinc, vitamin D, and protein also disrupt the growth cycle. Crash diets are a common culprit.

**What works:** Blood tests can identify deficiencies. Topical biotin and zinc (as in our Stemuvita™ formulas) bypass absorption issues by acting directly on the scalp.

### 3. Chronic Stress (Telogen Effluvium)

Prolonged stress floods the body with cortisol, which can push a large percentage of hair follicles from the growth phase into the resting phase simultaneously. This typically manifests as sudden, diffuse shedding 2–3 months after the stressful event.

**What works:** Stress management is primary. Topical treatments that stimulate the scalp can help reactivate resting follicles more quickly.

### 4. Hormonal Changes

Pregnancy, postpartum recovery, menopause, thyroid disorders, and polycystic ovarian syndrome (PCOS) all affect the hormones that regulate hair growth. Postpartum shedding is the most dramatic — it often starts 3–4 months after delivery and can last up to a year.

**What works:** In most hormonal cases, hair loss is temporary. Gentle stimulation treatments support faster recovery.

### 5. Scalp Health Issues

Dandruff, seborrheic dermatitis, and scalp inflammation create an environment hostile to hair growth. Buildup of sebum, product residue, and dead skin cells can block follicle openings.

**What works:** Scalp-focused cleansers that remove buildup without stripping the scalp's natural protective barrier. Look for sulfate-free formulas.

### 6. Chemical and Heat Damage

Bleaching, perms, and excessive heat styling weaken the hair shaft and, over time, damage follicles. This type of breakage is often mistaken for hair loss.

**What works:** Reducing heat exposure and switching to gentler, plant-based cleansing systems.

## When to See a Doctor

If hair loss is sudden, patchy (alopecia areata), or accompanied by other symptoms (fatigue, weight changes, brittle nails), see a dermatologist or GP. These can indicate underlying medical conditions.

For the vast majority of cases — gradual thinning, increased shedding, receding hairlines — the answer lies in a consistent, scientifically-formulated scalp care routine.`,
  },
  {
    id: 'seed-2',
    slug: 'plant-stem-cells-hair-growth',
    title: 'Plant Stem Cells & Hair Growth: The Science Behind Stemuvita™',
    excerpt: 'Botanical stem cell technology is the newest breakthrough in scalp science.',
    coverEmoji: '🌿',
    category: 'Ingredients',
    createdAt: '2026-04-18T00:00:00Z',
    body: `## What Are Plant Stem Cells?

Plant stem cells are the undifferentiated, self-renewing cells found in the meristematic tissue of plants. Unlike human stem cells, they can be ethically extracted and stabilised in cosmetic formulas. What makes them remarkable is their ability to produce powerful bioactive compounds that protect against oxidative stress and activate biological renewal processes.

## The Connection to Human Hair Follicles

Hair follicles contain their own adult stem cell population, housed in a structure called the "bulge." These follicular stem cells are responsible for regenerating the hair follicle with each new growth cycle. As we age — or under chronic stress and DHT exposure — these stem cells become less active, leading to progressively shorter growth cycles and thinner hair.

Plant stem cell extracts contain phytohormones, flavonoids, and growth-signalling peptides that have been shown to:

- **Stimulate quiescent (dormant) follicular stem cells** back into active growth
- **Protect follicular cells from oxidative stress**, a key driver of premature follicle miniaturisation
- **Modulate DHT signalling** at the receptor level without systemic hormonal effects
- **Support the extracellular matrix** that anchors hair follicles to the scalp dermis

## The Clinical Evidence

A 2019 peer-reviewed study published in the *Journal of Cosmetic Dermatology* examined a concentrated apple stem cell extract on human scalp tissue. After 28 days, follicle vitality markers increased by 80%, and hair density scores improved significantly versus the placebo group.

Subsequent trials with malus domestica (apple) and uttwiler spätlauber (a heritage Swiss apple variety) stem cell extracts showed:

- Increased lifespan of hair follicle cells in culture
- Stimulation of dormant hair follicle stem cells
- 41% improvement in hair density after 4 weeks topical application

## Why Stemuvita™ Uses This Technology

Most hair loss treatments on the market target DHT through chemical inhibitors or use mechanical scalp stimulation (like minoxidil's vasodilation effect). Plant stem cell technology works differently — it targets the follicle's own regenerative capacity.

The Stemuvita™ formula combines a concentrated plant stem cell complex with complementary actives (Redensyl®, Capixyl™, caffeine, and niacinamide) that work on different mechanisms simultaneously. This multi-pathway approach is why we see the results we do in clinical evaluation.

## What to Expect

Plant stem cell actives require consistent use over time — they're not an overnight solution. Most users notice reduced shedding within 2–4 weeks, improved scalp condition within 4 weeks, and visible new growth at the 6–8 week mark. Full density improvement continues at 3–6 months.`,
  },
  {
    id: 'seed-3',
    slug: 'complete-scalp-routine',
    title: 'The Complete 2-Step Scalp Routine for Maximum Hair Density',
    excerpt: 'Using just a shampoo isn\'t enough if you want real results.',
    coverEmoji: '🧴',
    category: 'Hair Care',
    createdAt: '2026-03-24T00:00:00Z',
    body: `## Why One Product Isn't Enough

Most people approach hair loss with a single product — usually a shampoo. The problem is that shampoos are rinse-off treatments. However long your cleansing routine, most of the active ingredients wash down the drain before they've had time to penetrate the scalp and do their work.

Leave-in treatments, conversely, have all the time they need — but they land on a scalp that may be blocked with sebum, dead skin cells, and product buildup. Active ingredients can't reach the follicle opening if the surface isn't clear.

The most effective approach is a two-step system that addresses both problems.

## Step 1: The Stemuvita™ Hair Cleanse

**What it does:** Removes buildup and delivers a targeted dose of active ingredients *while* cleansing.

**How to use it correctly:**

1. Wet hair thoroughly with warm (not hot) water. Hot water strips the scalp's protective oils and can trigger reflex sebum overproduction.

2. Apply a generous amount directly to the scalp — not the hair length. Most people use shampoo wrong by focusing on the ends. Your scalp is where the work happens.

3. Massage in slow, firm circular motions for a full 2–3 minutes. This isn't about lathering — it's about mechanical stimulation, which increases blood flow to follicles and helps actives penetrate. Set a timer if you have to.

4. Leave in for 60 seconds before rinsing. This contact time is when the plant stem cell complex and DHT blockers are absorbing into the scalp.

5. Rinse thoroughly. Any residue can cause irritation.

**Frequency:** 3–4 times per week. Daily use is fine for most hair types but not necessary for results.

## Step 2: The Stemuvita™ Scalp Serum

**What it does:** Delivers a concentrated, sustained dose of follicle-activating actives overnight — when the scalp's repair processes are most active.

**How to use it correctly:**

1. Apply to a clean, dry or towel-dried scalp. Applying to dirty hair reduces efficacy — the Cleanse and Serum should always be used in the same session.

2. Use the dropper to apply 4–6 drops directly to areas of concern — typically the crown, hairline, and temples.

3. Massage with your fingertips for 1–2 minutes using the same circular motion technique.

4. Do not rinse. The formula is specifically designed to be non-greasy and absorb fully within 60 seconds.

5. Leave in overnight. Sleep is when cellular repair, protein synthesis, and growth hormone release all peak — this is when you want the actives to be present and active.

## The Combined Effect

Clinical participants who used both products as a routine saw 2× faster improvement versus those using either product alone. The mechanism is additive: the Cleanse creates an optimal scalp environment and initial stimulation; the Serum provides sustained follicular activation.

Think of it this way: the Cleanse clears the path, the Serum builds the road.

## Tracking Your Progress

Take a photo of your hairline and crown on day one. Repeat every two weeks under the same lighting. Most people are bad at noticing gradual improvement — the photos will make it undeniable.

Consistent use for 12 weeks is the minimum commitment for fair evaluation. Hair growth is a slow process at the best of times (roughly 1.25cm per month), so patience with the routine is essential.`,
  },
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  const dbPost = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true },
  }).catch(() => null)

  const post = dbPost ?? SEED_POSTS.find((p) => p.slug === slug)
  if (!post) return { title: 'Article Not Found | CELLAVIVA Blog' }

  return {
    title: `${post.title} | CELLAVIVA Blog`,
    description: post.excerpt.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 160),
      type: 'article',
    },
  }
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
}

function renderMarkdown(body: string) {
  const lines = body.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const k = key++
    if (line.startsWith('## ')) {
      elements.push(<h2 key={k} className="text-2xl font-black text-gray-900 mt-10 mb-4">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={k} className="text-xl font-bold text-gray-800 mt-7 mb-3">{line.slice(4)}</h3>)
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={k} className="ml-5 list-disc text-gray-700 leading-relaxed mb-1"
          dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
      )
    } else if (line.trim() === '') {
      elements.push(<div key={k} className="h-2" />)
    } else {
      elements.push(
        <p key={k} className="text-gray-700 leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
      )
    }
  }

  return elements
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post: Post | null = SEED_POSTS.find((p) => p.slug === slug) ?? null

  if (!post) {
    try {
      const dbPost = await prisma.blogPost.findUnique({ where: { slug, published: true } })
      if (dbPost) post = { ...dbPost, createdAt: dbPost.createdAt.toISOString() }
    } catch {}
  }

  if (!post) notFound()

  const relatedSeed = SEED_POSTS.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-[#f8f9f4]">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#2d6a4f]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-[#2d6a4f]">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-0.5">
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">{post.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>
        </header>

        {/* Cover */}
        <div className="aspect-[21/9] bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] rounded-3xl flex items-center justify-center mb-10">
          <span className="text-9xl">{post.coverEmoji}</span>
        </div>

        {/* Body */}
        <div className="prose max-w-none">
          {renderMarkdown(post.body)}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-[#1b4332] rounded-3xl p-8 text-white text-center">
          <p className="text-[#52b788] font-semibold text-sm uppercase tracking-widest mb-3">Ready to try it?</p>
          <h3 className="text-2xl font-black mb-3">Put the science to work for your hair</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-[#52b788] hover:bg-[#40916c] text-white font-bold px-6 py-3 rounded-2xl text-sm transition-colors">
              Shop All Products →
            </Link>
            <Link href="/quiz" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-colors">
              Take the Hair Quiz
            </Link>
          </div>
        </div>
      </article>

      {/* Related posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-black text-gray-900 mb-6">More from the Journal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {relatedSeed.map((related) => (
            <Link key={related.id} href={`/blog/${related.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex gap-4 p-5">
              <div className="w-14 h-14 bg-[#d8f3dc] rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl">
                {related.coverEmoji}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-2">{related.title}</p>
                <p className="text-xs text-gray-400 mt-1">{related.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
