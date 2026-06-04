export default function QuizLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9f4] flex items-center justify-center animate-pulse">
      <div className="max-w-xl w-full px-4">
        <div className="h-2 bg-gray-200 rounded-full mb-10" />
        <div className="h-7 w-64 bg-gray-200 rounded-full mx-auto mb-3" />
        <div className="h-4 w-48 bg-gray-100 rounded-full mx-auto mb-10" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
