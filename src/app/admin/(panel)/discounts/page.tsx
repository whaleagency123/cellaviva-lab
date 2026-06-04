'use client'
import { useState, useEffect } from 'react'
import {
  Plus, Search, X, Copy, Tag, Percent, DollarSign,
  Calendar, CheckCircle, XCircle, Clock,
  Edit2, Trash2, ToggleLeft, ToggleRight, RefreshCw, Loader2,
} from 'lucide-react'

type DiscountType = 'PERCENTAGE' | 'FIXED'
type DiscountStatus = 'ACTIVE' | 'DISABLED' | 'EXPIRED'

interface Discount {
  id: string
  code: string
  type: DiscountType
  value: number
  minOrder: number | null
  usageLimit: number | null
  usedCount: number
  expiresAt: string | null
  active: boolean
  createdAt: string
}

interface FormState {
  code: string
  type: DiscountType
  value: number
  minOrder: string
  usageLimit: string
  expiresAt: string
  active: boolean
}

const EMPTY_FORM: FormState = {
  code: '', type: 'PERCENTAGE', value: 10,
  minOrder: '', usageLimit: '', expiresAt: '', active: true,
}

function getStatus(d: Discount): DiscountStatus {
  if (!d.active) return 'DISABLED'
  if (d.expiresAt && new Date(d.expiresAt) < new Date()) return 'EXPIRED'
  return 'ACTIVE'
}

const STATUS_BADGE: Record<DiscountStatus, string> = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-400',
  EXPIRED: 'bg-white/8 text-white/40',
  DISABLED: 'bg-red-500/15 text-red-400',
}
const STATUS_ICON: Record<DiscountStatus, React.ElementType> = {
  ACTIVE: CheckCircle, EXPIRED: XCircle, DISABLED: XCircle,
}
const TYPE_LABEL: Record<DiscountType, string> = { PERCENTAGE: '% Off', FIXED: '€ Off' }
const TYPE_ICON: Record<DiscountType, React.ElementType> = { PERCENTAGE: Percent, FIXED: DollarSign }

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'
const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  async function fetchDiscounts() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/discounts')
      if (res.ok) setDiscounts(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDiscounts() }, [])

  const filtered = discounts.filter((d) => {
    const status = getStatus(d)
    return d.code.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === 'ALL' || status === statusFilter)
  })

  function openCreate() {
    setForm({ ...EMPTY_FORM, code: generateCode() })
    setIsEditing(null); setSaveError(''); setShowModal(true)
  }
  function openEdit(d: Discount) {
    setForm({
      code: d.code, type: d.type, value: d.value,
      minOrder: d.minOrder ? String(d.minOrder) : '',
      usageLimit: d.usageLimit ? String(d.usageLimit) : '',
      expiresAt: d.expiresAt ? d.expiresAt.split('T')[0] : '',
      active: d.active,
    })
    setIsEditing(d.id); setSaveError(''); setShowModal(true)
  }

  async function saveDiscount() {
    if (!form.code.trim()) return
    setSaving(true); setSaveError('')
    try {
      const payload = {
        code: form.code, type: form.type, value: form.value,
        minOrder: form.minOrder || null,
        usageLimit: form.usageLimit || null,
        expiresAt: form.expiresAt || null,
        active: form.active,
      }
      const res = await fetch(
        isEditing ? `/api/admin/discounts/${isEditing}` : '/api/admin/discounts',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()
      if (!res.ok) { setSaveError(data.error ?? 'Save failed'); return }

      if (isEditing) {
        setDiscounts((prev) => prev.map((d) => d.id === isEditing ? data : d))
      } else {
        setDiscounts((prev) => [data, ...prev])
      }
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteDiscount(id: string) {
    if (!confirm('Delete this discount code?')) return
    await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' })
    setDiscounts((prev) => prev.filter((d) => d.id !== id))
  }

  async function toggleActive(d: Discount) {
    const res = await fetch(`/api/admin/discounts/${d.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !d.active }),
    })
    if (res.ok) {
      const updated = await res.json()
      setDiscounts((prev) => prev.map((x) => x.id === d.id ? updated : x))
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(code); setTimeout(() => setCopied(null), 1500)
  }

  const activeCount = discounts.filter((d) => getStatus(d) === 'ACTIVE').length
  const totalUses = discounts.reduce((s, d) => s + d.usedCount, 0)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Discounts</h1>
          <p className="text-white/40 mt-0.5 text-sm">{discounts.length} codes · {activeCount} active · {totalUses.toLocaleString()} total uses</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDiscounts} className="p-2.5 rounded-xl border border-white/10 text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0b0d13] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" /> Create Discount
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search discount codes…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors" />
        </div>
        <div className="flex rounded-xl border border-white/10 overflow-hidden text-sm">
          {['ALL', 'ACTIVE', 'EXPIRED', 'DISABLED'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 font-medium transition-colors ${statusFilter === s ? 'bg-[#4ade80] text-[#0b0d13]' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`${CARD} overflow-hidden`}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {['Code', 'Type', 'Value', 'Min. Order', 'Usage', 'Expires', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((d) => {
                const status = getStatus(d)
                const SI = STATUS_ICON[status]
                const TI = TYPE_ICON[d.type]
                const usagePct = d.usageLimit ? Math.round((d.usedCount / d.usageLimit) * 100) : null
                return (
                  <tr key={d.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#4ade80]" />
                        <span className="font-mono font-bold text-white tracking-wider">{d.code}</span>
                        <button onClick={() => copyCode(d.code)} className="p-1 rounded text-white/20 hover:text-white/60 transition-colors">
                          {copied === d.code ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <TI className="w-3.5 h-3.5" />{TYPE_LABEL[d.type]}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-white">
                      {d.type === 'PERCENTAGE' ? `${d.value}%` : `€${d.value}`}
                    </td>
                    <td className="px-5 py-4 text-xs text-white/40">
                      {d.minOrder ? `€${d.minOrder}+` : <span className="text-white/20">None</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="min-w-[100px]">
                        <p className="text-xs text-white/40 mb-1">
                          {d.usedCount.toLocaleString()}{d.usageLimit ? ` / ${d.usageLimit.toLocaleString()}` : ' used'}
                        </p>
                        {usagePct !== null && (
                          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden w-24">
                            <div className={`h-full rounded-full ${usagePct >= 90 ? 'bg-red-400' : 'bg-[#4ade80]'}`} style={{ width: `${usagePct}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-white/30">
                      {d.expiresAt ? (
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{d.expiresAt.split('T')[0]}</div>
                      ) : (
                        <span className="text-white/20">No end date</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status]}`}>
                        <SI className="w-3 h-3" />{status.charAt(0) + status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleActive(d)} className="p-1.5 rounded-lg text-white/30 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors">
                          {d.active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-white/30 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteDiscount(d.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={8} className="px-5 py-16 text-center text-white/30">No discount codes match your filter.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0f1117] border border-white/8 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{isEditing ? 'Edit Discount' : 'Create Discount'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Code */}
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Discount Code *</label>
                <div className="flex gap-2">
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={`flex-1 ${INPUT} font-mono font-bold tracking-wider uppercase`}
                    placeholder="DISCOUNT20" />
                  <button onClick={() => setForm({ ...form, code: generateCode() })}
                    className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors whitespace-nowrap">
                    Generate
                  </button>
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2">Discount Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['PERCENTAGE', 'FIXED'] as DiscountType[]).map((t) => {
                    const TI = TYPE_ICON[t]
                    return (
                      <button key={t} onClick={() => setForm({ ...form, type: t })}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.type === t ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}>
                        <TI className="w-4 h-4" />{TYPE_LABEL[t]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">
                  {form.type === 'PERCENTAGE' ? 'Percentage Off (%)' : 'Amount Off (€)'}
                </label>
                <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  min={1} max={form.type === 'PERCENTAGE' ? 100 : undefined} className={INPUT} />
              </div>

              {/* Min order */}
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Minimum Order Value (€)</label>
                <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  className={INPUT} placeholder="No minimum" />
              </div>

              {/* Usage limit */}
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Usage Limit</label>
                <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  className={INPUT} placeholder="Unlimited" />
              </div>

              {/* Expires */}
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Expires At (optional)</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className={`${INPUT} [color-scheme:dark]`} />
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/8 hover:border-white/15 transition-colors">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded accent-[#4ade80]" />
                <div>
                  <p className="text-sm font-semibold text-white/70">Active</p>
                  <p className="text-xs text-white/30">Customers can use this code at checkout</p>
                </div>
              </label>

              {saveError && <p className="text-sm text-red-400">{saveError}</p>}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors">
                Cancel
              </button>
              <button onClick={saveDiscount} disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#4ade80] text-[#0b0d13] text-sm font-semibold hover:bg-[#22c55e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Discount'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
