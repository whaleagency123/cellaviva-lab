'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Repeat2, TrendingUp, TrendingDown, Users, DollarSign,
  Search, X, ChevronRight, Pause, Play, XCircle,
  Mail, Phone, Calendar, BarChart2, RefreshCw,
  ToggleLeft, ToggleRight, WifiOff,
} from 'lucide-react'

const SubCharts = dynamic(() => import('./SubCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-[#13161f] border border-white/5 rounded-2xl p-6 h-[220px] animate-pulse" />
      <div className="bg-[#13161f] border border-white/5 rounded-2xl p-6 h-[220px] animate-pulse" />
    </div>
  ),
})

type SubStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED'
type SubPlan = 'Monthly' | 'Quarterly' | 'Annual'

interface Subscription {
  id: string
  customer: string
  email: string
  phone: string
  plan: SubPlan
  status: SubStatus
  product: string
  price: number
  nextBilling: string
  startDate: string
  totalRevenue: number
  totalOrders: number
  pausedReason?: string
  cancelledReason?: string
}

const MOCK_SUBS: Subscription[] = [
  { id: 'SUB-1001', customer: 'Sarah Miller', email: 'sarah.miller@email.com', phone: '+44 7911 123456', plan: 'Monthly', status: 'ACTIVE', product: 'Stemuvita™ Hair Cleanse', price: 39, nextBilling: '2026-06-25', startDate: '2025-06-25', totalRevenue: 468, totalOrders: 12 },
  { id: 'SUB-1002', customer: 'Nina Park', email: 'nina@example.com', phone: '+1 555-0192', plan: 'Quarterly', status: 'ACTIVE', product: 'Stemuvita™ Hair Cleanse', price: 105, nextBilling: '2026-07-10', startDate: '2025-10-10', totalRevenue: 315, totalOrders: 3 },
  { id: 'SUB-1003', customer: 'Amara Lawal', email: 'amara@example.com', phone: '+234 800 0001', plan: 'Monthly', status: 'PAUSED', product: 'Stemuvita™ Scalp Serum', price: 39, nextBilling: '—', startDate: '2025-09-01', totalRevenue: 273, totalOrders: 7, pausedReason: 'Travelling abroad' },
  { id: 'SUB-1004', customer: 'Priya Kumar', email: 'priya@example.com', phone: '+91 9800 000001', plan: 'Annual', status: 'ACTIVE', product: 'Stemuvita™ Hair Cleanse', price: 372, nextBilling: '2027-01-14', startDate: '2026-01-14', totalRevenue: 372, totalOrders: 1 },
  { id: 'SUB-1005', customer: 'James Thompson', email: 'james@example.com', phone: '+1 555-0200', plan: 'Monthly', status: 'CANCELLED', product: 'Stemuvita™ Hair Cleanse', price: 39, nextBilling: '—', startDate: '2025-03-01', totalRevenue: 195, totalOrders: 5, cancelledReason: 'Too expensive' },
  { id: 'SUB-1006', customer: 'Maria Gonzalez', email: 'maria@example.com', phone: '+34 600 000001', plan: 'Monthly', status: 'ACTIVE', product: 'Stemuvita™ Scalp Serum', price: 39, nextBilling: '2026-06-18', startDate: '2026-01-18', totalRevenue: 195, totalOrders: 5 },
  { id: 'SUB-1007', customer: 'Yuki Tanaka', email: 'yuki@example.com', phone: '+81 90 0000 0001', plan: 'Quarterly', status: 'ACTIVE', product: 'Stemuvita™ Hair Cleanse', price: 105, nextBilling: '2026-08-02', startDate: '2025-11-02', totalRevenue: 420, totalOrders: 4 },
  { id: 'SUB-1008', customer: 'Fatima Al-Hassan', email: 'fatima@example.com', phone: '+971 50 000 0001', plan: 'Monthly', status: 'PAUSED', product: 'Stemuvita™ Hair Cleanse', price: 39, nextBilling: '—', startDate: '2025-07-20', totalRevenue: 351, totalOrders: 9, pausedReason: 'On break' },
]


const STATUS_STYLE: Record<SubStatus, string> = {
  ACTIVE:    'bg-emerald-500/15 text-emerald-400',
  PAUSED:    'bg-amber-500/15 text-amber-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
}

const PLAN_COLOR: Record<SubPlan, string> = {
  Monthly:   'bg-blue-500/15 text-blue-400',
  Quarterly: 'bg-purple-500/15 text-purple-400',
  Annual:    'bg-[#4ade80]/15 text-[#4ade80]',
}

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(MOCK_SUBS)
  const [filter, setFilter] = useState<'ALL' | SubStatus>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Subscription | null>(null)

  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  const [subsEnabled, setSubsEnabled] = useState(true)
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((d: Record<string, string>) => setSubsEnabled(d.subscriptionsEnabled !== 'false'))
      .catch(() => {})
  }, [])

  async function toggleSubscriptions() {
    const newVal = subsEnabled ? 'false' : 'true'
    setSubsEnabled(!subsEnabled)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionsEnabled: newVal }),
    })
  }

  async function updateSubStatus(id: string, status: SubStatus) {
    setSubs(prev => prev.map(s => s.id === id
      ? { ...s, status, nextBilling: status === 'ACTIVE' ? s.nextBilling : '—' }
      : s
    ))
    setSelected(prev => prev?.id === id
      ? { ...prev, status, nextBilling: status === 'ACTIVE' ? prev.nextBilling : '—' }
      : prev
    )
    // Persist to DB
    try {
      await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
    } catch {}
  }

  async function syncFromStore() {
    setSyncing(true); setSyncMsg('')
    try {
      const res = await fetch('/api/admin/subscriptions?action=sync')
      const data = await res.json()
      setSyncMsg(data.synced !== undefined ? `Synced ${data.synced} subscriptions` : 'Sync complete')
    } catch {
      setSyncMsg('Sync failed — check connection')
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMsg(''), 3000)
    }
  }

  function emailCustomer(email: string) {
    window.location.href = `mailto:${email}?subject=Your CELLAVIVA Subscription`
  }

  const filtered = subs.filter(s => {
    const matchFilter = filter === 'ALL' || s.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || s.customer.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const active    = subs.filter(s => s.status === 'ACTIVE').length
  const paused    = subs.filter(s => s.status === 'PAUSED').length
  const cancelled = subs.filter(s => s.status === 'CANCELLED').length
  const mrr       = subs.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + (s.plan === 'Monthly' ? s.price : s.plan === 'Quarterly' ? s.price / 3 : s.price / 12), 0)

  const kpis = [
    { label: 'Active Subscribers', value: active, icon: Users, accent: '#4ade80', change: +14 },
    { label: 'MRR', value: `$${Math.round(mrr).toLocaleString()}`, icon: DollarSign, accent: '#60a5fa', change: +10.2 },
    { label: 'Churn Rate', value: '1.7%', icon: TrendingDown, accent: '#f87171', change: -0.2 },
    { label: 'Avg. LTV', value: '$347', icon: BarChart2, accent: '#a78bfa', change: +5.8 },
  ]

  const FILTER_TABS = [
    { key: 'ALL',       label: 'All',       count: subs.length },
    { key: 'ACTIVE',    label: 'Active',    count: active },
    { key: 'PAUSED',    label: 'Paused',    count: paused },
    { key: 'CANCELLED', label: 'Cancelled', count: cancelled },
  ] as const

  return (
    <div className="p-8 space-y-7 min-h-screen bg-[#0f1117]">

      {/* ── Subscribe & Save Master Toggle ── */}
      <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all flex-wrap gap-4 ${
        subsEnabled
          ? 'bg-[#4ade80]/8 border-[#4ade80]/40'
          : 'bg-red-500/8 border-red-500/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            subsEnabled ? 'bg-[#4ade80]/15' : 'bg-red-500/15'
          }`}>
            {subsEnabled
              ? <Repeat2 className="w-6 h-6 text-[#4ade80]" />
              : <WifiOff className="w-6 h-6 text-red-400" />}
          </div>
          <div>
            <p className={`text-lg font-black ${subsEnabled ? 'text-[#4ade80]' : 'text-red-400'}`}>
              Subscribe &amp; Save — {subsEnabled ? 'ACTIVE' : 'DISABLED'}
            </p>
            <p className="text-sm text-white/40">
              {subsEnabled
                ? 'Customers can subscribe on product pages and via /subscribe'
                : 'Hidden sitewide — nav link, footer link, /subscribe page, and product-page option are all off'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleSubscriptions}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            subsEnabled
              ? 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400'
              : 'bg-[#4ade80]/15 hover:bg-[#4ade80]/25 border border-[#4ade80]/30 text-[#4ade80]'
          }`}
        >
          {subsEnabled
            ? <><ToggleRight className="w-5 h-5" /> Disable Subscriptions</>
            : <><ToggleLeft className="w-5 h-5" /> Enable Subscriptions</>}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Repeat2 className="w-6 h-6 text-[#4ade80]" /> Subscriptions
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Manage active Subscribe &amp; Save customers.</p>
        </div>
        <button onClick={syncFromStore} disabled={syncing}
          className="flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-60 text-[#0b0d13] font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing…' : syncMsg || 'Sync from Store'}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`${CARD} p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.accent}18` }}>
                <k.icon className="w-4 h-4" style={{ color: k.accent }} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.change > 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {k.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(k.change)}%
              </span>
            </div>
            <p className="text-2xl font-black text-white">{k.value}</p>
            <p className="text-xs text-white/35 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <SubCharts />

      {/* Filter + Search */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white/5 rounded-xl p-1 gap-0.5">
          {FILTER_TABS.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${filter === t.key ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}>
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === t.key ? 'bg-white/15' : 'bg-white/5'}`}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers…"
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors w-64" />
        </div>
      </div>

      {/* Table */}
      <div className={`${CARD} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Customer', 'Plan', 'Product', 'Status', 'Next Billing', 'Revenue', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/3 transition-colors cursor-pointer" onClick={() => setSelected(s)}>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#4ade80] font-semibold">{s.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white/80 text-xs">{s.customer}</div>
                    <div className="text-white/30 text-[10px]">{s.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${PLAN_COLOR[s.plan]}`}>{s.plan}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/50 text-xs max-w-[160px] truncate">{s.product}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/50 text-xs">{s.nextBilling}</td>
                  <td className="px-5 py-3.5 font-bold text-white text-xs">${s.totalRevenue}</td>
                  <td className="px-5 py-3.5">
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30 text-sm">No subscriptions found.</div>
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
                <p className="text-xs text-white/40 mt-0.5">{selected.customer}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[selected.status]}`}>{selected.status}</span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${PLAN_COLOR[selected.plan]}`}>{selected.plan} Plan</span>
              </div>

              {/* Contact */}
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Contact</h3>
                <div className="flex items-center gap-2.5 text-sm text-white/60"><Mail className="w-4 h-4 text-white/25" />{selected.email}</div>
                <div className="flex items-center gap-2.5 text-sm text-white/60"><Phone className="w-4 h-4 text-white/25" />{selected.phone}</div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Price', value: `$${selected.price}/${selected.plan === 'Monthly' ? 'mo' : selected.plan === 'Quarterly' ? 'qtr' : 'yr'}` },
                  { label: 'Orders', value: selected.totalOrders },
                  { label: 'Revenue', value: `$${selected.totalRevenue}` },
                ].map(s => (
                  <div key={s.label} className="bg-white/4 rounded-xl p-3 text-center">
                    <p className="text-white font-bold text-sm">{s.value}</p>
                    <p className="text-white/35 text-[10px] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Dates</h3>
                <div className="flex items-center gap-2.5 text-sm text-white/60"><Calendar className="w-4 h-4 text-white/25" />Started: {selected.startDate}</div>
                {selected.nextBilling !== '—' && (
                  <div className="flex items-center gap-2.5 text-sm text-white/60"><RefreshCw className="w-4 h-4 text-white/25" />Next billing: {selected.nextBilling}</div>
                )}
              </div>

              {/* Reason */}
              {(selected.pausedReason || selected.cancelledReason) && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-400 mb-1">{selected.status === 'PAUSED' ? 'Pause Reason' : 'Cancellation Reason'}</p>
                  <p className="text-sm text-amber-300/70">{selected.pausedReason || selected.cancelledReason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Actions</h3>
                {selected.status === 'ACTIVE' && (
                  <button onClick={() => updateSubStatus(selected.id, 'PAUSED')} className="w-full flex items-center justify-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/20 text-amber-400 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                    <Pause className="w-4 h-4" /> Pause Subscription
                  </button>
                )}
                {selected.status === 'PAUSED' && (
                  <button onClick={() => updateSubStatus(selected.id, 'ACTIVE')} className="w-full flex items-center justify-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                    <Play className="w-4 h-4" /> Resume Subscription
                  </button>
                )}
                {selected.status !== 'CANCELLED' && (
                  <button onClick={() => updateSubStatus(selected.id, 'CANCELLED')} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                    <XCircle className="w-4 h-4" /> Cancel Subscription
                  </button>
                )}
                <button onClick={() => selected && emailCustomer(selected.email)} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold py-2.5 rounded-xl text-sm transition-colors">
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
