'use client'
import { useState } from 'react'
import {
  RotateCcw, Search, X, ChevronRight,
  CheckCircle, XCircle, Package, DollarSign,
  AlertTriangle, Clock, ArrowDownLeft, Mail,
  TrendingDown,
} from 'lucide-react'

type ReturnStatus = 'REQUESTED' | 'APPROVED' | 'ITEM_RECEIVED' | 'REFUNDED' | 'REJECTED'

type ReturnReason =
  | 'Damaged / Defective'
  | 'Wrong item sent'
  | 'Not as described'
  | 'Changed mind'
  | 'No results'
  | 'Allergic reaction'

interface ReturnRequest {
  id: string
  orderId: string
  customer: string
  email: string
  product: string
  qty: number
  reason: ReturnReason
  details: string
  status: ReturnStatus
  requestedAt: string
  refundAmount: number
  refundMethod: 'Original Payment' | 'Store Credit'
  timeline: { label: string; date: string; done: boolean }[]
}

const MOCK_RETURNS: ReturnRequest[] = [
  {
    id: 'RET-001', orderId: 'ORD-4810', customer: 'Emma Wilson', email: 'emma@example.com',
    product: 'Stemuvita™ Hair Cleanse', qty: 1, reason: 'Damaged / Defective',
    details: 'The bottle arrived cracked and product was leaking. Package was damaged in transit.',
    status: 'APPROVED', requestedAt: '2026-05-22', refundAmount: 49, refundMethod: 'Original Payment',
    timeline: [
      { label: 'Return Requested', date: '2026-05-22', done: true },
      { label: 'Return Approved', date: '2026-05-23', done: true },
      { label: 'Item Received', date: '', done: false },
      { label: 'Refund Processed', date: '', done: false },
    ],
  },
  {
    id: 'RET-002', orderId: 'ORD-4805', customer: 'Lucas Becker', email: 'lucas@example.com',
    product: 'Stemuvita™ Scalp Serum', qty: 1, reason: 'No results',
    details: 'Used for 3 weeks, did not see any improvement. Product did not work for me.',
    status: 'REQUESTED', requestedAt: '2026-05-24', refundAmount: 42, refundMethod: 'Store Credit',
    timeline: [
      { label: 'Return Requested', date: '2026-05-24', done: true },
      { label: 'Return Approved', date: '', done: false },
      { label: 'Item Received', date: '', done: false },
      { label: 'Refund Processed', date: '', done: false },
    ],
  },
  {
    id: 'RET-003', orderId: 'ORD-4799', customer: 'Isabelle Morel', email: 'isabelle@example.com',
    product: 'Stemuvita™ Hair Cleanse', qty: 2, reason: 'Allergic reaction',
    details: 'Developed redness on scalp after first use. Had to stop using immediately.',
    status: 'REFUNDED', requestedAt: '2026-05-15', refundAmount: 98, refundMethod: 'Original Payment',
    timeline: [
      { label: 'Return Requested', date: '2026-05-15', done: true },
      { label: 'Return Approved', date: '2026-05-16', done: true },
      { label: 'Item Received', date: '2026-05-19', done: true },
      { label: 'Refund Processed', date: '2026-05-20', done: true },
    ],
  },
  {
    id: 'RET-004', orderId: 'ORD-4791', customer: 'Marco Ricci', email: 'marco@example.com',
    product: 'Stemuvita™ Hair Cleanse', qty: 1, reason: 'Changed mind',
    details: 'Decided I want to try a different product. Unopened bottle.',
    status: 'REJECTED', requestedAt: '2026-05-10', refundAmount: 49, refundMethod: 'Store Credit',
    timeline: [
      { label: 'Return Requested', date: '2026-05-10', done: true },
      { label: 'Return Rejected', date: '2026-05-11', done: true },
      { label: 'Item Received', date: '', done: false },
      { label: 'Refund Processed', date: '', done: false },
    ],
  },
  {
    id: 'RET-005', orderId: 'ORD-4783', customer: 'Chloe Bernard', email: 'chloe@example.com',
    product: 'Stemuvita™ Scalp Serum', qty: 1, reason: 'Wrong item sent',
    details: 'I ordered the Hair Cleanse but received the Scalp Serum instead.',
    status: 'ITEM_RECEIVED', requestedAt: '2026-05-18', refundAmount: 42, refundMethod: 'Original Payment',
    timeline: [
      { label: 'Return Requested', date: '2026-05-18', done: true },
      { label: 'Return Approved', date: '2026-05-19', done: true },
      { label: 'Item Received', date: '2026-05-23', done: true },
      { label: 'Refund Processed', date: '', done: false },
    ],
  },
]

const STATUS_STYLE: Record<ReturnStatus, string> = {
  REQUESTED:     'bg-amber-500/15 text-amber-400',
  APPROVED:      'bg-blue-500/15 text-blue-400',
  ITEM_RECEIVED: 'bg-purple-500/15 text-purple-400',
  REFUNDED:      'bg-emerald-500/15 text-emerald-400',
  REJECTED:      'bg-red-500/15 text-red-400',
}

const STATUS_LABEL: Record<ReturnStatus, string> = {
  REQUESTED:     'Requested',
  APPROVED:      'Approved',
  ITEM_RECEIVED: 'Item Received',
  REFUNDED:      'Refunded',
  REJECTED:      'Rejected',
}

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>(MOCK_RETURNS)
  const [filter, setFilter] = useState<'ALL' | ReturnStatus>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ReturnRequest | null>(null)

  function advanceStatus(id: string, newStatus: ReturnStatus) {
    const today = new Date().toISOString().split('T')[0]
    const stepIndex: Partial<Record<ReturnStatus, number>> = {
      APPROVED: 1, ITEM_RECEIVED: 2, REFUNDED: 3, REJECTED: 1,
    }
    setReturns(prev => prev.map(r => {
      if (r.id !== id) return r
      const idx = stepIndex[newStatus] ?? 0
      const timeline = r.timeline.map((t, i) => {
        if (i < idx) return t
        if (i === idx) return { ...t, done: true, date: t.date || today }
        return t
      })
      return { ...r, status: newStatus, timeline }
    }))
    setSelected(prev => {
      if (!prev || prev.id !== id) return prev
      const idx = stepIndex[newStatus] ?? 0
      const today2 = new Date().toISOString().split('T')[0]
      const timeline = prev.timeline.map((t, i) => {
        if (i < idx) return t
        if (i === idx) return { ...t, done: true, date: t.date || today2 }
        return t
      })
      return { ...prev, status: newStatus, timeline }
    })
  }

  const counts: Record<string, number> = {
    ALL:           returns.length,
    REQUESTED:     returns.filter(r => r.status === 'REQUESTED').length,
    APPROVED:      returns.filter(r => r.status === 'APPROVED').length,
    ITEM_RECEIVED: returns.filter(r => r.status === 'ITEM_RECEIVED').length,
    REFUNDED:      returns.filter(r => r.status === 'REFUNDED').length,
    REJECTED:      returns.filter(r => r.status === 'REJECTED').length,
  }

  const totalRefunded = returns.filter(r => r.status === 'REFUNDED').reduce((s, r) => s + r.refundAmount, 0)
  const openReturns   = returns.filter(r => ['REQUESTED', 'APPROVED', 'ITEM_RECEIVED'].includes(r.status)).length
  const returnRate    = '4.2%'

  const filtered = returns.filter(r => {
    const matchFilter = filter === 'ALL' || r.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || r.customer.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const FILTER_TABS = [
    { key: 'ALL',           label: 'All' },
    { key: 'REQUESTED',     label: 'Requested' },
    { key: 'APPROVED',      label: 'Approved' },
    { key: 'ITEM_RECEIVED', label: 'Received' },
    { key: 'REFUNDED',      label: 'Refunded' },
    { key: 'REJECTED',      label: 'Rejected' },
  ] as const

  const kpis = [
    { label: 'Open Returns',    value: openReturns,           icon: Clock,         accent: '#f59e0b' },
    { label: 'Refunded (Month)',value: `$${totalRefunded}`,   icon: DollarSign,    accent: '#f87171' },
    { label: 'Return Rate',     value: returnRate,             icon: TrendingDown,  accent: '#a78bfa' },
    { label: 'Pending Review',  value: counts.REQUESTED,       icon: AlertTriangle, accent: '#60a5fa' },
  ]

  return (
    <div className="p-8 space-y-7 min-h-screen bg-[#0f1117]">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-purple-400" /> Returns &amp; Refunds
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Manage return requests and process refunds.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`${CARD} p-5`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${k.accent}18` }}>
              <k.icon className="w-4 h-4" style={{ color: k.accent }} />
            </div>
            <p className="text-2xl font-black text-white">{k.value}</p>
            <p className="text-xs text-white/35 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white/5 rounded-xl p-1 gap-0.5 flex-wrap">
          {FILTER_TABS.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${filter === t.key ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}>
              {t.label}
              {counts[t.key] > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === t.key ? 'bg-white/15' : 'bg-white/5'}`}>{counts[t.key]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search returns…"
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors w-64" />
        </div>
      </div>

      {/* Table */}
      <div className={`${CARD} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Return ID', 'Order', 'Customer', 'Product', 'Reason', 'Status', 'Refund', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-white/3 transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-5 py-3.5 font-mono text-xs text-purple-400 font-semibold">{r.id}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#4ade80] font-semibold">{r.orderId}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white/80 text-xs">{r.customer}</div>
                    <div className="text-white/30 text-[10px]">{r.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-white/50 text-xs max-w-[140px] truncate">{r.product} ×{r.qty}</td>
                  <td className="px-5 py-3.5 text-white/50 text-xs max-w-[120px] truncate">{r.reason}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white text-xs">${r.refundAmount}</td>
                  <td className="px-5 py-3.5"><ChevronRight className="w-4 h-4 text-white/20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30 text-sm">No return requests found.</div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="w-full max-w-md bg-[#13161f] border-l border-white/5 overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#13161f] z-10">
              <div>
                <h2 className="font-bold text-white">{selected.id}</h2>
                <p className="text-xs text-white/40 mt-0.5">{selected.customer} · {selected.orderId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[selected.status]}`}>
                {STATUS_LABEL[selected.status]}
              </span>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Product</span>
                  <span className="text-white/80 font-semibold text-right max-w-[200px]">{selected.product} ×{selected.qty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Reason</span>
                  <span className="text-white/80 font-semibold">{selected.reason}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Refund Amount</span>
                  <span className="font-bold text-white">${selected.refundAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Refund Method</span>
                  <span className="text-white/80">{selected.refundMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Requested</span>
                  <span className="text-white/80">{selected.requestedAt}</span>
                </div>
              </div>

              {/* Customer note */}
              <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1.5">Customer Note</p>
                <p className="text-sm text-white/60 leading-relaxed">{selected.details}</p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-4">Timeline</h3>
                <div className="space-y-0">
                  {selected.timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${t.done ? 'bg-[#4ade80]/20' : 'bg-white/8'}`}>
                          {t.done
                            ? <CheckCircle className="w-3 h-3 text-[#4ade80]" />
                            : <div className="w-2 h-2 rounded-full bg-white/20" />
                          }
                        </div>
                        {i < selected.timeline.length - 1 && (
                          <div className={`w-px h-8 mt-1 ${t.done ? 'bg-[#4ade80]/20' : 'bg-white/8'}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-semibold ${t.done ? 'text-white/80' : 'text-white/25'}`}>{t.label}</p>
                        {t.date && <p className="text-[10px] text-white/30 mt-0.5">{t.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Actions</h3>

                {selected.status === 'REQUESTED' && (
                  <>
                    <button onClick={() => advanceStatus(selected.id, 'APPROVED')} className="w-full flex items-center justify-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                      <CheckCircle className="w-4 h-4" /> Approve Return
                    </button>
                    <button onClick={() => advanceStatus(selected.id, 'REJECTED')} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                      <XCircle className="w-4 h-4" /> Reject Return
                    </button>
                  </>
                )}
                {selected.status === 'APPROVED' && (
                  <button onClick={() => advanceStatus(selected.id, 'ITEM_RECEIVED')} className="w-full flex items-center justify-center gap-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/20 text-purple-400 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                    <Package className="w-4 h-4" /> Mark Item Received
                  </button>
                )}
                {selected.status === 'ITEM_RECEIVED' && (
                  <button onClick={() => advanceStatus(selected.id, 'REFUNDED')} className="w-full flex items-center justify-center gap-2 bg-[#4ade80]/15 hover:bg-[#4ade80]/25 border border-[#4ade80]/20 text-[#4ade80] font-semibold py-2.5 rounded-xl text-sm transition-colors">
                    <ArrowDownLeft className="w-4 h-4" /> Process Refund ${selected.refundAmount}
                  </button>
                )}

                <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  <Mail className="w-4 h-4" /> Email Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
