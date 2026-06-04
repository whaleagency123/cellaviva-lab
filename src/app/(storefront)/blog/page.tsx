import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Hair Care Blog | CELLAVIVA',
  description: 'Expert guides on hair loss, scalp health, and plant-based hair care from the CELLAVIVA team.',
}

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  coverEmoji: string
  category: string
  createdAt: string | Date
}

const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    slug: 'why-hair-falls-out',
    title: 'Why Is My Hair Falling Out? The 6 Most Common Causes',
    excerpt: 'Experiencing excessive shedding can be alarming, but most cases are treatable. Here\'s what the science says about the top causes of hair loss in men and women — and what actually works.',
    coverEmoji: '🔬',
    category: 'Hair Science',
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'seed-2',
    slug: 'plant-stem-cells-hair-growth',
    title: 'Plant Stem Cells & Hair Growth: The Science Behind Stemuvita™',
    excerpt: 'Botanical stem cell technology is the newest breakthrough in scalp science. We break down exactly how it works, what the clinical evidence shows, and why it outperforms traditional ingredients.',
    coverEmoji: '🌿',
    category: 'Ingredients',
    createdAt: '2026-04-18T00:00:00Z',
  },
  {
    id: 'seed-3',
    slug: 'complete-scalp-routine',
    title: 'The Complete 2-Step Scalp Routine for Maximum Hair Density',
    excerpt: 'Using just a shampoo isn\'t enough if you want real results. Here\'s the exact routine used by our clinical study participants — the ones who saw 91% reduction in shedding.',
    coverEmoji: '🧴',
    category: 'Hair Care',
    createdAt: '2026-03-24T00:00:00Z',
  },
]

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Hair Science': 'bg-blue-100 text-blue-700',
  'Ingredients': 'bg-emerald-100 text-emerald-700',
  'Hair Care': 'bg-amber-100 text-amber-700',
  'Results': 'bg-purple-100 text-purple-700',
}

export default async function BlogPage() {
  let posts: Post[] = SEED_POSTS
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, slug: true, title: true, excerpt: true, coverEmoji: true, category: true, createdAt: true },
    })
    if (dbPosts.length > 0) posts = dbPosts.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))
  } catch {}

  return (
    <div className="min-h-screen bg-[#f8f9f4]">
      {/* Hero */}
      <div className="bg-[#1b4332] text-white py-20 text-center px-4">
        <p className="text-[#52b788] font-semibold text-sm uppercase tracking-widest mb-3">The CELLAVIVA Journal</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Hair Care Science, Simplified</h1>
        <p className="text-white/70 max-w-lg mx-auto text-lg">
          Expert-backed guides on hair loss, scalp health, and the plant science behind healthy hair.
        </p>
      </div>

      {/* Posts grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              {/* Cover */}
              <div className="aspect-[16/9] bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] flex items-center justify-center">
                <span className="text-7xl">{post.coverEmoji}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                </div>
                <h2 className="text-lg font-black text-gray-900 mb-2 group-hover:text-[#2d6a4f] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                <p className="mt-4 text-sm font-semibold text-[#2d6a4f] group-hover:underline">Read more →</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 bg-[#1b4332] rounded-3xl p-8 text-white text-center">
          <p className="text-[#52b788] font-semibold text-sm uppercase tracking-widest mb-3">Ready to start?</p>
          <h3 className="text-2xl font-black mb-3">See the products behind the science</h3>
          <Link href="/products" className="inline-flex items-center gap-2 bg-[#52b788] hover:bg-[#40916c] text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-colors">
            Shop All Products →
          </Link>
        </div>
      </div>
    </div>
  )
}
