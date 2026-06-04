'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

const LS_KEY = 'cellaviva-wishlist'

function getLocal(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function setLocal(slugs: string[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(slugs))
}

export function useWishlist() {
  const { data: session } = useSession()
  const [slugs, setSlugs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Load: if signed in fetch from API, else from localStorage
  useEffect(() => {
    if (session?.user) {
      setLoading(true)
      fetch('/api/wishlist')
        .then((r) => r.json())
        .then((data: string[]) => { setSlugs(data); setLoading(false) })
        .catch(() => setLoading(false))
    } else {
      setSlugs(getLocal())
    }
  }, [session])

  const isWishlisted = useCallback((slug: string) => slugs.includes(slug), [slugs])

  const toggle = useCallback(
    async (slug: string) => {
      const isIn = slugs.includes(slug)
      const next = isIn ? slugs.filter((s) => s !== slug) : [...slugs, slug]
      setSlugs(next)

      if (session?.user) {
        await fetch('/api/wishlist', {
          method: isIn ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        }).catch(() => setSlugs(slugs)) // revert on error
      } else {
        setLocal(next)
      }
    },
    [slugs, session],
  )

  return { slugs, isWishlisted, toggle, loading }
}
