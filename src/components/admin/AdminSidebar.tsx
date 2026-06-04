'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, BarChart3, Settings,
  Package, ExternalLink, Users, Tag, Bell, LogOut, Shield, Palette,
  Repeat2, Star, RotateCcw, Megaphone, Type, CreditCard, Newspaper, Puzzle, Layers, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Permission } from '@/lib/permissions-shared'

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  permission: Permission
}

const ALL_NAV: NavItem[] = [
  { href: '/admin',              icon: LayoutDashboard, label: 'Dashboard',          permission: 'dashboard'     },
  { href: '/admin/builder',      icon: Layers,          label: 'Page Builder',       permission: 'builder'       },
  { href: '/admin/library',      icon: BookOpen,        label: 'Section Library',    permission: 'builder'       },
  { href: '/admin/orders',       icon: ShoppingCart,    label: 'Orders',             permission: 'orders'        },
  { href: '/admin/payments',     icon: CreditCard,      label: 'Payments',           permission: 'payments'      },
  { href: '/admin/products',     icon: Package,         label: 'Products',           permission: 'products'      },
  { href: '/admin/customers',    icon: Users,           label: 'Customers',          permission: 'customers'     },
  { href: '/admin/subscriptions',icon: Repeat2,         label: 'Subscriptions',      permission: 'subscriptions' },
  { href: '/admin/reviews',      icon: Star,            label: 'Reviews',            permission: 'reviews'       },
  { href: '/admin/returns',      icon: RotateCcw,       label: 'Returns',            permission: 'returns'       },
  { href: '/admin/discounts',    icon: Tag,             label: 'Discounts',          permission: 'discounts'     },
  { href: '/admin/channels',     icon: Megaphone,       label: 'Channels & Ads',     permission: 'channels'      },
  { href: '/admin/analytics',    icon: BarChart3,       label: 'Analytics',          permission: 'analytics'     },
  { href: '/admin/blog',         icon: Newspaper,       label: 'Blog Posts',         permission: 'blog'          },
  { href: '/admin/users',        icon: Shield,          label: 'Admin Users',        permission: 'users'         },
  { href: '/admin/settings',     icon: Settings,        label: 'Content & CMS',      permission: 'settings'      },
  { href: '/admin/appearance',   icon: Palette,         label: 'Appearance',         permission: 'settings'      },
  { href: '/admin/fonts',        icon: Type,            label: 'Typography',         permission: 'settings'      },
  { href: '/admin/plugins',      icon: Puzzle,          label: 'Plugins',            permission: 'plugins'       },
]

interface Me {
  id: string
  username: string
  email: string
  role: string
  permissions: Permission[]
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [me, setMe] = useState<Me | null>(null)
  const [loadTimeout, setLoadTimeout] = useState(false)

  useEffect(() => {
    // Fallback: show full nav after 4s even if /api/admin/me is slow
    const timer = setTimeout(() => setLoadTimeout(true), 4000)
    fetch('/api/admin/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { clearTimeout(timer); setMe(data) })
      .catch(() => { clearTimeout(timer); setLoadTimeout(true) })
    return () => clearTimeout(timer)
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/')
  }

  // Filter nav by permissions; super_admin sees everything
  const visibleNav = ALL_NAV.filter((item, idx, arr) => {
    if (!me) return loadTimeout // show all if timed-out waiting for me
    if (me.role === 'super_admin') return true
    // Deduplicate builder (Page Builder + Section Library both need 'builder')
    const alreadyShown = arr.slice(0, idx).some(i => i.href === item.href)
    if (alreadyShown) return false
    return me.permissions.includes(item.permission)
  })

  // Deduplicate hrefs (builder shows twice)
  const seen = new Set<string>()
  const navItems = visibleNav.filter(item => {
    if (seen.has(item.href)) return false
    seen.add(item.href)
    return true
  })

  const initials = me?.username?.slice(0, 2).toUpperCase() ?? 'A'
  const isSuperAdmin = me?.role === 'super_admin'

  return (
    <aside className="w-60 bg-[#0b0d13] flex flex-col shrink-0 min-h-screen border-r border-white/5">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <span className="text-lg font-black tracking-tight">
          <span className="text-white">CELLA</span>
          <span className="text-[#4ade80]">VIVA</span>
        </span>
        <p className="text-[10px] text-white/25 mt-0.5 font-semibold uppercase tracking-[0.2em]">
          Admin Panel
        </p>
      </div>

      {/* Role badge */}
      {me && (
        <div className="px-5 py-2.5 border-b border-white/5">
          <span className={cn(
            'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full',
            isSuperAdmin
              ? 'bg-[#4ade80]/10 text-[#4ade80]'
              : 'bg-white/8 text-white/40'
          )}>
            <Shield className="w-3 h-3" />
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {!me && !loadTimeout ? (
          // Skeleton while loading
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 mx-1 rounded-xl bg-white/4 animate-pulse" />
          ))
        ) : navItems.length === 0 ? (
          <p className="px-3 py-4 text-xs text-white/25 text-center">No permissions assigned.</p>
        ) : (
          navItems.map((item) => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  active
                    ? 'bg-white/8 text-white'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/80'
                )}
              >
                <item.icon className={cn(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  active ? 'text-[#4ade80]' : 'text-white/30 group-hover:text-white/60'
                )} />
                <span>{item.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4ade80]" />}
              </Link>
            )
          })
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
        <Link href="/admin/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4 flex-shrink-0" /> Notifications
        </Link>
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
          <ExternalLink className="w-4 h-4 flex-shrink-0" /> View Storefront
        </Link>
      </div>

      {/* User strip */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4ade80] to-[#16a34a] flex items-center justify-center text-[#0b0d13] font-black text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{me?.username ?? '…'}</p>
            <p className="text-[10px] text-white/30 truncate">{me?.email ?? '…'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-white/25 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
