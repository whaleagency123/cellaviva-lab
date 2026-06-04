// Shared permission constants — safe to import in both client and server components

export const PERMISSION_KEYS = [
  'dashboard',
  'builder',
  'orders',
  'payments',
  'products',
  'customers',
  'subscriptions',
  'reviews',
  'returns',
  'discounts',
  'channels',
  'analytics',
  'blog',
  'settings',
  'plugins',
  'users',
] as const

export type Permission = typeof PERMISSION_KEYS[number]

export const PERMISSION_LABELS: Record<Permission, string> = {
  dashboard:     'Dashboard & Overview',
  builder:       'Page Builder & Section Library',
  orders:        'Orders',
  payments:      'Payments & Bank Account',
  products:      'Products',
  customers:     'Customers',
  subscriptions: 'Subscriptions',
  reviews:       'Reviews',
  returns:       'Returns',
  discounts:     'Discount Codes',
  channels:      'Channels & Ads',
  analytics:     'Analytics',
  blog:          'Blog Posts',
  settings:      'Content & CMS / Appearance',
  plugins:       'Plugins',
  users:         'Admin User Management',
}
