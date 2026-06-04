export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--sf-bg, #f8f9f4)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-8 w-40 rounded-lg bg-gray-200 animate-pulse mb-8" />
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
                <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="h-10 rounded-xl bg-gray-200 animate-pulse" />
                </div>
                <div className="h-10 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 space-y-4 h-fit">
            <div className="h-5 w-28 rounded bg-gray-200 animate-pulse" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-6 w-full rounded bg-gray-200 animate-pulse mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
