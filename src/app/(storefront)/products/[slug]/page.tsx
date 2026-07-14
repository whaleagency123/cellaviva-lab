'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Star, ShieldCheck, Truck, RefreshCw, ChevronRight,
  Minus, Plus, Share2, CheckCircle2, Loader2,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { WishlistButton } from '@/components/storefront/WishlistButton'

// ─── Static product data (matches products/page.tsx) ─────────────────────────
const ALL_PRODUCTS: Product[] = [
  {
    id: 'prod_stemuvita_01',
    slug: 'stemuvita',
    title: 'Stemuvita™ Hair Cleanse',
    description:
      'Our flagship plant-based scalp cleanser powered by botanical stem cell technology. Gently removes buildup while delivering targeted nourishment deep into hair follicles. Clinically proven to reduce shedding by 91% in 8 weeks.',
    price: 100,
    salePrice: 49,
    stock: 47,
    images: ['/images/stemuvita-1.svg'],
    featured: true,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod_stemuvita_serum_01',
    slug: 'stemuvita-serum',
    title: 'Stemuvita™ Scalp Serum',
    description:
      'The perfect complement to the Hair Cleanse. This concentrated leave-in serum delivers a powerful dose of plant stem cell actives directly to the scalp, stimulating follicle health and accelerating the regrowth cycle overnight.',
    price: 80,
    salePrice: 42,
    stock: 63,
    images: ['/images/serum-1.svg'],
    featured: false,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const PRODUCT_DETAILS: Record<string, {
  benefits: string[]
  ingredients: { name: string; benefit: string }[]
  howToUse: string[]
  faqs: { q: string; a: string }[]
}> = {
  stemuvita: {
    benefits: [
      '91% reduction in hair shedding in 8 weeks',
      'Activates dormant follicles with plant stem cell technology',
      'Sulfate-free, pH-balanced formula safe for daily use',
      'Reduces scalp inflammation and DHT buildup',
      'Suitable for all hair types including colour-treated hair',
    ],
    ingredients: [
      { name: 'Plant Stem Cell Extract', benefit: 'Reactivates dormant follicles' },
      { name: 'Caffeine Complex', benefit: 'Blocks DHT at the scalp' },
      { name: 'Saw Palmetto', benefit: 'Natural 5α-Reductase inhibitor' },
      { name: 'Niacinamide (B3)', benefit: 'Boosts scalp microcirculation' },
      { name: 'Aloe Vera', benefit: 'Soothes and hydrates the scalp' },
      { name: 'Biotin', benefit: 'Strengthens the hair shaft' },
    ],
    howToUse: [
      'Wet hair thoroughly with warm water',
      'Apply a generous amount to the scalp and massage in circular motions for 2–3 minutes',
      'Leave in for 60 seconds to allow actives to penetrate',
      'Rinse thoroughly and follow with Scalp Serum for best results',
      'Use 3–4 times per week for optimal results',
    ],
    faqs: [
      { q: 'How long before I see results?', a: 'Most customers notice reduced shedding within 2–4 weeks. Visible new growth typically appears at 6–8 weeks. Clinical results were measured at the 8-week mark.' },
      { q: 'Is it safe for colour-treated hair?', a: 'Yes. The formula is sulfate-free and pH-balanced, making it safe for all hair types including colour-treated, chemically processed, and bleached hair.' },
      { q: 'Can I use it with other hair products?', a: 'Yes. Stemuvita™ is compatible with all conditioners and styling products. For maximum results, use with the Scalp Serum as a complete routine.' },
      { q: 'What if it does not work for me?', a: 'We offer a 30-day money-back guarantee. If you are not satisfied for any reason, contact our team and we will issue a full refund — no questions asked.' },
    ],
  },
  'stemuvita-serum': {
    benefits: [
      '94% of users saw visible new growth in 8 weeks',
      'Leave-in formula works overnight while you sleep',
      'Concentrated plant stem cell actives at 3× cleanser strength',
      'Reduces scalp oiliness and regulates sebum production',
      'Non-greasy, absorbs in under 60 seconds',
    ],
    ingredients: [
      { name: 'Concentrated Stem Cell Complex', benefit: 'Triple-strength follicle activation' },
      { name: 'Redensyl®', benefit: 'Clinically proven hair density booster' },
      { name: 'Capixyl™', benefit: 'Anchors hair at the root' },
      { name: 'Peppermint Oil', benefit: 'Stimulates blood flow to follicles' },
      { name: 'Hyaluronic Acid', benefit: 'Deep hydration for the scalp' },
      { name: 'Zinc PCA', benefit: 'Controls sebum and scalp oiliness' },
    ],
    howToUse: [
      'Apply to a clean, dry or towel-dried scalp',
      'Use the dropper to apply directly to areas of concern',
      'Massage gently with fingertips for 1–2 minutes',
      'Do not rinse — leave in overnight for best results',
      'Use nightly or at least 5 times per week',
    ],
    faqs: [
      { q: 'Do I need to rinse it out?', a: 'No. The serum is designed as a leave-in treatment. Apply before bed and let it work overnight while you sleep.' },
      { q: 'Can I use it alone without the cleanser?', a: 'Yes, though clinical results are strongest when used as a complete routine with the Hair Cleanse. The serum alone still provides significant benefits.' },
      { q: 'Will it make my hair greasy?', a: 'No. The formula is specifically engineered to be non-greasy and absorbs fully within 60 seconds. Most users cannot feel it after application.' },
      { q: 'How long does one bottle last?', a: 'One 50ml bottle lasts approximately 4–6 weeks with nightly use, depending on hair thickness and scalp surface area.' },
    ],
  },
}

interface ReviewData {
  id: string
  authorName: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt: string
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sz} ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  )
}

function RatingBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-12 text-gray-500 text-right">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-gray-400">{pct}%</span>
    </div>
  )
}

export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { addItem } = useCartStore()

  // Live product from DB (falls back to static if API unavailable)
  const [dbProduct, setDbProduct] = useState<Product | null>(null)
  const [dbRelated, setDbRelated] = useState<Product[]>([])
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((all: Product[]) => {
        const found = all.find((p: Product) => p.slug === slug)
        if (found) setDbProduct(found)
        setDbRelated(all.filter((p: Product) => p.slug !== slug))
      })
      .catch(() => {})
  }, [slug])

  const product = dbProduct ?? ALL_PRODUCTS.find((p) => p.slug === slug)
  const details  = PRODUCT_DETAILS[slug] ?? PRODUCT_DETAILS['stemuvita']
  const related  = dbRelated.length > 0 ? dbRelated : ALL_PRODUCTS.filter((p) => p.slug !== slug)
  const relatedProducts = related.filter((p) => !p.isBundle)
  const bundleOffers    = dbRelated.filter((p) => p.isBundle && p.slug !== slug)
  const includedProducts = product?.isBundle
    ? dbRelated.filter((p) => product.bundleProductIds?.includes(p.id))
    : []

  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'how-to' | 'faq'>('description')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, title: '', body: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(true)
  useEffect(() => {
    if (!slug) return
    fetch(`/api/reviews/${slug}`)
      .then((r) => r.json())
      .then((data) => { setReviews(Array.isArray(data) ? data : []); setReviewsLoading(false) })
      .catch(() => setReviewsLoading(false))
  }, [slug])
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d: Record<string, string>) => setSubscriptionsEnabled(d.subscriptionsEnabled !== 'false'))
      .catch(() => {})
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🌿</p>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Product not found</h1>
          <Link href="/products" className="text-[#2d6a4f] underline">Browse all products</Link>
        </div>
      </div>
    )
  }

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0
  const activePrice = product.salePrice ?? product.price
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 4.9
  const displayRating = reviews.length ? avgRating : 4.9
  const reviewCount = reviews.length || 1247
  const outOfStock = product.stock <= 0

  function handleAddToCart() {
    if (outOfStock) return
    addItem(product!, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    setReviewSubmitting(true)
    try {
      await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, productSlug: slug }),
      })
      setReviewSubmitted(true)
      setShowReviewForm(false)
    } catch {}
    finally { setReviewSubmitting(false) }
  }

  const ratingDist = [
    { label: '5 ★', pct: 78 },
    { label: '4 ★', pct: 14 },
    { label: '3 ★', pct: 5 },
    { label: '2 ★', pct: 2 },
    { label: '1 ★', pct: 1 },
  ]

  const displayReviews = reviews

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cellaviva.com'
  const productUrl = `${appUrl}/products/${slug}`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    url: productUrl,
    brand: { '@type': 'Brand', name: 'CELLAVIVA' },
    offers: {
      '@type': 'Offer',
      price: activePrice,
      priceCurrency: 'EUR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: productUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: displayRating.toFixed(1),
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: appUrl },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${appUrl}/products` },
      { '@type': 'ListItem', position: 3, name: product.title, item: productUrl },
    ],
  }

  const faqSchema = details.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: details.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div className="min-h-screen bg-[#f8f9f4]">
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#2d6a4f]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-[#2d6a4f]">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 font-medium">{product.title}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* LEFT: Product visual */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] rounded-3xl overflow-hidden flex items-center justify-center">
              {product.featured && (
                <div className="absolute top-5 left-5 z-10 bg-[#2d6a4f] text-white text-xs font-bold rounded-full px-3 py-1.5">
                  Bestseller
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-5 right-5 z-10 bg-red-500 text-white text-xs font-bold rounded-full px-3 py-1.5">
                  {discount}% OFF
                </div>
              )}

              {product.images && product.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-[140px] leading-none select-none">{product.slug === 'stemuvita-serum' ? '💧' : '🌿'}</div>
                  <p className="text-[#1b4332] font-bold mt-2 text-sm">{product.title}</p>
                </div>
              )}

              {/* Floating badges */}
              <div className="absolute bottom-5 left-5 z-10 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <StarRow rating={5} />
                  <span className="text-xs font-bold text-gray-700">{displayRating.toFixed(1)}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{reviewCount.toLocaleString()} reviews</p>
              </div>
              <div className="absolute bottom-5 right-5 z-10 bg-[#1b4332]/90 backdrop-blur-sm rounded-2xl px-3 py-2 text-white shadow-sm text-center">
                <p className="text-xs font-black">94%</p>
                <p className="text-[10px] text-white/70">saw results</p>
              </div>
            </div>

            {/* Thumbnail strip — only shown when product has multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-[#2d6a4f] scale-105' : 'border-gray-200 hover:border-[#52b788]'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🚚', label: 'Free shipping', sub: 'on orders $50+' },
                { icon: '🛡️', label: '30-day returns', sub: 'no questions asked' },
                { icon: '🌿', label: '100% plant-based', sub: 'vegan & cruelty-free' },
              ].map((t) => (
                <div key={t.label} className="bg-white rounded-2xl p-3 text-center border border-gray-100">
                  <p className="text-xl mb-1">{t.icon}</p>
                  <p className="text-xs font-bold text-gray-800">{t.label}</p>
                  <p className="text-[10px] text-gray-400">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product info + ATC */}
          <div className="flex flex-col gap-6">
            {/* Title + rating */}
            <div>
              <p className="text-[#52b788] font-semibold text-xs uppercase tracking-widest mb-2">
                {product.featured ? 'Bestseller · ' : ''}Clinically Proven
              </p>
              <h1 className="text-4xl font-black text-gray-900 leading-tight mb-3">{product.title}</h1>
              <div className="flex items-center gap-3">
                <StarRow rating={Math.round(displayRating)} size="lg" />
                <span className="text-sm font-bold text-gray-700">{displayRating.toFixed(1)}</span>
                <a href="#reviews" className="text-sm text-[#2d6a4f] hover:underline">
                  {reviewCount.toLocaleString()} reviews
                </a>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-[#2d6a4f]">{formatPrice(activePrice)}</span>
              {product.salePrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-full">
                    Save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
            </div>

            {/* Key benefits */}
            <ul className="space-y-2">
              {details.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788] flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            {/* Stock warning */}
            {outOfStock ? (
              <p className="text-sm font-semibold text-gray-400">
                {product.isBundle ? 'Out of Stock — one or more included products is unavailable' : 'Out of Stock'}
              </p>
            ) : (
              <p className="text-sm font-semibold text-orange-500">
                ⚡ Only {product.stock} left in stock — order soon
              </p>
            )}

            {/* Qty + ATC */}
            <div className="flex gap-3">
              <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3.5 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3.5 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  outOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-[#52b788] text-white'
                    : 'bg-[#1b4332] text-white hover:bg-[#2d6a4f]'
                }`}
              >
                {outOfStock ? (
                  'Out of Stock'
                ) : added ? (
                  <><CheckCircle2 className="w-4 h-4" /> Added to Cart!</>
                ) : (
                  <>Add to Cart · {formatPrice(activePrice * qty)}</>
                )}
              </button>

              <WishlistButton slug={slug} className="p-3.5 rounded-2xl" />
            </div>

            {/* Subscribe & save */}
            {subscriptionsEnabled && !outOfStock && (
              <div className="bg-[#d8f3dc] rounded-2xl p-4 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-[#2d6a4f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#1b4332]">Subscribe & Save 15%</p>
                  <p className="text-xs text-[#2d6a4f] mt-0.5">
                    {formatPrice(activePrice * 0.85)}/month · Cancel anytime · Free delivery
                  </p>
                </div>
              </div>
            )}

            {/* Delivery estimate */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white rounded-2xl border border-gray-100 px-4 py-3">
              <Truck className="w-4 h-4 text-[#52b788] flex-shrink-0" />
              <span>
                Order now — estimated delivery{' '}
                <strong className="text-gray-800">
                  {new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  {' – '}
                  {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile ATC */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 shadow-lg">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-700 truncate">{product.title}</p>
          <p className="text-lg font-black text-[#2d6a4f]">{formatPrice(activePrice)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all flex-shrink-0 ${
            outOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : added ? 'bg-[#52b788] text-white' : 'bg-[#1b4332] text-white'
          }`}
        >
          {outOfStock ? 'Out of Stock' : added ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-16">
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-6 overflow-x-auto">
            {([
              { id: 'description', label: 'Description' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'how-to', label: 'How to Use' },
              { id: 'faq', label: 'FAQs' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#2d6a4f] text-[#2d6a4f]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl">
          {activeTab === 'description' && (
            <div className="prose prose-sm text-gray-600 leading-relaxed">
              <p className="text-base leading-relaxed">{product.description}</p>
              <p className="mt-4">
                Formulated over 4 years of research by a team of trichologists and cosmetic chemists, Stemuvita™ targets hair loss at its root cause: poor follicle health, DHT accumulation, and reduced scalp circulation. Unlike conventional shampoos that only clean the hair shaft, Stemuvita™ delivers active botanical compounds directly to the follicle.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.ingredients.map((ing) => (
                <div key={ing.name} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="font-bold text-gray-900 text-sm">{ing.name}</p>
                  <p className="text-xs text-[#52b788] mt-0.5">{ing.benefit}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'how-to' && (
            <ol className="space-y-4">
              {details.howToUse.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center text-sm font-black flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600 pt-1.5">{step}</p>
                </li>
              ))}
            </ol>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              {details.faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <p className="text-sm font-bold text-gray-900">{faq.q}</p>
                    <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      <div id="reviews" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-2">
                <StarRow rating={5} size="lg" />
                <span className="font-black text-gray-900">{displayRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">based on {reviewCount.toLocaleString()} reviews</span>
              </div>
            </div>
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-5 py-2.5 bg-[#1b4332] text-white rounded-2xl text-sm font-semibold hover:bg-[#2d6a4f] transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Rating breakdown */}
          <div className="max-w-xs mb-10 space-y-2">
            {ratingDist.map((r) => <RatingBar key={r.label} {...r} />)}
          </div>

          {reviewsLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading reviews…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayReviews.map((r) => (
                <div key={r.id} className="bg-[#f8f9f4] rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{r.authorName}</p>
                      {r.verified && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-[#52b788]" />
                          <span className="text-[10px] text-[#52b788] font-semibold">Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <StarRow rating={r.rating} />
                  <p className="font-bold text-gray-900 text-sm mt-2">{r.title}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          )}

          {reviewSubmitted && (
            <div className="mt-6 bg-[#d8f3dc] border border-[#52b788]/30 rounded-2xl px-5 py-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2d6a4f]" />
              <p className="text-sm text-[#1b4332] font-semibold">Thank you! Your review is pending approval.</p>
            </div>
          )}

          {/* Review form modal */}
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowReviewForm(false)} />
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
                <h3 className="text-xl font-black text-gray-900 mb-6">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name *</label>
                      <input required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email *</label>
                      <input required type="email" value={reviewForm.email} onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Rating *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                          <Star className={`w-7 h-7 transition-colors ${n <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Review Title *</label>
                    <input required value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      placeholder="Summarise your experience"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Review *</label>
                    <textarea required rows={4} value={reviewForm.body} onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                      placeholder="Tell us about your experience with this product"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowReviewForm(false)}
                      className="flex-1 border border-gray-200 rounded-2xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={reviewSubmitting}
                      className="flex-1 bg-[#1b4332] text-white rounded-2xl py-3 text-sm font-semibold hover:bg-[#2d6a4f] disabled:opacity-50">
                      {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What's included (bundle's own page) */}
      {product?.isBundle && includedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-[#f0faf4] border border-[#d8f3dc] rounded-3xl p-6">
            <h3 className="font-black text-gray-900 mb-4">This bundle includes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {includedProducts.map((inc) => (
                <Link key={inc.id} href={`/products/${inc.slug}`} className="flex items-center gap-3 bg-white rounded-2xl p-4 hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 bg-[#d8f3dc] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🌿</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{inc.title}</p>
                    <p className="text-xs text-gray-400">{formatPrice(inc.salePrice ?? inc.price)} individually</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related products */}
      {(relatedProducts.length > 0 || bundleOffers.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Complete Your Routine</h2>
          <p className="text-gray-500 text-sm mb-8">Customers who use both products see 2× faster results.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => {
              const relDiscount = rel.salePrice
                ? Math.round(((rel.price - rel.salePrice) / rel.price) * 100)
                : 0
              return (
                <div key={rel.id} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-[#d8f3dc] rounded-2xl flex items-center justify-center text-7xl mb-5">
                    {rel.slug === 'stemuvita-serum' ? '💧' : '🌿'}
                  </div>
                  <p className="font-black text-gray-900 mb-1">{rel.title}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-black text-[#2d6a4f]">{formatPrice(rel.salePrice ?? rel.price)}</span>
                    {rel.salePrice && <span className="text-sm text-gray-400 line-through">{formatPrice(rel.price)}</span>}
                    {relDiscount > 0 && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{relDiscount}% OFF</span>}
                  </div>
                  <Link
                    href={`/products/${rel.slug}`}
                    className="block w-full text-center bg-[#1b4332] text-white rounded-2xl py-3 text-sm font-semibold hover:bg-[#2d6a4f] transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              )
            })}

            {/* Real admin-created bundle offers */}
            {bundleOffers.map((bundle) => {
              const bundleDiscount = bundle.salePrice
                ? Math.round(((bundle.price - bundle.salePrice) / bundle.price) * 100)
                : 0
              const bundleOutOfStock = bundle.stock <= 0
              return (
                <div key={bundle.id} className={`bg-[#1b4332] rounded-3xl p-6 text-white ${bundleOutOfStock ? 'opacity-70' : ''}`}>
                  <div className="text-4xl mb-4">🌿💧</div>
                  <p className="text-[#52b788] text-xs font-bold uppercase tracking-widest mb-1">Best Value</p>
                  <p className="font-black text-lg mb-2">{bundle.title}</p>
                  <p className="text-white/60 text-xs mb-4 line-clamp-2">{bundle.description}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-black">{formatPrice(bundle.salePrice ?? bundle.price)}</span>
                    {bundle.salePrice && <span className="text-white/40 line-through text-sm">{formatPrice(bundle.price)}</span>}
                    {bundleDiscount > 0 && <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">{bundleDiscount}% OFF</span>}
                  </div>
                  <p className={`text-xs font-semibold mb-4 ${bundleOutOfStock ? 'text-red-300' : 'text-white/50'}`}>
                    {bundleOutOfStock ? 'Out of Stock' : `${bundle.stock} in stock`}
                  </p>
                  <button
                    disabled={bundleOutOfStock}
                    onClick={() => {
                      if (bundleOutOfStock) return
                      addItem(bundle, 1)
                      setAdded(true)
                      setTimeout(() => setAdded(false), 2000)
                    }}
                    className={`w-full py-3 rounded-2xl text-sm font-bold transition-colors ${
                      bundleOutOfStock
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-[#52b788] text-[#0b2819] hover:bg-[#40a070]'
                    }`}
                  >
                    {bundleOutOfStock ? 'Out of Stock' : 'Add Bundle to Cart'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom spacer for mobile sticky ATC */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
