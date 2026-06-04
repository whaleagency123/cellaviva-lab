'use client'
import { useState, useEffect, useCallback } from 'react'
import { Save, RefreshCw, Puzzle, Plus, Trash2, Store, Code2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Plugin } from '@/types'

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'
const LABEL = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5'

// Fields per plugin type
const PLUGIN_FIELDS: Record<string, { key: string; label: string; placeholder: string; type?: string }[]> = {
  google_analytics:  [{ key: 'measurementId', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX' }],
  facebook_pixel:    [{ key: 'pixelId',        label: 'Pixel ID',       placeholder: '1234567890123456' }],
  hotjar:            [{ key: 'siteId',          label: 'Site ID',        placeholder: '1234567' }],
  microsoft_clarity: [{ key: 'projectId',       label: 'Project ID',     placeholder: 'abcdefghij' }],
  whatsapp_chat: [
    { key: 'phoneNumber', label: 'Phone (with country code)', placeholder: '+447911123456' },
    { key: 'greeting',    label: 'Pre-filled Message',        placeholder: 'Hi! How can we help?' },
    { key: 'position',    label: 'Position (left / right)',   placeholder: 'right' },
  ],
  tawkto: [
    { key: 'propertyId', label: 'Property ID', placeholder: '60a0b123abc...' },
    { key: 'widgetId',   label: 'Widget ID',   placeholder: 'default' },
  ],
  crisp_chat: [{ key: 'websiteId',  label: 'Website ID',  placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }],
  tidio:      [{ key: 'publicKey',  label: 'Public Key',  placeholder: 'abcdefghijklmnopqrstuvwx' }],
  klaviyo:    [{ key: 'companyId',  label: 'Company ID',  placeholder: 'XXXXXX' }],
  cookie_banner: [
    { key: 'message',     label: 'Banner Message',    placeholder: 'We use cookies to improve your experience.' },
    { key: 'acceptText',  label: 'Accept Button',     placeholder: 'Accept All' },
    { key: 'declineText', label: 'Decline Button',    placeholder: 'Decline' },
  ],
  exit_popup: [
    { key: 'headline',     label: 'Headline',       placeholder: 'Wait! Get 10% Off' },
    { key: 'body',         label: 'Body Text',      placeholder: 'Sign up for an exclusive discount...' },
    { key: 'buttonText',   label: 'Button Text',    placeholder: 'Claim Discount' },
    { key: 'discountCode', label: 'Discount Code',  placeholder: 'SAVE10' },
    { key: 'delaySeconds', label: 'Delay (seconds)',placeholder: '3', type: 'number' },
  ],
  custom_code: [
    { key: 'name',     label: 'Label',                        placeholder: 'My Custom Script' },
    { key: 'position', label: 'Position (head / body)',       placeholder: 'body' },
    { key: 'code',     label: 'HTML / CSS / JavaScript Code', placeholder: '<script>/* your code */</script>' },
  ],
}

// Marketplace catalogue
const MARKETPLACE: { category: string; icon: string; items: { id: string; name: string; desc: string; icon: string }[] }[] = [
  {
    category: 'Analytics', icon: '📈',
    items: [
      { id: 'google_analytics',  name: 'Google Analytics 4',   desc: 'Official GA4 tag manager integration.', icon: '📊' },
      { id: 'facebook_pixel',    name: 'Facebook / Meta Pixel', desc: 'Track ad conversions + build audiences.', icon: '👍' },
      { id: 'hotjar',            name: 'Hotjar',                desc: 'Heatmaps, recordings, and surveys.', icon: '🔥' },
      { id: 'microsoft_clarity', name: 'Microsoft Clarity',     desc: 'Free behavioral analytics from Microsoft.', icon: '🪟' },
    ],
  },
  {
    category: 'Live Chat', icon: '💬',
    items: [
      { id: 'whatsapp_chat', name: 'WhatsApp Button', desc: 'Floating chat button linking to WhatsApp.', icon: '💬' },
      { id: 'tawkto',        name: 'Tawk.to',         desc: 'Free live chat (tawk.to account required).', icon: '🧑‍💼' },
      { id: 'crisp_chat',    name: 'Crisp Chat',      desc: 'Modern live chat with a free plan.', icon: '🟢' },
      { id: 'tidio',         name: 'Tidio',           desc: 'AI chat and chatbots for e-commerce.', icon: '🤖' },
    ],
  },
  {
    category: 'Email Marketing', icon: '📧',
    items: [
      { id: 'klaviyo', name: 'Klaviyo', desc: 'Email + SMS automation for e-commerce brands.', icon: '📧' },
    ],
  },
  {
    category: 'Conversion', icon: '🎯',
    items: [
      { id: 'cookie_banner', name: 'Cookie Banner', desc: 'GDPR-compliant consent notice.', icon: '🍪' },
      { id: 'exit_popup',    name: 'Exit Intent Popup', desc: 'Last-second discount popup.', icon: '🎯' },
    ],
  },
]

type Tab = 'installed' | 'marketplace'

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tab, setTab]           = useState<Tab>('installed')

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/plugins').then(r => r.json()).then(setPlugins).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  function toggle(id: string) {
    setPlugins(ps => ps.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
    setExpanded(prev => prev === id ? null : id)
  }

  function updateSetting(id: string, key: string, value: string) {
    setPlugins(ps => ps.map(p => p.id === id ? { ...p, settings: { ...p.settings, [key]: value } } : p))
  }

  function isInstalled(id: string) {
    return plugins.some(p => p.id === id)
  }

  function install(item: { id: string; name: string; desc: string; icon: string }) {
    if (isInstalled(item.id)) {
      setTab('installed')
      setExpanded(item.id)
      return
    }
    const defaults: Record<string, string> = {}
    PLUGIN_FIELDS[item.id]?.forEach(f => { defaults[f.key] = '' })
    setPlugins(prev => [...prev, {
      id: item.id,
      name: item.name,
      description: item.desc,
      icon: item.icon,
      enabled: false,
      settings: defaults,
    }])
    setTab('installed')
    setExpanded(item.id)
  }

  function addCustomCode() {
    const id = `custom_code_${Date.now()}`
    setPlugins(prev => [...prev, {
      id,
      name: 'Custom Code',
      description: 'Custom HTML / CSS / JavaScript',
      icon: '🛠',
      enabled: false,
      settings: { name: 'My Script', code: '', position: 'body' },
    }])
    setExpanded(id)
  }

  function removePlugin(id: string) {
    setPlugins(prev => prev.filter(p => p.id !== id))
    if (expanded === id) setExpanded(null)
  }

  async function save() {
    setSaving(true)
    await fetch('/api/admin/plugins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plugins),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-5 h-5 animate-spin text-white/40" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-[#4ade80]" /> Plugin Manager
          </h1>
          <p className="text-white/40 mt-1 text-sm">Add integrations without touching code.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#4ade80] text-[#0b0d13] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#22c55e] transition-colors disabled:opacity-60 flex-shrink-0"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {([
          { id: 'installed',   label: 'Installed',   icon: Puzzle },
          { id: 'marketplace', label: 'Marketplace', icon: Store },
        ] as const).map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white/12 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {/* ── Installed tab ──────────────────────────────────────────────── */}
      {tab === 'installed' && (
        <div className="space-y-3">
          {plugins.map(plugin => {
            const fields = PLUGIN_FIELDS[plugin.id] ?? PLUGIN_FIELDS['custom_code'] ?? []
            const isOpen = expanded === plugin.id || plugin.enabled
            const isCustom = plugin.id.startsWith('custom_')

            return (
              <div key={plugin.id} className="bg-[#13161f] border border-white/5 rounded-2xl overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-4 p-5">
                  <span className="text-3xl flex-shrink-0">{plugin.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white">{isCustom ? (plugin.settings.name || plugin.name) : plugin.name}</p>
                    <p className="text-sm text-white/40 mt-0.5 truncate">{plugin.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {fields.length > 0 && (
                      <button
                        onClick={() => setExpanded(e => e === plugin.id ? null : plugin.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                        title={expanded === plugin.id ? 'Hide settings' : 'Configure'}
                      >
                        {expanded === plugin.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                    {isCustom && (
                      <button
                        onClick={() => removePlugin(plugin.id)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {/* Toggle */}
                    <button
                      onClick={() => toggle(plugin.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${plugin.enabled ? 'bg-[#4ade80]' : 'bg-white/10'}`}
                      aria-label={plugin.enabled ? 'Disable' : 'Enable'}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${plugin.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Settings */}
                {fields.length > 0 && isOpen && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-5 space-y-4">
                    {fields.map(f => (
                      <div key={f.key}>
                        <label className={LABEL}>{f.label}</label>
                        {f.key === 'code' ? (
                          <textarea
                            rows={6}
                            value={plugin.settings[f.key] ?? ''}
                            onChange={e => updateSetting(plugin.id, f.key, e.target.value)}
                            className={`${INPUT} resize-y font-mono text-xs`}
                            placeholder={f.placeholder}
                          />
                        ) : (
                          <input
                            type={f.type ?? 'text'}
                            value={plugin.settings[f.key] ?? ''}
                            onChange={e => updateSetting(plugin.id, f.key, e.target.value)}
                            className={INPUT}
                            placeholder={f.placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Add custom code */}
          <button
            onClick={addCustomCode}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-white/10 text-white/40 hover:text-white/70 hover:border-white/25 transition-all text-sm"
          >
            <Code2 className="w-4 h-4" />
            Add Custom HTML / Script
          </button>

          <div className="bg-white/3 rounded-2xl p-5 text-sm text-white/40">
            <p className="font-semibold text-white/60 mb-1">How plugins work</p>
            <p>Enabled plugins inject their scripts into every storefront page automatically. Toggle on, configure, then <strong className="text-white/60">Save Changes</strong>.</p>
          </div>
        </div>
      )}

      {/* ── Marketplace tab ────────────────────────────────────────────── */}
      {tab === 'marketplace' && (
        <div className="space-y-6">
          {MARKETPLACE.map(cat => (
            <div key={cat.category}>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                {cat.icon} {cat.category}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.items.map(item => {
                  const installed = isInstalled(item.id)
                  return (
                    <div key={item.id} className="bg-[#13161f] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{item.name}</p>
                        <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => install(item)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          installed
                            ? 'bg-[#4ade80]/15 text-[#4ade80] hover:bg-[#4ade80]/25'
                            : 'bg-white/8 text-white/70 hover:bg-white/15'
                        }`}
                      >
                        {installed ? '✓ Installed' : 'Install'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Custom code from marketplace too */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">🛠 Custom</p>
            <div className="bg-[#13161f] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🛠</span>
                <div>
                  <p className="font-bold text-white">Custom Code / Script</p>
                  <p className="text-xs text-white/40 mt-0.5">Inject any HTML, CSS, or JavaScript snippet into your storefront.</p>
                </div>
              </div>
              <button
                onClick={() => { addCustomCode(); setTab('installed') }}
                className="flex items-center gap-2 px-4 py-2 bg-white/8 text-white/70 hover:bg-white/15 rounded-xl text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Custom Code Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
