'use client'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { WishlistButton } from '@/components/storefront/WishlistButton'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-[#d8f3dc] flex items-center justify-center">
        {product.featured && (
          <div className="absolute top-4 left-4 bg-[#52b788] text-white text-xs font-bold rounded-full px-3 py-1.5 z-10">
            Bestseller
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full px-3 py-1.5 z-10">
            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
          </div>
        )}
        <WishlistButton slug={product.slug} className="absolute bottom-4 right-4 z-10" size="md" />
        <div className="text-center">
          <div className="text-9xl mb-3">🌿</div>
          <p className="text-[#1b4332] font-bold">{product.title}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-7">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs text-gray-500">4.9 (1,247 reviews)</span>
        </div>

        <h2 className="text-xl font-black text-[#1b1b1b] mb-2">{product.title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-black text-[#2d6a4f]">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        <p className="text-xs text-red-500 font-semibold mb-4">Only {product.stock} left in stock</p>

        <Link
          href={`/products/${product.slug}`}
          className="block w-full text-center bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold py-3.5 rounded-2xl text-sm transition-colors"
        >
          View Product
        </Link>
      </div>
    </div>
  )
}
