export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--sf-bg, #f8f9f4)' }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-8 w-48 rounded-lg bg-gray-200 animate-pulse mb-2" />
        <div className="h-4 w-72 rounded bg-gray-200 animate-pulse mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
                <div className="h-10 w-full rounded-xl bg-gray-200 animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
