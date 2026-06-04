export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9f4] animate-pulse">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded-full" />
            <div className="h-3 w-28 bg-gray-100 rounded-full" />
          </div>
        </div>
        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-full" />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
