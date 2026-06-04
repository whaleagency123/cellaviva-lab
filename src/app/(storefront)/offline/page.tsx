import Link from 'next/link'

export const metadata = { title: 'You are offline — CELLAVIVA' }

export default function OfflinePage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#f8f9f4] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🌿</div>
        <h1 className="text-2xl font-black text-[#1B3E2A] mb-3">You're offline</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          No internet connection right now. Some pages you've visited before are still available.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#2B5E3F] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#1B3E2A] transition-colors"
        >
          Try Homepage
        </Link>
      </div>
    </div>
  )
}
