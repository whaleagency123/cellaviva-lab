'use client'
import { useState, useEffect } from 'react'
import {
  Star, CheckCircle, XCircle, MessageSquare, Search,
  X, Shield, TrendingUp, RefreshCw, Loader2, Trash2,
} from 'lucide-react'

interface Review {
  id: string
  productSlug: string
  authorName: string
  authorEmail: string
  rating: number
  title: string
  body: string
  verified: boolean
  approved: boolean
  createdAt: string
}

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${s} ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/15'}`} />
      ))}
    </div>
  )
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-white/40 w-4 text-right">{stars}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-white/30 w-5">{count}</span>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'ALL'>('PENDING')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Review | null>(null)
  const [saving, setSaving] = useState(false)

  async function fetchReviews() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews')
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  async function setApproval(id: string, approved: boolean) {
    setSaving(true)
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved }),
    })
    if (res.ok) {
      const updated = await res.json()
      setReviews((prev) => prev.map((r) => r.id === id ? updated : r))
      setSelected((prev) => prev?.id === id ? updated : prev)
    }
    setSaving(false)
  }

  async function deleteReview(id: string) {
    if (!confirm('Delete this review permanently?')) return
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    setReviews((prev) => prev.filter((r) => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const approved = reviews.filter((r) => r.approved)
  const pending = reviews.filter((r) => !r.approved)
  const avgRating = approved.length > 0
    ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1)
    : '0.0'

  const starCounts = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: approved.filter((r) => r.rating === n).length,
  }))

  const filtered = reviews.filter((r) => {
    const matchFilter = filter === 'ALL' || (filter === 'APPROVED' ? r.approved : !r.approved)
    const q = search.toLowerCase()
    const matchSearch = !q || r.authorName.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.body.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const FILTER_TABS = [
    { key: 'PENDING', label: 'Pending', count: pending.length },
    { key: 'APPROVED', label: 'Approved', count: approved.length },
    { key: 'ALL', label: 'All', count: reviews.length },
  ] as const

  return (
    <div className="p-8 space-y-7 min-h-screen bg-[#0f1117]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Star className="w-6 h-6 text-amber-400" /> Reviews
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Moderate customer reviews and manage reputation.</p>
        </div>
        <button onClick={fetchReviews} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`${CARD} p-6 flex flex-col items-center justify-center`}>
          <p className="text-6xl font-black text-white">{avgRating}</p>
          <StarRow rating={Math.round(Number(avgRating))} size="md" />
          <p className="text-xs text-white/35 mt-2">{approved.length} approved reviews</p>
        </div>
        <div className={`${CARD} p-6`}>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Rating Distribution</h3>
          <div className="space-y-2.5">
            {starCounts.map((s) => <RatingBar key={s.stars} stars={s.stars} count={s.count} total={approved.length} />)}
          </div>
        </div>
        <div className={`${CARD} p-6 space-y-3`}>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Review Status</h3>
          {[
            { label: 'Pending Approval', count: pending.length, color: '#f59e0b' },
            { label: 'Approved & Published', count: approved.length, color: '#4ade80' },
            { label: 'Verified Purchases', count: reviews.filter((r) => r.verified).length, color: '#60a5fa' },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-sm text-white/50">{s.label}</span>
              <span className="font-bold text-sm" style={{ color: s.color }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white/5 rounded-xl p-1 gap-0.5">
          {FILTER_TABS.map((t) => (
            <button key={t.key} onClick={() => setFilter(t.key as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${filter === t.key ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}>
              {t.label}
              {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === t.key ? 'bg-white/15' : 'bg-white/5'}`}>{t.count}</span>}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews…"
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors w-64" />
        </div>
      </div>

      {/* Review cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-white/30" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className={`${CARD} p-5 cursor-pointer hover:border-white/10 transition-all`}
              onClick={() => setSelected(r)}>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4ade80]/40 to-[#3a79a9]/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {r.authorName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">{r.authorName}</span>
                        {r.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-full">
                            <Shield className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${r.approved ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {r.approved ? 'APPROVED' : 'PENDING'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <StarRow rating={r.rating} />
                        <span className="text-[10px] text-white/30">{r.productSlug}</span>
                        <span className="text-[10px] text-white/25">{formatDate(r.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {!r.approved && (
                        <button onClick={() => setApproval(r.id, true)} className="flex items-center gap-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors">
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                      )}
                      {r.approved && (
                        <button onClick={() => setApproval(r.id, false)} className="flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/20 text-amber-400 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors">
                          <XCircle className="w-3 h-3" /> Unpublish
                        </button>
                      )}
                      <button onClick={() => deleteReview(r.id)} className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-white/80 text-sm mt-2.5">{r.title}</p>
                  <p className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">{r.body}</p>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className={`${CARD} py-16 text-center text-white/30 text-sm`}>
              {reviews.length === 0 ? 'No reviews yet. Reviews submitted by customers will appear here.' : 'No reviews match your filter.'}
            </div>
          )}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="w-full max-w-lg bg-[#13161f] border-l border-white/5 overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#13161f] z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-sm">{selected.authorName}</h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${selected.approved ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    {selected.approved ? 'APPROVED' : 'PENDING'}
                  </span>
                </div>
                <p className="text-xs text-white/35 mt-0.5">{selected.productSlug} · {formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <StarRow rating={selected.rating} size="md" />
                {selected.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-full">
                    <Shield className="w-2.5 h-2.5" /> Verified Purchase
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white mb-1.5">{selected.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{selected.body}</p>
              </div>
              <div className="text-xs text-white/30 space-y-1">
                <p>Email: {selected.authorEmail}</p>
                <p>Product: {selected.productSlug}</p>
                <p>Submitted: {formatDate(selected.createdAt)}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-white/5">
                {!selected.approved ? (
                  <button onClick={() => setApproval(selected.id, true)} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve & Publish
                  </button>
                ) : (
                  <button onClick={() => setApproval(selected.id, false)} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/20 text-amber-400 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                    <XCircle className="w-4 h-4" /> Unpublish
                  </button>
                )}
                <button onClick={() => deleteReview(selected.id)}
                  className="px-4 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/25 pt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Review ID: {selected.id.slice(0, 8)}…</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
