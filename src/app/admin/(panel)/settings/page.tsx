'use client'
import { useState, useEffect, useCallback } from 'react'
import { Save, Plus, Trash2, GripVertical, RefreshCw, Upload, Loader2 } from 'lucide-react'
import { DEFAULT_SETTINGS } from '@/lib/defaults'
import type { StoreSettings, FAQItem, Testimonial, MetricItem, TimelineStep, IngredientItem, NavLink, PressItem, BeforeAfterCase, ComparisonRow, GuaranteeCard } from '@/types'

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl p-6'
const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'
const LABEL = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5'
const BTN_SM = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors'

type Tab = 'branding' | 'hero' | 'marquee' | 'navigation' | 'press' | 'testimonials' | 'metrics' | 'timeline' | 'ingredients' | 'subscription' | 'faq' | 'beforeafter' | 'comparison' | 'guarantee' | 'storeinfo'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'branding',     label: 'Branding',        emoji: '🎨' },
  { id: 'hero',         label: 'Hero Section',     emoji: '🏠' },
  { id: 'marquee',      label: 'Marquee Strip',    emoji: '📢' },
  { id: 'navigation',   label: 'Navigation',       emoji: '🧭' },
  { id: 'press',        label: 'Press',            emoji: '📰' },
  { id: 'testimonials', label: 'Testimonials',     emoji: '💬' },
  { id: 'beforeafter',  label: 'Before & After',   emoji: '🔄' },
  { id: 'metrics',      label: 'Stats & Metrics',  emoji: '📊' },
  { id: 'timeline',     label: 'Timeline',         emoji: '⏱' },
  { id: 'ingredients',  label: 'Ingredients',      emoji: '🌿' },
  { id: 'subscription', label: 'Subscription',     emoji: '✅' },
  { id: 'guarantee',    label: 'Guarantee Cards',  emoji: '🛡' },
  { id: 'comparison',   label: 'Comparison Table', emoji: '⚖️' },
  { id: 'faq',          label: 'FAQ',              emoji: '❓' },
  { id: 'storeinfo',    label: 'Store Info',       emoji: '🏪' },
]

function id() { return Date.now().toString() }

export default function AdminCMSPage() {
  const [settings, setSettings] = useState<StoreSettings>({ ...DEFAULT_SETTINGS })
  const [activeTab, setActiveTab] = useState<Tab>('branding')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load from API/DB on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        const merged: StoreSettings = { ...DEFAULT_SETTINGS }
        const parse = <T,>(key: string, fb: T): T => {
          const v = data[key]
          if (!v) return fb
          try { return JSON.parse(v) as T } catch { return fb }
        }
        if (data.primaryColor) merged.primaryColor = data.primaryColor
        if (data.accentColor) merged.accentColor = data.accentColor
        if (data.backgroundColor) merged.backgroundColor = data.backgroundColor
        if (data.textColor) merged.textColor = data.textColor
        if (data.announcementText) merged.announcementText = data.announcementText
        if (data.heroImage) merged.heroImage = data.heroImage
        if (data.heroHeading) merged.heroHeading = data.heroHeading
        if (data.heroSubtext) merged.heroSubtext = data.heroSubtext
        if (data.heroBadgeText) merged.heroBadgeText = data.heroBadgeText
        if (data.heroPrimaryBtnText) merged.heroPrimaryBtnText = data.heroPrimaryBtnText
        if (data.heroPrimaryBtnHref) merged.heroPrimaryBtnHref = data.heroPrimaryBtnHref
        if (data.heroSecondaryBtnText) merged.heroSecondaryBtnText = data.heroSecondaryBtnText
        if (data.heroSecondaryBtnHref) merged.heroSecondaryBtnHref = data.heroSecondaryBtnHref
        merged.marqueeItems   = parse('marqueeItems',   DEFAULT_SETTINGS.marqueeItems)
        merged.navLinks       = parse('navLinks',       DEFAULT_SETTINGS.navLinks)
        merged.pressItems     = parse('pressItems',     DEFAULT_SETTINGS.pressItems)
        merged.testimonials   = parse('testimonials',   DEFAULT_SETTINGS.testimonials)
        merged.metrics        = parse('metrics',        DEFAULT_SETTINGS.metrics)
        merged.timeline       = parse('timeline',       DEFAULT_SETTINGS.timeline)
        merged.ingredients    = parse('ingredients',    DEFAULT_SETTINGS.ingredients)
        merged.subscriptionPerks  = parse('subscriptionPerks',  DEFAULT_SETTINGS.subscriptionPerks)
        merged.faqItems           = parse('faqItems',           DEFAULT_SETTINGS.faqItems)
        merged.beforeAfterCases   = parse('beforeAfterCases',   DEFAULT_SETTINGS.beforeAfterCases)
        merged.comparisonRows     = parse('comparisonRows',     DEFAULT_SETTINGS.comparisonRows)
        merged.guaranteeCards     = parse('guaranteeCards',     DEFAULT_SETTINGS.guaranteeCards)
        if (data.storeName    !== undefined) merged.storeName    = data.storeName
        if (data.storeTagline !== undefined) merged.storeTagline = data.storeTagline
        if (data.storeEmail   !== undefined) merged.storeEmail   = data.storeEmail
        if (data.storeVat     !== undefined) merged.storeVat     = data.storeVat
        if (data.storeAddress !== undefined) merged.storeAddress = data.storeAddress
        if ((data as any).storePhone     !== undefined) (merged as any).storePhone     = (data as any).storePhone
        if ((data as any).storeWhatsapp  !== undefined) (merged as any).storeWhatsapp  = (data as any).storeWhatsapp
        if (data.socialInstagram !== undefined) merged.socialInstagram = data.socialInstagram
        if (data.socialFacebook  !== undefined) merged.socialFacebook  = data.socialFacebook
        if (data.socialTikTok    !== undefined) merged.socialTikTok    = data.socialTikTok
        if (data.socialTwitter   !== undefined) merged.socialTwitter   = data.socialTwitter
        if (data.footerTagline)   merged.footerTagline   = data.footerTagline
        if (data.copyrightText)   merged.copyrightText   = data.copyrightText
        setSettings(merged)
      })
      .catch(() => setSettings({ ...DEFAULT_SETTINGS }))
      .finally(() => setLoading(false))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }, [settings])

  const upd = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) =>
    setSettings(s => ({ ...s, [key]: value }))

  async function uploadImage(file: File, onUrl: (url: string) => void) {
    setUploadingImage(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (res.ok) { const { url } = await res.json(); onUrl(url) }
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-white/40">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading content...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* ── Sidebar tabs ──────────────────────────────────────────────── */}
      <aside className="w-52 bg-[#0c0e15] border-r border-white/5 flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-white/5">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Content Editor</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                activeTab === tab.id ? 'bg-white/8 text-white' : 'text-white/35 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="font-medium">{tab.label}</span>
              {activeTab === tab.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4ade80]" />}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <a href="/" target="_blank" className="block text-center text-xs text-white/25 hover:text-white/50 py-2">
            View Storefront ↗
          </a>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f1117] border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{TABS.find(t => t.id === activeTab)?.emoji} {TABS.find(t => t.id === activeTab)?.label}</h1>
            <p className="text-xs text-white/30 mt-0.5">Changes are saved to the database and reflected on the storefront immediately</p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-[#4ade80] text-[#0b0d13] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#22c55e] transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">

          {/* ── BRANDING ──────────────────────────────────────────────── */}
          {activeTab === 'branding' && (
            <>
              <div className={CARD}>
                <h2 className="text-white font-bold mb-5">Color Palette</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {([
                    ['primaryColor', 'Primary Color', 'Main buttons & links'],
                    ['accentColor', 'Accent Color', 'Highlights & badges'],
                    ['backgroundColor', 'Background Color', 'Page background'],
                    ['textColor', 'Text Color', 'Body text'],
                  ] as const).map(([key, label, hint]) => (
                    <div key={key}>
                      <label className={LABEL}>{label}</label>
                      <p className="text-[11px] text-white/30 mb-2">{hint}</p>
                      <div className="flex gap-2.5 items-center">
                        <input type="color" value={settings[key]} onChange={e => upd(key, e.target.value)} className="w-11 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5 flex-shrink-0" />
                        <input type="text" value={settings[key]} onChange={e => upd(key, e.target.value)} className={INPUT} placeholder="#000000" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={CARD}>
                <h2 className="text-white font-bold mb-5">Announcement Bar</h2>
                <label className={LABEL}>Message Text</label>
                <p className="text-[11px] text-white/30 mb-2">Separate multiple rotating messages with <code className="bg-white/10 px-1 rounded">•</code></p>
                <input type="text" value={settings.announcementText} onChange={e => upd('announcementText', e.target.value)} className={INPUT} />
              </div>
            </>
          )}

          {/* ── HERO ──────────────────────────────────────────────────── */}
          {activeTab === 'hero' && (
            <>
              <div className={CARD}>
                <h2 className="text-white font-bold mb-5">Hero Text Content</h2>
                <div className="space-y-4">
                  <div>
                    <label className={LABEL}>Badge Text</label>
                    <input type="text" value={settings.heroBadgeText} onChange={e => upd('heroBadgeText', e.target.value)} className={INPUT} />
                  </div>
                  <div>
                    <label className={LABEL}>Main Heading</label>
                    <input type="text" value={settings.heroHeading} onChange={e => upd('heroHeading', e.target.value)} className={INPUT} />
                  </div>
                  <div>
                    <label className={LABEL}>Sub-text</label>
                    <textarea rows={3} value={settings.heroSubtext} onChange={e => upd('heroSubtext', e.target.value)} className={INPUT + ' resize-none'} />
                  </div>
                  <div>
                    <label className={LABEL}>Background Image</label>
                    {settings.heroImage && (
                      <img src={settings.heroImage} alt="" className="w-full h-28 object-cover rounded-xl border border-white/10 mb-2" />
                    )}
                    <div className="flex gap-2">
                      <input type="text" value={settings.heroImage} onChange={e => upd('heroImage', e.target.value)} className={`${INPUT} flex-1`} placeholder="/images/hero-bg.jpg" />
                      <label className={`flex items-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white/80 cursor-pointer transition-colors flex-shrink-0 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        {uploadingImage ? 'Uploading…' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, url => upd('heroImage', url)); e.target.value = '' }} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={CARD}>
                <h2 className="text-white font-bold mb-5">CTA Buttons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <p className="text-sm text-white/60 font-medium">Primary Button</p>
                    <div>
                      <label className={LABEL}>Label</label>
                      <input type="text" value={settings.heroPrimaryBtnText} onChange={e => upd('heroPrimaryBtnText', e.target.value)} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Link (href)</label>
                      <input type="text" value={settings.heroPrimaryBtnHref} onChange={e => upd('heroPrimaryBtnHref', e.target.value)} className={INPUT} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-white/60 font-medium">Secondary Button</p>
                    <div>
                      <label className={LABEL}>Label</label>
                      <input type="text" value={settings.heroSecondaryBtnText} onChange={e => upd('heroSecondaryBtnText', e.target.value)} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Link (href)</label>
                      <input type="text" value={settings.heroSecondaryBtnHref} onChange={e => upd('heroSecondaryBtnHref', e.target.value)} className={INPUT} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live preview */}
              <div className={CARD}>
                <h2 className="text-white font-bold mb-4">Preview</h2>
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#edf3f7] to-[#d1dee6] p-8">
                  <span className="inline-block border border-white/50 rounded-full px-3 py-1 text-[11px] text-white/80 mb-4">{settings.heroBadgeText}</span>
                  <h2 className="text-2xl font-light text-[#222222] mb-3" style={{ fontFamily: 'var(--sf-font-display)' }}>{settings.heroHeading}</h2>
                  <p className="text-sm text-[#544d43] mb-5 max-w-sm">{settings.heroSubtext}</p>
                  <div className="flex gap-3 flex-wrap">
                    <span className="bg-[#3a79a9] text-white text-xs font-semibold px-5 py-2 rounded-full">{settings.heroPrimaryBtnText}</span>
                    <span className="border border-[#dad7d4] text-[#222222] text-xs font-semibold px-5 py-2 rounded-full bg-white">{settings.heroSecondaryBtnText} →</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── MARQUEE ───────────────────────────────────────────────── */}
          {activeTab === 'marquee' && (
            <div className={CARD}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold">Marquee Strip Items</h2>
                <button onClick={() => upd('marqueeItems', [...settings.marqueeItems, 'New Item'])} className={`${BTN_SM} bg-white/8 text-white/70 hover:bg-white/12`}>
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>
              <p className="text-xs text-white/30 mb-5">These items scroll continuously across the dark strip below the hero. They repeat automatically.</p>
              <div className="space-y-2.5">
                {settings.marqueeItems.map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-center">
                    <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={e => { const n = [...settings.marqueeItems]; n[i] = e.target.value; upd('marqueeItems', n) }}
                      className={INPUT}
                    />
                    <button onClick={() => upd('marqueeItems', settings.marqueeItems.filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NAVIGATION ────────────────────────────────────────────── */}
          {activeTab === 'navigation' && (
            <div className={CARD}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold">Header Navigation Links</h2>
                <button onClick={() => upd('navLinks', [...settings.navLinks, { href: '/', label: 'New Link' }])} className={`${BTN_SM} bg-white/8 text-white/70 hover:bg-white/12`}>
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>
              <div className="space-y-3">
                {settings.navLinks.map((link: NavLink, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
                    <input type="text" value={link.label} onChange={e => { const n = [...settings.navLinks]; n[i] = { ...n[i], label: e.target.value }; upd('navLinks', n) }} className={INPUT} placeholder="Label" />
                    <input type="text" value={link.href} onChange={e => { const n = [...settings.navLinks]; n[i] = { ...n[i], href: e.target.value }; upd('navLinks', n) }} className={INPUT} placeholder="/page" />
                    <button onClick={() => upd('navLinks', settings.navLinks.filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRESS ─────────────────────────────────────────────────── */}
          {activeTab === 'press' && (
            <div className={CARD}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold">Press & Media Logos</h2>
                <button onClick={() => upd('pressItems', [...settings.pressItems, { name: 'Publication', style: 'font-bold text-2xl' }])} className={`${BTN_SM} bg-white/8 text-white/70 hover:bg-white/12`}>
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <p className="text-xs text-white/30 mb-5">Publication names rendered as styled text in the "As Seen In" strip.</p>
              <div className="space-y-3">
                {settings.pressItems.map((item: PressItem, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <input type="text" value={item.name} onChange={e => { const n = [...settings.pressItems]; n[i] = { ...n[i], name: e.target.value }; upd('pressItems', n) }} className={INPUT} placeholder="Publication Name" />
                    <input type="text" value={item.style} onChange={e => { const n = [...settings.pressItems]; n[i] = { ...n[i], style: e.target.value }; upd('pressItems', n) }} className={INPUT} placeholder="Tailwind classes" />
                    <button onClick={() => upd('pressItems', settings.pressItems.filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => upd('testimonials', [...settings.testimonials, { id: id(), name: 'Customer Name', rating: 5, text: 'Review text here...', verified: true, date: 'Recently' }])}
                  className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Testimonial
                </button>
              </div>
              {settings.testimonials.map((t: Testimonial, i) => (
                <div key={t.id} className={CARD}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Review #{i + 1}</p>
                    <button onClick={() => upd('testimonials', settings.testimonials.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className={LABEL}>Customer Name</label>
                      <input type="text" value={t.name} onChange={e => { const n = [...settings.testimonials]; n[i] = { ...n[i], name: e.target.value }; upd('testimonials', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Rating (1–5)</label>
                      <input type="number" min={1} max={5} value={t.rating} onChange={e => { const n = [...settings.testimonials]; n[i] = { ...n[i], rating: Number(e.target.value) }; upd('testimonials', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Date Label</label>
                      <input type="text" value={t.date} onChange={e => { const n = [...settings.testimonials]; n[i] = { ...n[i], date: e.target.value }; upd('testimonials', n) }} className={INPUT} placeholder="2 weeks ago" />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Review Text</label>
                    <textarea rows={3} value={t.text} onChange={e => { const n = [...settings.testimonials]; n[i] = { ...n[i], text: e.target.value }; upd('testimonials', n) }} className={INPUT + ' resize-none'} />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                      <input type="checkbox" checked={t.verified} onChange={e => { const n = [...settings.testimonials]; n[i] = { ...n[i], verified: e.target.checked }; upd('testimonials', n) }} className="rounded" />
                      Verified Purchase
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── METRICS ───────────────────────────────────────────────── */}
          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => upd('metrics', [...settings.metrics, { value: 90, label: 'description of result' }])} className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}>
                  <Plus className="w-3.5 h-3.5" /> Add Metric
                </button>
              </div>
              {settings.metrics.map((m: MetricItem, i) => (
                <div key={i} className={CARD}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Stat #{i + 1}</p>
                    <button onClick={() => upd('metrics', settings.metrics.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>Percentage Value (%)</label>
                      <input type="number" min={0} max={100} value={m.value} onChange={e => { const n = [...settings.metrics]; n[i] = { ...n[i], value: Number(e.target.value) }; upd('metrics', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Description</label>
                      <input type="text" value={m.label} onChange={e => { const n = [...settings.metrics]; n[i] = { ...n[i], label: e.target.value }; upd('metrics', n) }} className={INPUT} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TIMELINE ──────────────────────────────────────────────── */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => upd('timeline', [...settings.timeline, { id: id(), week: 'Week X–Y', icon: '🌿', title: 'Step Title', body: 'Description of this phase.' }])} className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}>
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>
              {settings.timeline.map((t: TimelineStep, i) => (
                <div key={t.id} className={CARD}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Step #{i + 1}</p>
                    <button onClick={() => upd('timeline', settings.timeline.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className={LABEL}>Week Label</label>
                      <input type="text" value={t.week} onChange={e => { const n = [...settings.timeline]; n[i] = { ...n[i], week: e.target.value }; upd('timeline', n) }} className={INPUT} placeholder="Week 1–2" />
                    </div>
                    <div>
                      <label className={LABEL}>Icon (emoji)</label>
                      <input type="text" value={t.icon} onChange={e => { const n = [...settings.timeline]; n[i] = { ...n[i], icon: e.target.value }; upd('timeline', n) }} className={INPUT} placeholder="🌱" />
                    </div>
                    <div>
                      <label className={LABEL}>Step Title</label>
                      <input type="text" value={t.title} onChange={e => { const n = [...settings.timeline]; n[i] = { ...n[i], title: e.target.value }; upd('timeline', n) }} className={INPUT} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Description</label>
                    <textarea rows={3} value={t.body} onChange={e => { const n = [...settings.timeline]; n[i] = { ...n[i], body: e.target.value }; upd('timeline', n) }} className={INPUT + ' resize-none'} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── INGREDIENTS ───────────────────────────────────────────── */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => upd('ingredients', [...settings.ingredients, { id: id(), name: 'Ingredient Name', source: 'Source', role: 'Role', icon: '🌿', description: 'Description of what this does.', highlight: false }])} className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}>
                  <Plus className="w-3.5 h-3.5" /> Add Ingredient
                </button>
              </div>
              {settings.ingredients.map((ing: IngredientItem, i) => (
                <div key={ing.id} className={CARD}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Ingredient #{i + 1}</p>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer">
                        <input type="checkbox" checked={ing.highlight} onChange={e => { const n = [...settings.ingredients]; n[i] = { ...n[i], highlight: e.target.checked }; upd('ingredients', n) }} />
                        Featured Card
                      </label>
                      <button onClick={() => upd('ingredients', settings.ingredients.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className={LABEL}>Name</label>
                      <input type="text" value={ing.name} onChange={e => { const n = [...settings.ingredients]; n[i] = { ...n[i], name: e.target.value }; upd('ingredients', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Source</label>
                      <input type="text" value={ing.source} onChange={e => { const n = [...settings.ingredients]; n[i] = { ...n[i], source: e.target.value }; upd('ingredients', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Role / Tag</label>
                      <input type="text" value={ing.role} onChange={e => { const n = [...settings.ingredients]; n[i] = { ...n[i], role: e.target.value }; upd('ingredients', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Icon (emoji)</label>
                      <input type="text" value={ing.icon} onChange={e => { const n = [...settings.ingredients]; n[i] = { ...n[i], icon: e.target.value }; upd('ingredients', n) }} className={INPUT} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Description</label>
                    <textarea rows={3} value={ing.description} onChange={e => { const n = [...settings.ingredients]; n[i] = { ...n[i], description: e.target.value }; upd('ingredients', n) }} className={INPUT + ' resize-none'} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SUBSCRIPTION ──────────────────────────────────────────── */}
          {activeTab === 'subscription' && (
            <div className={CARD}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold">Subscription Perks</h2>
                <button onClick={() => upd('subscriptionPerks', [...settings.subscriptionPerks, 'New perk description'])} className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}>
                  <Plus className="w-3.5 h-3.5" /> Add Perk
                </button>
              </div>
              <p className="text-xs text-white/30 mb-5">These bullet points appear in the Subscribe & Save section with a checkmark icon.</p>
              <div className="space-y-2.5">
                {settings.subscriptionPerks.map((perk, i) => (
                  <div key={i} className="flex gap-2.5 items-center">
                    <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
                    <input
                      type="text"
                      value={perk}
                      onChange={e => { const n = [...settings.subscriptionPerks]; n[i] = e.target.value; upd('subscriptionPerks', n) }}
                      className={INPUT}
                    />
                    <button onClick={() => upd('subscriptionPerks', settings.subscriptionPerks.filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAQ ───────────────────────────────────────────────────── */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => upd('faqItems', [...settings.faqItems, { id: id(), question: 'New Question?', answer: 'Answer here...' }])} className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}>
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>
              {settings.faqItems.map((item: FAQItem, i) => (
                <div key={item.id} className={CARD}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">FAQ #{i + 1}</p>
                    <button onClick={() => upd('faqItems', settings.faqItems.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className={LABEL}>Question</label>
                      <input type="text" value={item.question} onChange={e => { const n = [...settings.faqItems]; n[i] = { ...n[i], question: e.target.value }; upd('faqItems', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Answer</label>
                      <textarea rows={3} value={item.answer} onChange={e => { const n = [...settings.faqItems]; n[i] = { ...n[i], answer: e.target.value }; upd('faqItems', n) }} className={INPUT + ' resize-none'} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── BEFORE/AFTER ──────────────────────────────────────────── */}
          {activeTab === 'beforeafter' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => upd('beforeAfterCases', [...settings.beforeAfterCases, { id: id(), name: 'Customer Name', age: 30, duration: '8 Weeks', concern: 'Hair concern', result: 'Visible result', stars: 5, quote: 'Customer quote here...', beforeLabel: 'Before', afterLabel: 'After', beforeImage: '', afterImage: '' }])} className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}>
                  <Plus className="w-3.5 h-3.5" /> Add Case
                </button>
              </div>
              {settings.beforeAfterCases.map((c: BeforeAfterCase, i) => (
                <div key={c.id} className={CARD}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Case Study #{i + 1}</p>
                    <button onClick={() => upd('beforeAfterCases', settings.beforeAfterCases.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className={LABEL}>Name</label>
                      <input type="text" value={c.name} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], name: e.target.value }; upd('beforeAfterCases', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Age</label>
                      <input type="number" value={c.age} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], age: Number(e.target.value) }; upd('beforeAfterCases', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Duration</label>
                      <input type="text" value={c.duration} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], duration: e.target.value }; upd('beforeAfterCases', n) }} className={INPUT} placeholder="8 Weeks" />
                    </div>
                    <div>
                      <label className={LABEL}>Stars (1-5)</label>
                      <input type="number" min={1} max={5} value={c.stars} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], stars: Number(e.target.value) }; upd('beforeAfterCases', n) }} className={INPUT} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className={LABEL}>Hair Concern</label>
                      <input type="text" value={c.concern} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], concern: e.target.value }; upd('beforeAfterCases', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Result Headline</label>
                      <input type="text" value={c.result} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], result: e.target.value }; upd('beforeAfterCases', n) }} className={INPUT} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Customer Quote</label>
                    <textarea rows={3} value={c.quote} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], quote: e.target.value }; upd('beforeAfterCases', n) }} className={INPUT + ' resize-none'} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className={LABEL}>Before Photo</label>
                      {c.beforeImage && (
                        <img src={c.beforeImage} alt="" className="w-full h-28 object-cover rounded-xl border border-white/10 mb-2" />
                      )}
                      <div className="flex gap-2">
                        <input type="text" value={c.beforeImage ?? ''} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], beforeImage: e.target.value }; upd('beforeAfterCases', n) }} className={`${INPUT} flex-1`} placeholder="/uploads/before.jpg" />
                        <label className={`flex items-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white/80 cursor-pointer transition-colors flex-shrink-0 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, url => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], beforeImage: url }; upd('beforeAfterCases', n) }); e.target.value = '' }} />
                        </label>
                      </div>
                      <label className={`${LABEL} mt-2`}>Before Badge Text</label>
                      <input type="text" value={c.beforeLabel} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], beforeLabel: e.target.value }; upd('beforeAfterCases', n) }} className={INPUT} placeholder="Before" />
                    </div>
                    <div>
                      <label className={LABEL}>After Photo</label>
                      {c.afterImage && (
                        <img src={c.afterImage} alt="" className="w-full h-28 object-cover rounded-xl border border-white/10 mb-2" />
                      )}
                      <div className="flex gap-2">
                        <input type="text" value={c.afterImage ?? ''} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], afterImage: e.target.value }; upd('beforeAfterCases', n) }} className={`${INPUT} flex-1`} placeholder="/uploads/after.jpg" />
                        <label className={`flex items-center gap-1.5 px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white/80 cursor-pointer transition-colors flex-shrink-0 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, url => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], afterImage: url }; upd('beforeAfterCases', n) }); e.target.value = '' }} />
                        </label>
                      </div>
                      <label className={`${LABEL} mt-2`}>After Badge Text</label>
                      <input type="text" value={c.afterLabel} onChange={e => { const n = [...settings.beforeAfterCases]; n[i] = { ...n[i], afterLabel: e.target.value }; upd('beforeAfterCases', n) }} className={INPUT} placeholder="8 Weeks" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── COMPARISON TABLE ──────────────────────────────────────── */}
          {activeTab === 'comparison' && (
            <div className={CARD}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-white font-bold">Comparison Table Rows</h2>
                  <p className="text-xs text-white/30 mt-1">These features appear in the "Plant-Based vs. Harsh Chemicals" section</p>
                </div>
                <button onClick={() => upd('comparisonRows', [...settings.comparisonRows, { id: id(), feature: 'New Feature', us: true, them: false }])} className={`${BTN_SM} bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20`}>
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>
              <div className="space-y-2.5">
                {settings.comparisonRows.map((row: ComparisonRow, i) => (
                  <div key={row.id} className="flex gap-3 items-center bg-white/3 rounded-xl px-4 py-3">
                    <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
                    <input type="text" value={row.feature} onChange={e => { const n = [...settings.comparisonRows]; n[i] = { ...n[i], feature: e.target.value }; upd('comparisonRows', n) }} className={INPUT} placeholder="Feature name" />
                    <label className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold whitespace-nowrap cursor-pointer">
                      <input type="checkbox" checked={row.us} onChange={e => { const n = [...settings.comparisonRows]; n[i] = { ...n[i], us: e.target.checked }; upd('comparisonRows', n) }} className="accent-emerald-400" />
                      Us ✓
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-red-400 font-semibold whitespace-nowrap cursor-pointer">
                      <input type="checkbox" checked={row.them} onChange={e => { const n = [...settings.comparisonRows]; n[i] = { ...n[i], them: e.target.checked }; upd('comparisonRows', n) }} className="accent-red-400" />
                      Them ✓
                    </label>
                    <button onClick={() => upd('comparisonRows', settings.comparisonRows.filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GUARANTEE CARDS ───────────────────────────────────────── */}
          {activeTab === 'guarantee' && (
            <div className="space-y-4">
              <p className="text-xs text-white/30">Edit the 3 trust pillar cards. To change icons go to <strong className="text-white/50">Appearance → Icons & Size</strong>.</p>
              {settings.guaranteeCards.map((card: GuaranteeCard, i) => (
                <div key={card.id} className={CARD}>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Card #{i + 1}</p>
                  <div className="space-y-3">
                    <div>
                      <label className={LABEL}>Title</label>
                      <input type="text" value={card.title} onChange={e => { const n = [...settings.guaranteeCards]; n[i] = { ...n[i], title: e.target.value }; upd('guaranteeCards', n) }} className={INPUT} />
                    </div>
                    <div>
                      <label className={LABEL}>Body Text</label>
                      <textarea rows={4} value={card.body} onChange={e => { const n = [...settings.guaranteeCards]; n[i] = { ...n[i], body: e.target.value }; upd('guaranteeCards', n) }} className={INPUT + ' resize-none'} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── STORE INFO ────────────────────────────────────────────── */}
          {activeTab === 'storeinfo' && (
            <>
              <div className={CARD}>
                <h2 className="text-white font-bold mb-5">Store Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {([
                    ['storeName',    'Store Name',            'CELLAVIVA'],
                    ['storeEmail',   'Contact Email',          'hello@cellaviva.com'],
                    ['storePhone',   '📞 Phone Number',        '+353 1 234 5678'],
                    ['storeWhatsapp','💬 WhatsApp Number',     '96170000000'],
                    ['storeVat',     'VAT / Company Number',   'IE3456789A'],
                    ['storeAddress', 'Business Address',       'Dublin, Ireland'],
                  ] as const).map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label className={LABEL}>{label}</label>
                      <input type="text" value={(settings as any)[key] ?? ''} onChange={e => upd(key as any, e.target.value)} className={INPUT} placeholder={placeholder} />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className={LABEL}>Store Tagline (used in footer)</label>
                    <textarea rows={2} value={settings.storeTagline} onChange={e => upd('storeTagline', e.target.value)} className={INPUT + ' resize-none'} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}>Copyright Text</label>
                    <input type="text" value={settings.copyrightText} onChange={e => upd('copyrightText', e.target.value)} className={INPUT} />
                  </div>
                </div>
              </div>

              <div className={CARD}>
                <h2 className="text-white font-bold mb-4">Checkout Options</h2>
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/3">
                  <div>
                    <p className="text-sm font-semibold text-white">Show Country Field</p>
                    <p className="text-xs text-white/40 mt-0.5">Display the country dropdown in the checkout address form</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => upd('checkoutShowCountry' as any, (settings as any).checkoutShowCountry === 'false' ? 'true' : 'false')}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${(settings as any).checkoutShowCountry !== 'false' ? 'bg-[#4ade80]' : 'bg-white/15'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(settings as any).checkoutShowCountry !== 'false' ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className={CARD}>
                <h2 className="text-white font-bold mb-5">Social Media Links</h2>
                <div className="space-y-4">
                  {([
                    ['socialInstagram', '📸 Instagram URL'],
                    ['socialFacebook',  '👍 Facebook URL'],
                    ['socialTikTok',    '🎵 TikTok URL'],
                    ['socialTwitter',   '🐦 Twitter / X URL'],
                  ] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className={LABEL}>{label}</label>
                      <input type="url" value={settings[key]} onChange={e => upd(key, e.target.value)} className={INPUT} placeholder="https://" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
