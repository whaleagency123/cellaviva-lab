'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Search, X, Mail, Phone, MapPin, ShoppingBag, Star,
  TrendingUp, Calendar, ChevronRight, UserCheck, Loader2, RefreshCw,
} from 'lucide-react'

interface CustomerOrder {
  id: string; date: string; total: number; status: string; items: string[]
}

interface Customer {
  id: string; name: string; email: string; phone: string
  location: string; country: string; tags: string[]
  totalOrders: number; totalSpent: number; avgOrderValue: number; ltv: number
  firstOrder: string; lastOrder: string
  emailSubscribed: boolean; smsSubscribed: boolean
  status: 'ACTIVE' | 'AT_RISK' | 'CHURNED' | 'NEW'
  notes: string; orders: CustomerOrder[]
  avatarUrl: string | null; joinedAt: string
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-400',
  NEW: 'bg-blue-500/15 text-blue-400',
  AT_RISK: 'bg-amber-500/15 text-amber-400',
  CHURNED: 'bg-red-500/15 text-red-400',
}

const ORDER_STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-white/8 text-white/50',
  PROCESSING: 'bg-blue-500/15 text-blue-400',
  SHIPPED: 'bg-purple-500/15 text-purple-400',
  DELIVERED: 'bg-emerald-500/15 text-emerald-400',
  REFUNDED: 'bg-red-500/15 text-red-400',
}

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'
const INPUT = 'bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'

function Avatar({ customer, size = 'sm' }: { customer: Customer; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 56 : 36
  const cls = size === 'lg'
    ? 'w-14 h-14 rounded-2xl flex-shrink-0'
    : 'w-9 h-9 rounded-full flex-shrink-0'
  const initials = customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  if (customer.avatarUrl) {
    return (
      <Image
        src={customer.avatarUrl}
        alt={customer.name}
        width={dim}
        height={dim}
        className={`${cls} object-cover`}
        referrerPolicy="no-referrer"
      />
    )
  }
  return (
    <div className={`${cls} bg-gradient-to-br from-[#4ade80] to-[#16a34a] flex items-center justify-center text-[#0b0d13] font-bold`}
      style={{ fontSize: size === 'lg' ? 18 : 13 }}>
      {initials}
    </div>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState<Customer | null>(null)

  async function fetchCustomers() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/customers')
      if (!res.ok) throw new Error('Failed to load customers')
      const data: Customer[] = await res.json()
      setCustomers(data)
    } catch {
      setError('Could not load customers. Check your Clerk configuration.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
    return matchSearch && (statusFilter === 'ALL' || c.status === statusFilter)
  })

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)
  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0)
  const avgLTV = customers.length ? Math.round(customers.reduce((s, c) => s + c.ltv, 0) / customers.length) : 0

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Customers</h1>
          <p className="text-white/40 mt-0.5 text-sm">
            {loading ? 'Loading…' : `${customers.length} registered customers · €${totalRevenue.toLocaleString()} total revenue`}
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: UserCheck, accent: '#60a5fa', bg: 'bg-blue-500/10' },
          { label: 'Active', value: customers.filter((c) => c.status === 'ACTIVE').length, icon: Star, accent: '#4ade80', bg: 'bg-emerald-500/10' },
          { label: 'Avg LTV', value: `€${avgLTV}`, icon: TrendingUp, accent: '#a78bfa', bg: 'bg-purple-500/10' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, accent: '#f59e0b', bg: 'bg-amber-500/10' },
        ].map((k) => (
          <div key={k.label} className={`${CARD} p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${k.bg} flex-shrink-0`}>
              <k.icon className="w-5 h-5" style={{ color: k.accent }} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{k.value}</p>
              <p className="text-xs text-white/40">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
            className={`w-full pl-9 pr-4 py-2.5 ${INPUT}`} />
        </div>
        <div className="flex rounded-xl border border-white/10 overflow-hidden text-sm">
          {['ALL', 'ACTIVE', 'NEW', 'AT_RISK', 'CHURNED'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 font-medium transition-colors whitespace-nowrap ${statusFilter === s ? 'bg-[#4ade80] text-[#0b0d13]' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}>
              {s === 'ALL' ? 'All' : s === 'AT_RISK' ? 'At Risk' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / error states */}
      {loading && (
        <div className={`${CARD} p-16 flex flex-col items-center justify-center gap-3`}>
          <Loader2 className="w-8 h-8 animate-spin text-[#4ade80]" />
          <p className="text-white/30 text-sm">Loading customers from Clerk…</p>
        </div>
      )}

      {error && !loading && (
        <div className={`${CARD} p-10 text-center`}>
          <p className="text-red-400 font-semibold mb-1">{error}</p>
          <button onClick={fetchCustomers} className="mt-3 text-sm text-[#4ade80] hover:underline">Try again</button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className={`${CARD} overflow-hidden`}>
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-white/20 text-4xl mb-3">👤</p>
              <p className="text-white/40 font-semibold">
                {customers.length === 0 ? 'No customers have registered yet.' : 'No customers match your search.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/3">
                  {['Customer', 'Status', 'Provider', 'Orders', 'Total Spent', 'LTV', 'Joined', 'Last Sign-in', ''].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/3 cursor-pointer transition-colors" onClick={() => setSelected(c)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar customer={c} size="sm" />
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-xs text-white/30">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[c.status]}`}>
                        {c.status === 'AT_RISK' ? 'At Risk' : c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {c.tags.length > 0 ? (
                        <span className="text-xs bg-white/8 text-white/50 px-2.5 py-0.5 rounded-full capitalize">{c.tags[0]}</span>
                      ) : (
                        <span className="text-xs text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white/60">{c.totalOrders}</td>
                    <td className="px-5 py-4 font-bold text-white">€{c.totalSpent}</td>
                    <td className="px-5 py-4 text-[#4ade80] font-semibold">€{c.ltv}</td>
                    <td className="px-5 py-4 text-xs text-white/30">{c.joinedAt}</td>
                    <td className="px-5 py-4 text-xs text-white/30">{c.lastOrder}</td>
                    <td className="px-5 py-4">
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Customer detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="w-[560px] max-w-full bg-[#0f1117] border-l border-white/5 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Customer Profile</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile header */}
              <div className="flex items-start gap-4">
                <Avatar customer={selected} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-white">{selected.name}</h3>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[selected.status]}`}>
                      {selected.status === 'AT_RISK' ? 'At Risk' : selected.status.charAt(0) + selected.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {selected.tags.map((t) => (
                      <span key={t} className="text-xs bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded-full font-semibold capitalize">{t}</span>
                    ))}
                  </div>
                  <p className="text-xs text-white/25 mt-1.5">Clerk ID: {selected.id}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white/4 border border-white/5 rounded-2xl p-4 space-y-2.5">
                <p className="text-xs font-bold text-white/30 uppercase tracking-wider">Contact</p>
                <div className="flex items-center gap-2.5 text-sm text-white/60"><Mail className="w-4 h-4 text-white/25" />{selected.email || '—'}</div>
                {selected.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-white/60"><Phone className="w-4 h-4 text-white/25" />{selected.phone}</div>
                )}
                {selected.location && (
                  <div className="flex items-center gap-2.5 text-sm text-white/60"><MapPin className="w-4 h-4 text-white/25" />{selected.location}</div>
                )}
                <div className="flex items-center gap-2.5 text-sm text-white/60"><Calendar className="w-4 h-4 text-white/25" />Joined {selected.joinedAt}</div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Orders', value: selected.totalOrders },
                  { label: 'Total Spent', value: `€${selected.totalSpent}` },
                  { label: 'Lifetime Value', value: `€${selected.ltv}` },
                ].map((m) => (
                  <div key={m.label} className="bg-white/4 border border-white/5 rounded-xl p-3.5 text-center">
                    <p className="text-xl font-black text-white">{m.value}</p>
                    <p className="text-xs text-white/30 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="bg-amber-500/8 border border-amber-500/15 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">Internal Note</p>
                  <p className="text-sm text-white/70">{selected.notes}</p>
                </div>
              )}

              {/* Order history */}
              {selected.orders.length > 0 ? (
                <div>
                  <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3">Order History</p>
                  <div className="space-y-2">
                    {selected.orders.map((o) => (
                      <div key={o.id} className="flex items-start justify-between p-3.5 rounded-xl border border-white/5 hover:border-[#4ade80]/20 transition-colors bg-white/3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-white">{o.id}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ORDER_STATUS_BADGE[o.status] ?? 'bg-white/8 text-white/40'}`}>{o.status}</span>
                          </div>
                          <p className="text-xs text-white/30">{o.items.join(' · ')}</p>
                          <p className="text-xs text-white/25 mt-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" />{o.date}</p>
                        </div>
                        <p className="text-sm font-black text-white">€{o.total}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/3 border border-white/5 rounded-xl p-5 text-center">
                  <p className="text-white/25 text-sm">No orders yet</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex gap-3">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Send Email
              </a>
              <a
                href={`https://dashboard.clerk.com/users/${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#4ade80] text-[#0b0d13] text-sm font-semibold hover:bg-[#22c55e] transition-colors flex items-center justify-center gap-2"
              >
                View in Clerk
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
