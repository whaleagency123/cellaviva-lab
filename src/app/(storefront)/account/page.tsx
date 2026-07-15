'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  User, Package, RefreshCw, MapPin, Bell, Lock,
  ChevronRight, Star, CheckCircle, Clock, Truck,
  Edit2, Plus, Trash2, Eye, EyeOff, X, Check, Loader2,
} from 'lucide-react'

type Tab = 'overview' | 'orders' | 'subscriptions' | 'addresses' | 'notifications' | 'security'

interface Order {
  id: string
  date: string
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED'
  total: number
  items: { name: string; qty: number; price: number; img: string }[]
  tracking?: string
}

interface Subscription {
  id: string
  product: string
  price: number
  interval: string
  nextDelivery: string
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED'
}

interface Address {
  id: string
  label: string
  name: string
  line1: string
  line2?: string
  city: string
  postcode: string
  country: string
  isDefault: boolean
}

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_001',
    product: 'Stemuvita™ Hair Cleanse',
    price: 41.65,
    interval: 'Every 30 days',
    nextDelivery: '24 Jun 2026',
    status: 'ACTIVE',
  },
]

const EMPTY_ADDRESS_FORM = {
  label: 'Home',
  name: '',
  line1: '',
  line2: '',
  city: '',
  postcode: '',
  country: '',
}

const STATUS_BADGE: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED:    'bg-purple-100 text-purple-700',
  DELIVERED:  'bg-emerald-100 text-emerald-700',
  CANCELLED:  'bg-red-100 text-red-600',
  REFUNDED:   'bg-red-100 text-red-600',
}

const STATUS_ICON: Record<string, React.ElementType> = {
  PENDING:    Clock,
  PROCESSING: Clock,
  SHIPPED:    Truck,
  DELIVERED:  CheckCircle,
  CANCELLED:  RefreshCw,
  REFUNDED:   RefreshCw,
}

const SUB_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Password & Security', icon: Lock },
]

export default function AccountPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const nameParts = session?.user?.name?.split(' ') ?? []
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ')
  const email = session?.user?.email ?? ''
  const avatarUrl = session?.user?.image ?? null
  const provider = session?.user?.provider ?? null

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login?callbackUrl=/account')
  }, [status, router])

  const [tab, setTab] = useState<Tab>('overview')
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS)

  // Real addresses from DB — new accounts start empty until the customer adds one.
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [addressModal, setAddressModal] = useState<{ mode: 'add' | 'edit'; id?: string } | null>(null)
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM)
  const [addressSaving, setAddressSaving] = useState(false)
  const [addressError, setAddressError] = useState('')

  function fetchAddresses() {
    setAddressesLoading(true)
    fetch('/api/addresses')
      .then(r => r.json())
      .then((data: Address[]) => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setAddressesLoading(false))
  }
  useEffect(() => {
    if (!email) return
    fetchAddresses()
  }, [email])

  function openAddAddress() {
    setAddressForm(EMPTY_ADDRESS_FORM)
    setAddressError('')
    setAddressModal({ mode: 'add' })
  }
  function openEditAddress(a: Address) {
    setAddressForm({ label: a.label, name: a.name, line1: a.line1, line2: a.line2 ?? '', city: a.city, postcode: a.postcode, country: a.country })
    setAddressError('')
    setAddressModal({ mode: 'edit', id: a.id })
  }
  async function saveAddress() {
    if (!addressForm.name || !addressForm.line1 || !addressForm.city || !addressForm.postcode || !addressForm.country) {
      setAddressError('Please fill in all required fields.')
      return
    }
    setAddressSaving(true)
    setAddressError('')
    try {
      const res = await fetch(
        addressModal?.mode === 'edit' ? `/api/addresses/${addressModal.id}` : '/api/addresses',
        {
          method: addressModal?.mode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addressForm),
        }
      )
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save address')
      setAddressModal(null)
      fetchAddresses()
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setAddressSaving(false)
    }
  }
  async function deleteAddress(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    await fetch(`/api/addresses/${id}`, { method: 'DELETE' }).catch(() => {})
    fetchAddresses()
  }

  // Real orders from DB — new accounts start empty until they place an order.
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  useEffect(() => {
    if (!email) return
    setOrdersLoading(true)
    fetch('/api/orders')
      .then(r => r.json())
      .then((data: { orders?: { id: string; total: number; status: string; createdAt: string; lineItems: { quantity: number; price: number; product: { title: string } | null }[] }[] }) => {
        setOrders((data.orders ?? []).map(o => ({
          id: o.id.slice(0, 10).toUpperCase(),
          date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: o.status as Order['status'],
          total: o.total,
          items: o.lineItems.map(li => ({
            name:  li.product?.title ?? 'Product',
            qty:   li.quantity,
            price: li.price,
            img:   '🌿',
          })),
        })))
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false))
  }, [email])
  const [showPw, setShowPw] = useState(false)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    subscriptionReminders: true,
    sms: false,
  })
  const [profileEdit, setProfileEdit] = useState(false)
  const [profile, setProfile] = useState({
    firstName,
    lastName,
    email,
    phone: '',
  })
  const [profileDraft, setProfileDraft] = useState(profile)
  const [savedProfile, setSavedProfile] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#52b788]" />
      </div>
    )
  }

  if (!session) return null

  function toggleSubStatus(id: string) {
    setSubscriptions((prev) => prev.map((s) =>
      s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : s
    ))
  }

  async function setDefaultAddress(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
    await fetch(`/api/addresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setDefault: true }),
    }).catch(() => {})
  }

  function saveProfile() {
    setProfile(profileDraft)
    setProfileEdit(false)
    setSavedProfile(true)
    setTimeout(() => setSavedProfile(false), 2000)
  }

  const totalSpent = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen bg-[#f8f9f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">Manage your orders, subscriptions, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={session.user?.name ?? 'Profile'}
                  width={64}
                  height={64}
                  className="rounded-full mx-auto mb-3 border-2 border-[#52b788]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#52b788] to-[#1b4332] flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
                  {(firstName[0] ?? 'U').toUpperCase()}
                </div>
              )}
              <p className="font-bold text-gray-900">{firstName} {lastName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{email}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xl font-black text-gray-900">{orders.length}</p>
                  <p className="text-xs text-gray-400">Orders</p>
                </div>
                <div>
                  <p className="text-xl font-black text-[#2d6a4f]">${totalSpent}</p>
                  <p className="text-xs text-gray-400">Spent</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all text-left border-b border-gray-50 last:border-0 ${
                    tab === item.id
                      ? 'bg-[#f0faf4] text-[#1b4332] font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${tab === item.id ? 'text-[#52b788]' : 'text-gray-400'}`} />
                  {item.label}
                  {tab === item.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#52b788]" />}
                </button>
              ))}
            </nav>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-sm text-red-400 hover:text-red-600 font-medium py-2 transition-colors"
            >
              Sign Out
            </button>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-6">

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <>
                {/* Welcome */}
                <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] rounded-3xl p-7 text-white">
                  <p className="text-white/60 text-sm mb-1">Welcome back,</p>
                  <h2 className="text-2xl font-black mb-4">{firstName || 'there'} 👋</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Total Orders', value: orders.length },
                      { label: 'Total Spent', value: `$${totalSpent}` },
                      { label: 'Active Subs', value: subscriptions.filter((s) => s.status === 'ACTIVE').length },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-black">{s.value}</p>
                        <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent order */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-900">Latest Order</h3>
                    {orders.length > 0 && (
                      <button onClick={() => setTab('orders')} className="text-sm text-[#2d6a4f] hover:underline font-medium">
                        View all →
                      </button>
                    )}
                  </div>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-[#52b788]" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-3xl mb-3">🌿</p>
                      <p className="font-bold text-gray-900 mb-1">No orders yet</p>
                      <p className="text-gray-400 text-sm mb-4">Your orders will show up here once you place one.</p>
                      <Link href="/shop" className="inline-block bg-[var(--sf-primary)] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[var(--sf-primary-dark)] transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (() => {
                    const o = orders[0]
                    const SI = STATUS_ICON[o.status]
                    return (
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#d8f3dc] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                            {o.items[0].img}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{o.id}</p>
                            <p className="text-xs text-gray-400">{o.date} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[o.status]}`}>
                            <SI className="w-3 h-3" />{o.status}
                          </span>
                          <span className="font-bold text-gray-900">${o.total}</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Active subscription */}
                {subscriptions.filter((s) => s.status === 'ACTIVE').length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-gray-900">Active Subscription</h3>
                      <button onClick={() => setTab('subscriptions')} className="text-sm text-[#2d6a4f] hover:underline font-medium">
                        Manage →
                      </button>
                    </div>
                    {subscriptions.filter((s) => s.status === 'ACTIVE').map((s) => (
                      <div key={s.id} className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#d8f3dc] rounded-xl flex items-center justify-center text-xl">🌿</div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{s.product}</p>
                            <p className="text-xs text-gray-400">{s.interval} · Next: {s.nextDelivery}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#2d6a4f]">${s.price}/mo</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SUB_BADGE[s.status]}`}>{s.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Profile quick edit */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-900">Profile Details</h3>
                    <button onClick={() => { setProfileEdit(true); setProfileDraft(profile) }} className="flex items-center gap-1.5 text-sm text-[#2d6a4f] hover:underline font-medium">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                      { label: 'First Name', value: profile.firstName },
                      { label: 'Last Name', value: profile.lastName },
                      { label: 'Email', value: profile.email },
                      { label: 'Phone', value: profile.phone },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{f.label}</p>
                        <p className="text-gray-900 font-medium">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ORDERS */}
            {tab === 'orders' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-lg">Order History</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{orders.length} orders placed</p>
                </div>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-[#52b788]" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-4xl mb-4">🌿</p>
                    <p className="font-bold text-gray-900 mb-1">No orders yet</p>
                    <p className="text-gray-400 text-sm mb-5">When you place an order, it'll show up here.</p>
                    <Link href="/shop" className="inline-block bg-[var(--sf-primary)] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--sf-primary-dark)] transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                <div className="divide-y divide-gray-50">
                  {orders.map((o) => {
                    const SI = STATUS_ICON[o.status]
                    return (
                      <div key={o.id} className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{o.id}</p>
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[o.status]}`}>
                                <SI className="w-3 h-3" />{o.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{o.date}</p>
                          </div>
                          <p className="font-black text-lg text-gray-900">${o.total}</p>
                        </div>

                        {/* Items */}
                        <div className="space-y-3 mb-4">
                          {o.items.map((item) => (
                            <div key={item.name} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#d8f3dc] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                                {item.img}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                              </div>
                              <p className="text-sm font-bold text-gray-900">${item.price}</p>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 flex-wrap">
                          {o.tracking && (
                            <Link href="/track-order" className="flex items-center gap-1.5 text-xs font-semibold text-[#2d6a4f] bg-[#d8f3dc] px-3.5 py-2 rounded-full hover:bg-[#b7e4c7] transition-colors">
                              <Truck className="w-3.5 h-3.5" /> Track: {o.tracking}
                            </Link>
                          )}
                          {o.status === 'DELIVERED' && (
                            <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 px-3.5 py-2 rounded-full hover:border-[#52b788] hover:text-[#2d6a4f] transition-colors">
                              <Star className="w-3.5 h-3.5" /> Leave a Review
                            </button>
                          )}
                          <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 px-3.5 py-2 rounded-full hover:border-gray-300 transition-colors">
                            Reorder
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                )}
              </div>
            )}

            {/* SUBSCRIPTIONS */}
            {tab === 'subscriptions' && (
              <div className="space-y-5">
                <div className="bg-[#d8f3dc] rounded-3xl p-5 flex items-center gap-4">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <p className="font-bold text-[#1b4332]">You're saving 15% on every delivery</p>
                    <p className="text-sm text-[#2d6a4f] mt-0.5">Subscriptions automatically renew. Cancel or pause anytime — no fees.</p>
                  </div>
                </div>

                {subscriptions.map((s) => (
                  <div key={s.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#d8f3dc] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🌿</div>
                        <div>
                          <p className="font-bold text-gray-900">{s.product}</p>
                          <p className="text-xs text-gray-400">{s.interval}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${SUB_BADGE[s.status]}`}>{s.status}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                      {[
                        { label: 'Price', value: `$${s.price}/mo` },
                        { label: 'Frequency', value: s.interval },
                        { label: 'Next Delivery', value: s.nextDelivery },
                      ].map((f) => (
                        <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                          <p className="text-sm font-bold text-gray-900">{f.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={async () => {
                          const res = await fetch('/api/subscription/portal', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ returnUrl: window.location.href }),
                          })
                          const data = await res.json()
                          if (data.url) window.location.href = data.url
                        }}
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-[#d8f3dc] text-[#1b4332] border border-[#b7e4c7] hover:bg-[#b7e4c7] transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Manage via Stripe Portal
                      </button>
                    </div>
                  </div>
                ))}

                {subscriptions.length === 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <p className="text-4xl mb-4">📦</p>
                    <p className="font-bold text-gray-900 mb-1">No active subscriptions</p>
                    <p className="text-gray-400 text-sm mb-5">Subscribe to save 15% and never run out.</p>
                    <Link href="/subscribe" className="inline-block bg-[var(--sf-primary)] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--sf-primary-dark)] transition-colors">
                      Subscribe &amp; Save 15%
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES */}
            {tab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={openAddAddress} className="flex items-center gap-2 bg-[#1b4332] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a4f] transition-colors">
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>

                {addressesLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-[#52b788]" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <p className="text-4xl mb-4">📍</p>
                    <p className="font-bold text-gray-900 mb-1">No saved addresses yet</p>
                    <p className="text-gray-400 text-sm mb-5">Add your real shipping address to check out faster next time.</p>
                    <button onClick={openAddAddress} className="inline-block bg-[var(--sf-primary)] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[var(--sf-primary-dark)] transition-colors">
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  addresses.map((a) => (
                    <div key={a.id} className={`bg-white rounded-3xl border shadow-sm p-6 ${a.isDefault ? 'border-[#52b788]' : 'border-gray-100'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{a.label}</span>
                          {a.isDefault && (
                            <span className="text-xs bg-[#d8f3dc] text-[#1b4332] font-bold px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditAddress(a)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#2d6a4f] hover:bg-[#d8f3dc] transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteAddress(a.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p className="font-medium text-gray-900">{a.name}</p>
                        <p>{a.line1}</p>
                        {a.line2 && <p>{a.line2}</p>}
                        <p>{a.city}, {a.postcode}</p>
                        <p>{a.country}</p>
                      </div>
                      {!a.isDefault && (
                        <button onClick={() => setDefaultAddress(a.id)} className="mt-3 text-xs text-[#2d6a4f] font-semibold hover:underline">
                          Set as default
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* NOTIFICATIONS */}
            {tab === 'notifications' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-1">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Notification Preferences</h2>
                {[
                  { key: 'orderUpdates' as const, label: 'Order Updates', desc: 'Shipping confirmations, delivery notifications, and tracking updates.' },
                  { key: 'subscriptionReminders' as const, label: 'Subscription Reminders', desc: 'Upcoming delivery reminders and renewal notifications.' },
                  { key: 'promotions' as const, label: 'Promotions & Offers', desc: 'Exclusive discounts, flash sales, and subscriber-only offers.' },
                  { key: 'newProducts' as const, label: 'New Products', desc: 'Be the first to know when we launch new formulas.' },
                  { key: 'sms' as const, label: 'SMS Notifications', desc: 'Receive important updates via text message.' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div className="flex-1 mr-6">
                      <p className="text-sm font-semibold text-gray-900">{n.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifications[n.key] ? 'bg-[#52b788]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[n.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
                <div className="pt-4">
                  <button className="bg-[#1b4332] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a4f] transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {tab === 'security' && (
              <div className="space-y-5">
                {/* Change password */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-5">Change Password</h2>
                  {provider ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-sm text-blue-700 max-w-md">
                      You signed in with <span className="font-semibold capitalize">{provider}</span>. Password management is handled by your social account provider.
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-md">
                      {[
                        { id: 'current', label: 'Current Password' },
                        { id: 'new', label: 'New Password' },
                        { id: 'confirm', label: 'Confirm New Password' },
                      ].map((f) => (
                        <div key={f.id}>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                          <div className="relative">
                            <input
                              type={showPw ? 'text' : 'password'}
                              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] pr-10"
                              placeholder="••••••••"
                            />
                            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="bg-[#1b4332] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a4f] transition-colors mt-2">
                        Update Password
                      </button>
                    </div>
                  )}
                </div>

                {/* Two-factor */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your account via SMS or authenticator app.</p>
                    </div>
                    <button className="text-sm font-semibold text-[#2d6a4f] border border-[#52b788] px-4 py-2 rounded-xl hover:bg-[#d8f3dc] transition-colors flex-shrink-0">
                      Enable
                    </button>
                  </div>
                </div>

                {/* Connected accounts */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Connected Accounts</h3>
                  {[
                    { name: 'Google', id: 'google', icon: '🔵' },
                    { name: 'Facebook', id: 'facebook', icon: '🔷' },
                  ].map((acc) => {
                    const connected = provider === acc.id
                    return (
                      <div key={acc.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{acc.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{acc.name}</span>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${connected ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-gray-200 text-gray-400'}`}>
                          {connected ? 'Connected' : 'Not connected'}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Danger zone */}
                <div className="bg-red-50 rounded-3xl border border-red-100 p-6">
                  <h3 className="font-bold text-red-700 mb-1">Danger Zone</h3>
                  <p className="text-sm text-red-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <button className="text-sm font-semibold text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
                    Delete My Account
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Profile edit modal */}
      {profileEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setProfileEdit(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Edit Profile</h3>
              <button onClick={() => setProfileEdit(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {([
                { key: 'firstName', label: 'First Name' },
                { key: 'lastName', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
              ] as { key: keyof typeof profileDraft; label: string }[]).map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input
                    value={profileDraft[f.key]}
                    onChange={(e) => setProfileDraft({ ...profileDraft, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setProfileEdit(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveProfile} className="flex-1 bg-[#1b4332] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#2d6a4f] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit address modal */}
      {addressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddressModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">{addressModal.mode === 'edit' ? 'Edit Address' : 'Add Address'}</h3>
              <button onClick={() => setAddressModal(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            {addressError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {addressError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Label</label>
                <input
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder="Home, Work…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address Line 1 *</label>
                <input
                  value={addressForm.line1}
                  onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address Line 2</label>
                <input
                  value={addressForm.line2}
                  onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City *</label>
                  <input
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Postcode *</label>
                  <input
                    value={addressForm.postcode}
                    onChange={(e) => setAddressForm({ ...addressForm, postcode: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Country *</label>
                <input
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setAddressModal(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveAddress} disabled={addressSaving} className="flex-1 bg-[#1b4332] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#2d6a4f] transition-colors disabled:opacity-50">
                {addressSaving ? 'Saving…' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved toast */}
      {savedProfile && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b4332] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold">
          <Check className="w-4 h-4 text-[#52b788]" /> Profile saved successfully
        </div>
      )}
    </div>
  )
}
