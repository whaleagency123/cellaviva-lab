import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Page Not Found | CELLAVIVA' }

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9f4] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-[#3a79a9]/20 mb-2">404</p>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#3a79a9] text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#266396] transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full text-sm hover:border-[#3a79a9] hover:text-[#3a79a9] transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </div>
    </div>
  )
}
