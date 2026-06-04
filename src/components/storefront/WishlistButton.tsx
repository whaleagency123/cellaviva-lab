'use client'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'

interface Props {
  slug: string
  className?: string
  size?: 'sm' | 'md'
}

export function WishlistButton({ slug, className = '', size = 'md' }: Props) {
  const { isWishlisted, toggle } = useWishlist()
  const active = isWishlisted(slug)

  const sizeClasses = size === 'sm'
    ? 'w-8 h-8'
    : 'w-10 h-10'

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug) }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${sizeClasses} rounded-full flex items-center justify-center border transition-all ${
        active
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
          : 'bg-white border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200'
      } ${className}`}
    >
      <Heart className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5 w-[18px] h-[18px]'} ${active ? 'fill-red-500' : ''}`} />
    </button>
  )
}
