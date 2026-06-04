'use client'
import { useState, useEffect } from 'react'
import { Save, RotateCcw, Palette, Sliders, Shapes, MousePointerClick } from 'lucide-react'
import { THEME_DEFAULTS } from '@/lib/storefront-theme-shared'
import type { StorefrontTheme } from '@/lib/storefront-theme-shared'
import { ICON_OPTIONS, ICON_REGISTRY } from '@/components/storefront/StorefrontIcon'

type Tab = 'colors' | 'icons' | 'shapes'

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl p-6'
const LABEL = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5'

const COLOR_FIELDS: { key: keyof StorefrontTheme; label: string; hint: string }[] = [
  { key: 'sfPrimary',     label: 'Primary Color',       hint: 'Buttons, links, accents' },
  { key: 'sfPrimaryDark', label: 'Primary Dark',         hint: 'Hover state on primary' },
  { key: 'sfAccentLight', label: 'Accent Light',         hint: 'Tinted backgrounds, badges' },
  { key: 'sfText',        label: 'Text Color',           hint: 'Headings & body text' },
  { key: 'sfTextMuted',   label: 'Muted Text',           hint: 'Secondary / caption text' },
  { key: 'sfBg',          label: 'Page Background',      hint: 'Main page background' },
  { key: 'sfBorder',      label: 'Border Color',         hint: 'Card borders & dividers' },
  { key: 'sfDarkBg',      label: 'Dark Background',      hint: 'Footer background' },
  { key: 'sfDarkSection', label: 'Dark Section',         hint: 'Ingredients & subscription bg' },
]

const ICON_POSITIONS: { key: keyof StorefrontTheme; label: string; hint: string }[] = [
  { key: 'sfIconGuarantee1', label: 'Guarantee Icon 1', hint: 'Money-back guarantee pillar' },
  { key: 'sfIconGuarantee2', label: 'Guarantee Icon 2', hint: 'Easy returns pillar' },
  { key: 'sfIconGuarantee3', label: 'Guarantee Icon 3', hint: 'Customer support pillar' },
  { key: 'sfIconFaq',        label: 'FAQ Section Icon',  hint: 'Shown in FAQ heading' },
  { key: 'sfIconCart',       label: 'Cart Icon',         hint: 'Header cart button' },
]

function IconGrid({ value, onChange }: { value: string; onChange: (n: string) => void }) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mt-2">
      {ICON_OPTIONS.map((opt) => {
        const Icon = ICON_REGISTRY[opt.name]
        const active = value === opt.name
        return (
          <button
            key={opt.name}
            onClick={() => onChange(opt.name)}
            title={opt.label}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
              active
                ? 'bg-[#4ade80]/15 border-[#4ade80] text-[#4ade80]'
                : 'bg-white/3 border-white/8 text-white/40 hover:border-white/20 hover:text-white/70'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] leading-none text-center truncate w-full">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function AppearancePage() {
  const [theme, setTheme] = useState<StorefrontTheme>({ ...THEME_DEFAULTS })
  const [activeTab, setActiveTab] = useState<Tab>('colors')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/appearance')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setTheme({
          ...THEME_DEFAULTS,
          ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== '')) as Partial<StorefrontTheme>,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set<K extends keyof StorefrontTheme>(key: K, val: StorefrontTheme[K]) {
    setTheme((t) => ({ ...t, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/admin/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setTheme({ ...THEME_DEFAULTS })
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'colors', label: 'Colors',          icon: Palette },
    { id: 'icons',  label: 'Icons & Size',     icon: MousePointerClick },
    { id: 'shapes', label: 'Shapes & Spacing', icon: Shapes },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white/30 text-sm">
        Loading appearance settings…
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Visual Design Studio</h1>
          <p className="text-sm text-white/40 mt-1">Control every visual aspect of your storefront — no code required.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Live mini-preview */}
      <div className={CARD}>
        <p className={LABEL}>Live Preview</p>
        <div
          className="rounded-xl p-5 border"
          style={{
            background: theme.sfBg,
            borderColor: theme.sfBorder,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-lg" style={{ color: theme.sfText }}>
              CELLA<span style={{ color: theme.sfPrimary }}>VIVA</span>
            </span>
            <button
              className="px-4 py-1.5 text-sm font-semibold text-white transition-colors"
              style={{
                background: theme.sfPrimary,
                borderRadius: theme.sfRadiusBtn === 'pill' ? '9999px' : theme.sfRadiusBtn === 'lg' ? '16px' : theme.sfRadiusBtn === 'md' ? '12px' : theme.sfRadiusBtn === 'sm' ? '8px' : '0px',
              }}
            >
              Shop Now
            </button>
          </div>
          <div
            className="p-4 border"
            style={{
              background: 'white',
              borderColor: theme.sfBorder,
              borderRadius: theme.sfRadiusCard === 'xl' ? '24px' : theme.sfRadiusCard === 'lg' ? '16px' : theme.sfRadiusCard === 'md' ? '12px' : theme.sfRadiusCard === 'sm' ? '8px' : '0px',
            }}
          >
            <p className="font-semibold mb-1" style={{ color: theme.sfText }}>Stemuvita™ Hair Cleanse</p>
            <p className="text-sm mb-3" style={{ color: theme.sfTextMuted }}>Plant-based · Sulfate-Free · Clinically Proven</p>
            <p className="text-xl font-bold" style={{ color: theme.sfPrimary }}>$49</p>
          </div>
          <div className="mt-3 rounded-xl p-3" style={{ background: theme.sfDarkSection }}>
            <p className="text-xs text-white/70">Dark section · Footer · Ingredients background</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all -mb-px ${
              activeTab === t.id
                ? 'bg-[#13161f] text-white border border-b-[#13161f] border-white/5'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Colors Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'colors' && (
        <div className={CARD}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLOR_FIELDS.map(({ key, label, hint }) => (
              <div key={key}>
                <label className={LABEL}>{label}</label>
                <p className="text-[11px] text-white/30 mb-2">{hint}</p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme[key] as string}
                    onChange={(e) => set(key, e.target.value as StorefrontTheme[typeof key])}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={theme[key] as string}
                    onChange={(e) => set(key, e.target.value as StorefrontTheme[typeof key])}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#4ade80] transition-colors"
                    placeholder="#000000"
                    maxLength={7}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Icons & Size Tab ───────────────────────────────────────────── */}
      {activeTab === 'icons' && (
        <div className="space-y-5">
          {/* Icon Size */}
          <div className={CARD}>
            <p className={LABEL}>Icon Size</p>
            <p className="text-xs text-white/30 mb-4">Controls the size of all icons throughout the storefront.</p>
            <div className="flex gap-3">
              {([
                { value: 'sm', label: 'Small', px: '16px' },
                { value: 'md', label: 'Medium', px: '20px' },
                { value: 'lg', label: 'Large', px: '24px' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set('sfIconSize', opt.value)}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
                    theme.sfIconSize === opt.value
                      ? 'bg-[#4ade80]/10 border-[#4ade80] text-[#4ade80]'
                      : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <Sliders style={{ width: opt.px, height: opt.px }} />
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className="text-[10px] opacity-60">{opt.px}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Pickers */}
          {ICON_POSITIONS.map(({ key, label, hint }) => (
            <div key={key} className={CARD}>
              <div className="flex items-center gap-3 mb-1">
                <p className={LABEL + ' mb-0'}>{label}</p>
                <span className="text-[10px] text-white/30">Current: {theme[key] as string}</span>
              </div>
              <p className="text-xs text-white/30 mb-3">{hint}</p>
              <IconGrid
                value={theme[key] as string}
                onChange={(n) => set(key, n as StorefrontTheme[typeof key])}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Shapes & Spacing Tab ──────────────────────────────────────── */}
      {activeTab === 'shapes' && (
        <div className="space-y-5">
          {/* Button Radius */}
          <div className={CARD}>
            <p className={LABEL}>Button Border Radius</p>
            <p className="text-xs text-white/30 mb-4">Controls the corner roundness of all primary buttons.</p>
            <div className="flex gap-3 flex-wrap">
              {([
                { value: 'pill', label: 'Pill', radius: '9999px' },
                { value: 'lg',   label: 'Rounded', radius: '16px' },
                { value: 'md',   label: 'Medium', radius: '12px' },
                { value: 'sm',   label: 'Slight', radius: '8px' },
                { value: 'none', label: 'Square', radius: '0px' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set('sfRadiusBtn', opt.value)}
                  className={`flex-1 min-w-[90px] flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all ${
                    theme.sfRadiusBtn === opt.value
                      ? 'bg-[#4ade80]/10 border-[#4ade80] text-[#4ade80]'
                      : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-16 h-8 bg-current opacity-20"
                    style={{ borderRadius: opt.radius }}
                  />
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Radius */}
          <div className={CARD}>
            <p className={LABEL}>Card Border Radius</p>
            <p className="text-xs text-white/30 mb-4">Controls the corner roundness of product cards and content blocks.</p>
            <div className="flex gap-3 flex-wrap">
              {([
                { value: 'xl',   label: 'Extra Large', radius: '24px' },
                { value: 'lg',   label: 'Large', radius: '16px' },
                { value: 'md',   label: 'Medium', radius: '12px' },
                { value: 'sm',   label: 'Small', radius: '8px' },
                { value: 'none', label: 'Square', radius: '0px' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set('sfRadiusCard', opt.value)}
                  className={`flex-1 min-w-[90px] flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all ${
                    theme.sfRadiusCard === opt.value
                      ? 'bg-[#4ade80]/10 border-[#4ade80] text-[#4ade80]'
                      : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <div
                    className="w-16 h-10 bg-current opacity-20"
                    style={{ borderRadius: opt.radius }}
                  />
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className={CARD}>
            <p className={LABEL}>Section Spacing</p>
            <p className="text-xs text-white/30 mb-4">Controls vertical padding between sections (coming soon — affects future components).</p>
            <div className="flex gap-3">
              {([
                { value: 'compact',     label: 'Compact',     desc: 'Tighter layout' },
                { value: 'default',     label: 'Default',     desc: 'Standard spacing' },
                { value: 'comfortable', label: 'Comfortable', desc: 'More breathing room' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set('sfSpacing', opt.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-xl border transition-all ${
                    theme.sfSpacing === opt.value
                      ? 'bg-[#4ade80]/10 border-[#4ade80] text-[#4ade80]'
                      : 'bg-white/3 border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-[10px] opacity-60">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky save bar */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-2xl bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
