'use client'
import Link from 'next/link'

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] bg-[#f8f9f4] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black text-[#3a79a9]/15 mb-4">Oops</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-[#3a79a9] text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#266396] transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full text-sm hover:border-[#3a79a9] hover:text-[#3a79a9] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
