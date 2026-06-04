export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--sf-bg, #f8f9f4)' }}>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-10 w-56 rounded-lg bg-gray-200 animate-pulse mb-4" />
        <div className="h-4 w-80 rounded bg-gray-200 animate-pulse mb-12" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-20 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-6 w-full rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-4/6 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
