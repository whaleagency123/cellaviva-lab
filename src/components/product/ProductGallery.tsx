'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const fallback = '/images/product-placeholder.jpg'

  const allImages = images.length > 0 ? images : [fallback]

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex flex-col gap-3 w-20 flex-shrink-0">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                selected === i
                  ? 'border-[#2d6a4f] shadow-md scale-105'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <img
                src={src}
                alt={`${title} view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-[#d8f3dc]">
        <img
          src={allImages[selected]}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.target as HTMLImageElement
            t.parentElement!.innerHTML = `
              <div class="w-full h-full flex flex-col items-center justify-center">
                <div class="text-9xl mb-4">🌿</div>
                <p class="text-[#1b4332] font-bold text-xl">${title}</p>
              </div>
            `
          }}
        />

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setSelected((s) => (s - 1 + allImages.length) % allImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelected((s) => (s + 1) % allImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selected === i ? 'bg-[#2d6a4f] w-4' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
