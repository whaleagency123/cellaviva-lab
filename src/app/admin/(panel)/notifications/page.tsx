'use client'
import { useState } from 'react'
import { Bell, Package, ShoppingCart, AlertTriangle, Users, X, CheckCheck } from 'lucide-react'

type NotifType = 'order' | 'stock' | 'customer' | 'payment' | 'system'

interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
}

const INITIAL: Notification[] = [
  { id: 'n1',  type: 'order',    title: 'New Order #ORD-4822',              body: 'Nina Park placed a new order for €49.00.',                        time: '2 min ago',  read: false },
  { id: 'n2',  type: 'payment',  title: 'Payment Confirmed #ORD-4821',      body: 'Stripe payment of €98.00 confirmed for Sarah Miller.',            time: '14 min ago', read: false },
  { id: 'n3',  type: 'stock',    title: 'Low Stock: Hair Cleanse',          body: 'Stemuvita™ Hair Cleanse is below threshold — 47 units remaining.', time: '1 hr ago',  read: false },
  { id: 'n4',  type: 'order',    title: 'Order #ORD-4820 Shipped',          body: 'James Thompson\'s order was shipped via DHL (PN9876543210).',      time: '2 hr ago',  read: true  },
  { id: 'n5',  type: 'customer', title: 'New Customer Signup',              body: 'elena@example.com created a new account.',                        time: '3 hr ago',  read: true  },
  { id: 'n6',  type: 'order',    title: 'Return Request #RET-002',          body: 'Lucas Becker submitted a return request for Scalp Serum.',        time: '5 hr ago',  read: true  },
  { id: 'n7',  type: 'payment',  title: 'Subscription Renewed SUB-1007',   body: 'Yuki Tanaka\'s quarterly subscription renewed — €105.00 charged.', time: '6 hr ago',  read: true  },
  { id: 'n8',  type: 'system',   title: 'Appearance Settings Updated',     body: 'Primary colour changed to #3a79a9 by Admin.',                     time: '1 day ago',  read: true  },
  { id: 'n9',  type: 'stock',    title: 'Scalp Serum Restocked',           body: 'Stemuvita™ Scalp Serum stock updated to 63 units.',               time: '1 day ago',  read: true  },
  { id: 'n10', type: 'customer', title: '5-Star Review Pending Approval',  body: 'Sarah Miller left a 5-star review — awaiting moderation.',        time: '2 days ago', read: true  },
]

const TYPE_ICON: Record<NotifType, typeof Bell> = {
  order:    ShoppingCart,
  stock:    AlertTriangle,
  customer: Users,
  payment:  CheckCheck,
  system:   Bell,
}

const TYPE_COLOR: Record<NotifType, string> = {
  order:    '#60a5fa',
  stock:    '#f59e0b',
  customer: '#a78bfa',
  payment:  '#4ade80',
  system:   '#94a3b8',
}

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function dismiss(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const visible = filter === 'unread' ? notifs.filter(n => !n.read) : notifs

  return (
    <div className="p-8 space-y-7 min-h-screen bg-[#0f1117]">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-[#4ade80]" /> Notifications
            {unreadCount > 0 && (
              <span className="bg-[#4ade80] text-[#0b0d13] text-xs font-black px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Store alerts, order events, and system updates.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 gap-0.5 w-fit">
        {[
          { key: 'all',    label: 'All',    count: notifs.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key as 'all' | 'unread')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${filter === t.key ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}>
            {t.label}
            {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === t.key ? 'bg-white/15' : 'bg-white/5'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className={`${CARD} divide-y divide-white/5 overflow-hidden`}>
        {visible.length === 0 && (
          <div className="py-16 text-center text-white/30 text-sm">
            <Bell className="w-10 h-10 mx-auto mb-3 text-white/10" />
            No notifications
          </div>
        )}
        {visible.map(n => {
          const Icon = TYPE_ICON[n.type]
          const color = TYPE_COLOR[n.type]
          return (
            <div key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${n.read ? 'hover:bg-white/2' : 'bg-white/4 hover:bg-white/6'}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}18` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${n.read ? 'text-white/60' : 'text-white'}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[#4ade80] flex-shrink-0" />}
                </div>
                <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-white/20 mt-1">{n.time}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                className="text-white/15 hover:text-white/50 transition-colors p-1 rounded-lg hover:bg-white/5 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
