'use client'
import { useState, useEffect, useRef } from 'react'
import { Save, Type, Plus, X, Check, RefreshCw, ExternalLink, Search } from 'lucide-react'
import { THEME_DEFAULTS } from '@/lib/storefront-theme-shared'

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl p-6'
const LABEL = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5'

interface SavedFont {
  name: string
  addedAt: string
}

const POPULAR_DISPLAY_FONTS = [
  'Cormorant Garamond', 'Playfair Display', 'Lora', 'Libre Baskerville',
  'EB Garamond', 'Merriweather', 'Cinzel', 'Bodoni Moda',
  'Tenor Sans', 'Josefin Sans',
]

const POPULAR_BODY_FONTS = [
  'DM Sans', 'Inter', 'Outfit', 'Plus Jakarta Sans',
  'Nunito', 'Poppins', 'Raleway', 'Jost',
  'Source Sans 3', 'Manrope',
]

function FontTag({
  name,
  active,
  role,
  onClick,
}: {
  name: string
  active: boolean
  role: 'display' | 'body'
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
        active
          ? 'bg-[#4ade80]/15 border-[#4ade80] text-[#4ade80]'
          : 'bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white/70'
      }`}
      style={{ fontFamily: `'${name}', serif` }}
    >
      {name}
      {active && <Check className="inline w-3 h-3 ml-1.5" />}
    </button>
  )
}

export default function FontsPage() {
  const [displayFont, setDisplayFont] = useState(THEME_DEFAULTS.sfFontDisplay)
  const [bodyFont, setBodyFont] = useState(THEME_DEFAULTS.sfFontBody)
  const [library, setLibrary] = useState<SavedFont[]>([])
  const [addInput, setAddInput] = useState('')
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog')
  const addRef = useRef<HTMLInputElement>(null)

  // Collect all unique font names to inject into page for preview
  const allFonts = [...new Set([
    displayFont, bodyFont,
    ...POPULAR_DISPLAY_FONTS, ...POPULAR_BODY_FONTS,
    ...library.map(f => f.name),
  ])].filter(f => f !== 'Cormorant Garamond' && f !== 'DM Sans')

  useEffect(() => {
    fetch('/api/admin/appearance')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        if (data.sfFontDisplay) setDisplayFont(data.sfFontDisplay)
        if (data.sfFontBody) setBodyFont(data.sfFontBody)
        if (data.sfFontLibrary) {
          try { setLibrary(JSON.parse(data.sfFontLibrary)) } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Dynamically inject Google Fonts link tag for preview
  useEffect(() => {
    if (allFonts.length === 0) return
    const id = 'admin-font-preview-link'
    const existing = document.getElementById(id)
    if (existing) existing.remove()
    const families = allFonts
      .map(f => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`)
      .join('&')
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`
    document.head.appendChild(link)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFonts.join(',')])

  async function handleAddFont() {
    const name = addInput.trim()
    if (!name) return
    if (!/^[A-Za-z0-9 ]+$/.test(name)) {
      setAddError('Font name must only contain letters, numbers, and spaces.')
      return
    }
    if (name.length > 60) {
      setAddError('Font name is too long.')
      return
    }
    if (library.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      setAddError('Already in your library.')
      return
    }
    setAddLoading(true)
    setAddError('')
    // Verify the font loads from Google Fonts by checking the stylesheet
    try {
      const res = await fetch(
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400`,
        { method: 'GET', mode: 'no-cors' }
      )
      // no-cors returns opaque response; treat any non-network-error as success
      void res
    } catch {
      setAddError('Could not reach Google Fonts. Please check your connection.')
      setAddLoading(false)
      return
    }
    setLibrary(prev => [...prev, { name, addedAt: new Date().toISOString() }])
    setAddInput('')
    setAddLoading(false)
  }

  function removeFont(name: string) {
    setLibrary(prev => prev.filter(f => f.name !== name))
    if (displayFont === name) setDisplayFont(THEME_DEFAULTS.sfFontDisplay)
    if (bodyFont === name) setBodyFont(THEME_DEFAULTS.sfFontBody)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/admin/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sfFontDisplay: displayFont,
          sfFontBody: bodyFont,
          sfFontLibrary: JSON.stringify(library),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white/30 text-sm">
        Loading typography settings…
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Typography</h1>
          <p className="text-sm text-white/40 mt-1">
            Change storefront fonts without touching code — pick from Google Fonts or your library.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Live preview card */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4">
          <p className={LABEL} style={{ marginBottom: 0 }}>Live Preview</p>
          <input
            value={previewText}
            onChange={e => setPreviewText(e.target.value)}
            className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/60 focus:outline-none focus:border-white/20 w-72"
            placeholder="Type preview text…"
          />
        </div>
        <div className="space-y-4 mt-4">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Display / Heading — {displayFont}</p>
            <p
              className="text-4xl font-light text-white leading-tight"
              style={{ fontFamily: `'${displayFont}', serif` }}
            >
              {previewText}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Body / UI — {bodyFont}</p>
            <p
              className="text-base text-white/70 leading-relaxed"
              style={{ fontFamily: `'${bodyFont}', sans-serif` }}
            >
              {previewText}
            </p>
          </div>
          <div className="border-t border-white/5 pt-4">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Storefront button preview</p>
            <button
              className="px-6 py-2.5 text-sm font-semibold text-white rounded-full bg-[#3a79a9] hover:bg-[#266396] transition-colors"
              style={{ fontFamily: `'${bodyFont}', sans-serif` }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Display font */}
        <div className={CARD}>
          <p className={LABEL}>Display / Heading Font</p>
          <p className="text-xs text-white/30 mb-4">Used for hero headlines, section titles, and brand name.</p>
          <div
            className="text-3xl font-light text-white mb-5 leading-tight truncate"
            style={{ fontFamily: `'${displayFont}', serif` }}
          >
            {displayFont}
          </div>

          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Popular Display Fonts</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_DISPLAY_FONTS.map(f => (
              <FontTag
                key={f}
                name={f}
                active={displayFont === f}
                role="display"
                onClick={() => setDisplayFont(f)}
              />
            ))}
          </div>

          {library.length > 0 && (
            <>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Your Library</p>
              <div className="flex flex-wrap gap-2">
                {library.map(f => (
                  <FontTag
                    key={f.name}
                    name={f.name}
                    active={displayFont === f.name}
                    role="display"
                    onClick={() => setDisplayFont(f.name)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Body font */}
        <div className={CARD}>
          <p className={LABEL}>Body / UI Font</p>
          <p className="text-xs text-white/30 mb-4">Used for paragraphs, buttons, labels, and navigation.</p>
          <div
            className="text-3xl font-light text-white mb-5 leading-tight truncate"
            style={{ fontFamily: `'${bodyFont}', sans-serif` }}
          >
            {bodyFont}
          </div>

          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Popular Body Fonts</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_BODY_FONTS.map(f => (
              <FontTag
                key={f}
                name={f}
                active={bodyFont === f}
                role="body"
                onClick={() => setBodyFont(f)}
              />
            ))}
          </div>

          {library.length > 0 && (
            <>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Your Library</p>
              <div className="flex flex-wrap gap-2">
                {library.map(f => (
                  <FontTag
                    key={f.name}
                    name={f.name}
                    active={bodyFont === f.name}
                    role="body"
                    onClick={() => setBodyFont(f.name)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add from Google Fonts */}
      <div className={CARD}>
        <p className={LABEL}>Add from Google Fonts</p>
        <p className="text-xs text-white/30 mb-4">
          Enter any Google Font name exactly as it appears on{' '}
          <a
            href="https://fonts.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#4ade80] hover:underline inline-flex items-center gap-1"
          >
            fonts.google.com <ExternalLink className="w-3 h-3" />
          </a>
        </p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              ref={addRef}
              value={addInput}
              onChange={e => { setAddInput(e.target.value); setAddError('') }}
              onKeyDown={e => e.key === 'Enter' && handleAddFont()}
              placeholder="e.g. Playfair Display, Nunito, Josefin Sans…"
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
            />
          </div>
          <button
            onClick={handleAddFont}
            disabled={addLoading || !addInput.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/8 text-white hover:bg-white/12 border border-white/10 transition-all disabled:opacity-40"
          >
            {addLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Font
          </button>
        </div>
        {addError && (
          <p className="mt-2 text-xs text-red-400">{addError}</p>
        )}

        {/* Font Library */}
        {library.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">
              Your Font Library ({library.length})
            </p>
            <div className="space-y-2">
              {library.map(f => (
                <div
                  key={f.name}
                  className="flex items-center justify-between gap-4 px-4 py-3 bg-white/3 border border-white/8 rounded-xl"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className="text-lg text-white shrink-0"
                      style={{ fontFamily: `'${f.name}', serif` }}
                    >
                      Aa
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{f.name}</p>
                      <p className="text-xs text-white/30">Added {new Date(f.addedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setDisplayFont(f.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        displayFont === f.name
                          ? 'bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30'
                          : 'bg-white/5 text-white/40 border border-white/8 hover:text-white/70 hover:border-white/20'
                      }`}
                    >
                      {displayFont === f.name ? '✓ Display' : 'Set Display'}
                    </button>
                    <button
                      onClick={() => setBodyFont(f.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        bodyFont === f.name
                          ? 'bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30'
                          : 'bg-white/5 text-white/40 border border-white/8 hover:text-white/70 hover:border-white/20'
                      }`}
                    >
                      {bodyFont === f.name ? '✓ Body' : 'Set Body'}
                    </button>
                    <button
                      onClick={() => removeFont(f.name)}
                      className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {library.length === 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-white/25">
            <Type className="w-4 h-4" />
            No custom fonts added yet. Search for a Google Font above to get started.
          </div>
        )}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save & Apply to Storefront'}
        </button>
      </div>
    </div>
  )
}
