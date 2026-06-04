'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Search, X } from 'lucide-react'

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative max-w-sm mx-auto mt-6">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isPending ? 'text-white/40 animate-pulse' : 'text-white/50'}`} />
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search products…"
        className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
      />
      {defaultValue && (
        <button onClick={() => handleChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
