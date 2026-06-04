'use client'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0b0d13] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black text-red-500/20 mb-4">Error</p>
        <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-white/40 text-sm mb-8">
          An unexpected error occurred in the admin panel.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-[#4ade80] text-[#0b0d13] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#22c55e] transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center border border-white/10 text-white/60 font-semibold px-6 py-3 rounded-xl text-sm hover:border-white/30 hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-white/20">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
