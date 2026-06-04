export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9f4] animate-pulse">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-7 w-32 bg-gray-200 rounded-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100">
                <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded-full" />
                  <div className="h-3 w-24 bg-gray-100 rounded-full" />
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 h-fit space-y-4">
            <div className="h-4 w-28 bg-gray-200 rounded-full" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 bg-gray-100 rounded-full" />
                <div className="h-3 w-14 bg-gray-100 rounded-full" />
              </div>
            ))}
            <div className="h-12 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
