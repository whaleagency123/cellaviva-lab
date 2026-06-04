export default function ScienceLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="bg-gray-200 h-72" />
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-56 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-100 rounded-full" />
            <div className="h-4 w-4/5 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
