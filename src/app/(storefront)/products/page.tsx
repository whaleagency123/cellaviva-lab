import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { SearchInput } from './SearchInput'
import { ProductCard } from './ProductCard'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Shop the full Stemuvita™ plant-based hair care routine.',
}

const BADGES = ['100% Plant-Based', 'Clinically Tested', 'Cruelty-Free & Vegan', 'Sulfate-Free']

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = (q ?? '').toLowerCase().trim()

  const dbProducts = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
  }).catch(() => [])

  const products = query
    ? dbProducts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query))
    : dbProducts

  return (
    <div className="min-h-screen bg-[#f8f9f4]">
      <div className="bg-[var(--sf-dark-bg)] text-white py-16 text-center px-4">
        <p className="text-[var(--sf-accent-light)] font-semibold text-sm uppercase tracking-widest mb-3">The Routine</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">All Products</h1>
        <p className="text-white/70 max-w-lg mx-auto text-lg">
          Two products. One complete scalp routine. Visible results in 4 weeks.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {BADGES.map(b => (
            <span key={b} className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold">{b}</span>
          ))}
        </div>
        <Suspense><SearchInput defaultValue={q} /></Suspense>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl font-black text-gray-300 mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
            <Link href="/products" className="mt-5 inline-block text-sm text-[var(--sf-primary)] hover:underline font-semibold">Clear search</Link>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        <div className="mt-12 bg-[var(--sf-dark-bg)] rounded-3xl p-8 sm:p-10 text-white text-center">
          <p className="text-[var(--sf-accent-light)] font-semibold text-sm uppercase tracking-widest mb-3">Best Value</p>
          <h3 className="text-3xl font-black mb-3">Get the Complete Routine</h3>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">
            Use the Hair Cleanse and Scalp Serum together for maximum results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="accent" asChild>
              <Link href="/products/stemuvita">Shop Hair Cleanse</Link>
            </Button>
            <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20" asChild>
              <Link href="/products/stemuvita-serum">Shop Scalp Serum</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
