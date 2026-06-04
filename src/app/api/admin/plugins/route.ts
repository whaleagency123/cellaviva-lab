import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import type { Plugin } from '@/types'

async function isAdmin() {
  const jar = await cookies()
  return !!(jar.get('admin_session')?.value)
}

const BUILTIN_PLUGINS: Plugin[] = [
  // ── Analytics ────────────────────────────────────────────────────────────
  {
    id: 'google_analytics',
    name: 'Google Analytics 4',
    description: 'Track visitors, sessions, conversions and revenue with Google Analytics.',
    icon: '📊',
    enabled: false,
    settings: { measurementId: '' },
  },
  {
    id: 'facebook_pixel',
    name: 'Facebook / Meta Pixel',
    description: 'Track conversions from Facebook ads and build custom audiences.',
    icon: '👍',
    enabled: false,
    settings: { pixelId: '' },
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    description: 'Heatmaps, session recordings, and user feedback surveys.',
    icon: '🔥',
    enabled: false,
    settings: { siteId: '' },
  },
  {
    id: 'microsoft_clarity',
    name: 'Microsoft Clarity',
    description: 'Free heatmaps and session recordings from Microsoft.',
    icon: '🪟',
    enabled: false,
    settings: { projectId: '' },
  },
  // ── Live Chat ─────────────────────────────────────────────────────────────
  {
    id: 'whatsapp_chat',
    name: 'WhatsApp Chat Button',
    description: 'Floating WhatsApp button for instant customer support.',
    icon: '💬',
    enabled: false,
    settings: { phoneNumber: '', greeting: 'Hi! How can we help you today?', position: 'right' },
  },
  {
    id: 'tawkto',
    name: 'Tawk.to Live Chat',
    description: 'Free live chat widget. Requires a free Tawk.to account.',
    icon: '🧑‍💼',
    enabled: false,
    settings: { propertyId: '', widgetId: 'default' },
  },
  {
    id: 'crisp_chat',
    name: 'Crisp Chat',
    description: 'Modern live chat with a free plan. Great for small stores.',
    icon: '🟢',
    enabled: false,
    settings: { websiteId: '' },
  },
  {
    id: 'tidio',
    name: 'Tidio Chat',
    description: 'AI-powered chat and chatbots to boost sales and support.',
    icon: '🤖',
    enabled: false,
    settings: { publicKey: '' },
  },
  // ── Marketing ────────────────────────────────────────────────────────────
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    description: 'Email marketing and SMS automation built for e-commerce.',
    icon: '📧',
    enabled: false,
    settings: { companyId: '' },
  },
  // ── Conversion ────────────────────────────────────────────────────────────
  {
    id: 'cookie_banner',
    name: 'Cookie Consent Banner',
    description: 'GDPR-compliant cookie consent notice shown to first-time visitors.',
    icon: '🍪',
    enabled: false,
    settings: { message: 'We use cookies to improve your experience.', acceptText: 'Accept All', declineText: 'Decline' },
  },
  {
    id: 'exit_popup',
    name: 'Exit Intent Popup',
    description: 'Show a discount popup when visitors are about to leave.',
    icon: '🎯',
    enabled: false,
    settings: { headline: 'Wait! Get 10% Off', body: 'Sign up to get an exclusive discount on your first order.', buttonText: 'Claim Discount', discountCode: 'SAVE10', delaySeconds: '3' },
  },
  // ── Custom ────────────────────────────────────────────────────────────────
  {
    id: 'custom_code',
    name: 'Custom Code / Script',
    description: 'Inject custom HTML, CSS, or JavaScript into your storefront.',
    icon: '🛠',
    enabled: false,
    settings: { name: 'My Custom Script', code: '', position: 'body' },
  },
]

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const row = await prisma.storeSettings.findUnique({ where: { key: 'plugins' } })
  if (!row) return NextResponse.json(BUILTIN_PLUGINS)

  try {
    const saved: Plugin[] = JSON.parse(row.value)
    // Merge saved settings into builtin registry (add new builtins, keep saved state)
    const merged = BUILTIN_PLUGINS.map(bp => {
      const s = saved.find(p => p.id === bp.id)
      return s ? { ...bp, enabled: s.enabled, settings: { ...bp.settings, ...s.settings } } : bp
    })
    // Append any custom plugins not in the builtin list
    saved.filter(p => !BUILTIN_PLUGINS.find(b => b.id === p.id)).forEach(p => merged.push(p))
    return NextResponse.json(merged)
  } catch {
    return NextResponse.json(BUILTIN_PLUGINS)
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const plugins: Plugin[] = await req.json()
  await prisma.storeSettings.upsert({
    where: { key: 'plugins' },
    update: { value: JSON.stringify(plugins) },
    create: { key: 'plugins', value: JSON.stringify(plugins) },
  })
  return NextResponse.json({ ok: true })
}
