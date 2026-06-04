export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9f4] animate-pulse">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-4 w-72 bg-gray-100 rounded-full mx-auto mb-12" />
        <div className="bg-white rounded-3xl p-8 space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-gray-100 rounded-full mb-2" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          ))}
          <div className="h-12 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
