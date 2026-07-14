'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Save, Monitor, Tablet, Smartphone,
  Eye, EyeOff, GripVertical, Settings2, ChevronLeft,
  RefreshCw, ExternalLink, Palette, LayoutDashboard, Layers,
  Upload, Loader2, X, Film, ImageIcon, CheckCircle2, Trash2,
  Move, RotateCcw, Undo2, Redo2,
} from 'lucide-react'
import { DEFAULT_SETTINGS } from '@/lib/defaults'
import type { PageSection } from '@/types'

// ── field schema ──────────────────────────────────────────────────────────────
type FieldType = 'text' | 'textarea' | 'color' | 'select' | 'url' | 'image' | 'video' | 'list'
interface FieldDef { key: string; label: string; type: FieldType; options?: string[]; placeholder?: string; labelKey?: string; itemImageFields?: { key: string; label: string }[] }
interface ElementSlot { key: string; label: string; icon: string; defaultZ: number }
interface SectionMeta { icon: string; label: string; cmsTab?: string; fields: FieldDef[]; elements?: ElementSlot[] }

const SCHEMA: Record<string, SectionMeta> = {
  hero: {
    icon: '🏠', label: 'Hero', cmsTab: 'hero',
    fields: [
      { key: 'heroHeading',          label: 'Main Heading',         type: 'textarea', placeholder: 'Your main headline' },
      { key: 'heroSubtext',          label: 'Subtitle',             type: 'textarea', placeholder: 'Supporting text below the heading' },
      { key: 'heroBadgeText',        label: 'Badge Text',           type: 'text',     placeholder: 'Clinically Proven · Plant-Based' },
      { key: 'heroPrimaryBtnText',   label: 'Primary Button',       type: 'text',     placeholder: 'Shop Now' },
      { key: 'heroPrimaryBtnHref',   label: 'Primary Button URL',   type: 'url',      placeholder: '/products' },
      { key: 'heroSecondaryBtnText', label: 'Secondary Button',     type: 'text',     placeholder: 'Learn More' },
      { key: 'heroSecondaryBtnHref', label: 'Secondary Button URL', type: 'url',      placeholder: '/about' },
      { key: 'heroImage',            label: 'Background Image',     type: 'image',    placeholder: '/images/hero-bg.jpg' },
      { key: 'heroVideo',            label: 'Background Video',     type: 'video',    placeholder: '/uploads/hero-video.mp4' },
      { key: 'marqueeItems',         label: 'Marquee Strip Items',  type: 'list' },
    ],
    elements: [
      { key: 'heroElemBg',     label: 'Background Glows',    icon: '✨', defaultZ: 0  },
      { key: 'heroElemText',   label: 'Text & Buttons',      icon: '📝', defaultZ: 10 },
      { key: 'heroElemCard',   label: 'Product Card',        icon: '🃏', defaultZ: 10 },
      { key: 'heroElemBadge1', label: '★ Proven Badge',      icon: '⭐', defaultZ: 20 },
      { key: 'heroElemBadge2', label: '94% Results Badge',   icon: '📊', defaultZ: 20 },
      { key: 'heroElemScroll', label: 'Scroll Indicator',    icon: '⬇️', defaultZ: 10 },
    ],
  },
  press: {
    icon: '📰', label: 'Press / As Seen In', cmsTab: 'press',
    fields: [
      { key: 'pressItems', label: 'Press Logos', type: 'list', labelKey: 'name' },
    ],
  },
  testimonials: {
    icon: '⭐', label: 'Customer Reviews', cmsTab: 'testimonials',
    fields: [
      { key: 'testimonials', label: 'Reviews', type: 'list', labelKey: 'name' },
    ],
  },
  beforeafter: {
    icon: '🔄', label: 'Before & After', cmsTab: 'beforeafter',
    fields: [
      {
        key: 'beforeAfterCases', label: 'Before/After Cases', type: 'list', labelKey: 'name',
        itemImageFields: [
          { key: 'beforeImage', label: 'Before' },
          { key: 'afterImage', label: 'After' },
        ],
      },
    ],
  },
  timeline: {
    icon: '⏱', label: 'Results Timeline', cmsTab: 'timeline',
    fields: [
      { key: 'timeline', label: 'Timeline Steps', type: 'list', labelKey: 'title' },
    ],
  },
  metrics: {
    icon: '📊', label: 'Stats & Metrics', cmsTab: 'metrics',
    fields: [
      { key: 'metrics', label: 'Stat Items', type: 'list', labelKey: 'label' },
    ],
  },
  ingredients: {
    icon: '🌿', label: 'Ingredients', cmsTab: 'ingredients',
    fields: [
      { key: 'ingredients', label: 'Ingredients', type: 'list', labelKey: 'name' },
    ],
  },
  'featured-product': { icon: '🛍', label: 'Featured Product', fields: [] },
  subscription: {
    icon: '🔔', label: 'Subscribe & Save', cmsTab: 'subscription',
    fields: [
      { key: 'subscriptionPerks', label: 'Perks', type: 'list' },
    ],
  },
  guarantee: {
    icon: '🛡', label: 'Guarantee', cmsTab: 'guarantee',
    fields: [
      { key: 'guaranteeCards', label: 'Guarantee Cards', type: 'list', labelKey: 'title' },
    ],
  },
  comparison: {
    icon: '⚖️', label: 'Comparison Table', cmsTab: 'comparison',
    fields: [
      { key: 'comparisonRows', label: 'Comparison Rows', type: 'list', labelKey: 'feature' },
    ],
  },
  faq: {
    icon: '❓', label: 'FAQ', cmsTab: 'faq',
    fields: [
      { key: 'faqItems', label: 'FAQ Items', type: 'list', labelKey: 'question' },
    ],
  },
  'before-after-slider': {
    icon: '↔️', label: 'Before / After Slider',
    fields: [
      { key: 'sliderTitle',       label: 'Heading',       type: 'text',     placeholder: 'See The Difference' },
      { key: 'sliderSubtitle',    label: 'Subtitle',      type: 'textarea', placeholder: 'Drag the slider to compare…' },
      { key: 'sliderBeforeImage', label: 'Before Image',  type: 'image',    placeholder: '/uploads/before.jpg' },
      { key: 'sliderAfterImage',  label: 'After Image',   type: 'image',    placeholder: '/uploads/after.jpg' },
      { key: 'sliderBeforeLabel', label: 'Before Label',  type: 'text',     placeholder: 'Before' },
      { key: 'sliderAfterLabel',  label: 'After Label',   type: 'text',     placeholder: 'After' },
    ],
  },
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'
const SELECT = 'w-full bg-[#13161f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4ade80]'

type Device = 'desktop' | 'tablet' | 'mobile'
const DEVICES: Record<Device, { label: string; icon: typeof Monitor; width: string }> = {
  desktop: { label: 'Desktop', icon: Monitor,    width: '100%' },
  tablet:  { label: 'Tablet',  icon: Tablet,     width: '768px' },
  mobile:  { label: 'Mobile',  icon: Smartphone, width: '390px' },
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|avi|mkv|ogv)(\?.*)?$/i.test(url)
}

// ── MediaField ────────────────────────────────────────────────────────────────
function MediaField({
  fieldKey, type, value, onUrlChange, onUpload, uploading, placeholder,
}: {
  fieldKey: string
  type: 'image' | 'video'
  value: string
  onUrlChange: (v: string) => void
  onUpload: (file: File) => void
  uploading: boolean
  placeholder?: string
}) {
  const [dragOver, setDragOver] = useState(false)
  const accept = type === 'video' ? 'video/mp4,video/webm,video/quicktime,video/*' : 'image/*'
  const hasValue = !!value
  const showAsVideo = hasValue && (type === 'video' || isVideoUrl(value))

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }, [onUpload])

  return (
    <div className="space-y-2">
      {/* Preview */}
      {hasValue && (
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          {showAsVideo ? (
            <video
              src={value}
              className="w-full max-h-36 object-cover bg-black"
              controls
              muted
              playsInline
            />
          ) : (
            <img src={value} alt="" className="w-full h-32 object-cover" />
          )}
          <button
            onClick={() => onUrlChange('')}
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center transition-colors"
            title="Remove"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      {/* Drop zone / upload button */}
      <label
        className={[
          'flex flex-col items-center justify-center gap-2 w-full py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all',
          dragOver
            ? 'border-[#4ade80] bg-[#4ade80]/8'
            : uploading
            ? 'border-white/20 bg-white/3 cursor-wait'
            : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5',
        ].join(' ')}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 text-[#4ade80] animate-spin" />
            <span className="text-xs text-white/50">Uploading…</span>
          </>
        ) : (
          <>
            {type === 'video'
              ? <Film className="w-5 h-5 text-white/30" />
              : <ImageIcon className="w-5 h-5 text-white/30" />}
            <span className="text-xs text-white/50 text-center leading-relaxed">
              <span className="text-white/70 font-semibold">Click to upload</span> or drag & drop
              <br />
              <span className="text-white/30">
                {type === 'video' ? 'MP4, WebM, MOV up to 200 MB' : 'JPG, PNG, WebP, GIF up to 200 MB'}
              </span>
            </span>
          </>
        )}
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) onUpload(file)
            e.target.value = ''
          }}
        />
      </label>

      {/* URL input */}
      <input
        type="text"
        value={value}
        onChange={e => onUrlChange(e.target.value)}
        placeholder={placeholder ?? `Paste ${type} URL…`}
        className={INPUT}
      />
    </div>
  )
}

// ── ListField ─────────────────────────────────────────────────────────────────
function ListField({
  value,
  labelKey,
  itemImageFields,
  onDelete,
  onItemImageUpload,
  onItemImageClear,
  uploadingItemKey,
}: {
  value: string
  labelKey?: string
  itemImageFields?: { key: string; label: string }[]
  onDelete: (index: number) => void
  onItemImageUpload?: (index: number, imageKey: string, file: File) => void
  onItemImageClear?: (index: number, imageKey: string) => void
  uploadingItemKey?: (index: number, imageKey: string) => boolean
}) {
  let items: Array<Record<string, unknown> | string> = []
  try { items = JSON.parse(value || '[]') } catch {}
  if (!Array.isArray(items)) items = []

  if (items.length === 0) {
    return (
      <p className="text-[11px] text-white/25 italic py-3 text-center">
        No items — add them via <strong className="text-white/40">Content &amp; CMS</strong>.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const label = typeof item === 'string'
          ? item
          : labelKey
          ? String((item as Record<string, unknown>)[labelKey] ?? `Item ${i + 1}`)
          : `Item ${i + 1}`
        const record = typeof item === 'string' ? null : (item as Record<string, unknown>)

        return (
          <div key={i} className="group bg-white/5 rounded-xl hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="flex-1 text-xs text-white/70 truncate" title={label}>{label}</span>
              <button
                onClick={() => onDelete(i)}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500 transition-all flex-shrink-0"
                title="Delete item"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>

            {record && itemImageFields && itemImageFields.length > 0 && (
              <div className="grid grid-cols-2 gap-2 px-3 pb-3">
                {itemImageFields.map(({ key: imageKey, label: imageLabel }) => {
                  const url = String(record[imageKey] ?? '')
                  const busy = uploadingItemKey?.(i, imageKey) ?? false
                  return (
                    <div key={imageKey}>
                      <p className="text-[10px] text-white/35 mb-1">{imageLabel}</p>
                      {url ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/10">
                          <img src={url} alt="" className="w-full h-16 object-cover" />
                          <button
                            onClick={() => onItemImageClear?.(i, imageKey)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center transition-colors"
                            title="Remove"
                          >
                            <X className="w-2.5 h-2.5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center gap-1 w-full py-3 rounded-lg border border-dashed cursor-pointer transition-all ${busy ? 'border-white/20 bg-white/3 cursor-wait' : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5'}`}>
                          {busy ? (
                            <Loader2 className="w-3.5 h-3.5 text-[#4ade80] animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-white/30" />
                              <span className="text-[10px] text-white/40">Upload</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={busy}
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) onItemImageUpload?.(i, imageKey, file)
                              e.target.value = ''
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BuilderPage() {
  const [sections, setSections]   = useState<PageSection[]>(DEFAULT_SETTINGS.pageSections)
  const [raw, setRaw]             = useState<Record<string, string>>({})
  const rawRef                    = useRef<Record<string, string>>({}) // always up-to-date
  const [activeId, setActiveId]   = useState<string | null>(null)

  // ── Undo / Redo history ──────────────────────────────────────────────────
  const historyRef  = useRef<PageSection[][]>([])   // past states
  const futureRef   = useRef<PageSection[][]>([])   // redo states
  const skipHistory = useRef(false)                 // skip push when undoing

  // Push to history whenever sections change (except during undo/redo)
  useEffect(() => {
    if (skipHistory.current) { skipHistory.current = false; return }
    historyRef.current = [...historyRef.current.slice(-49), sections]
    futureRef.current  = []                         // clear redo on new change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections])

  function undo() {
    if (historyRef.current.length < 2) return
    const past    = [...historyRef.current]
    const current = past.pop()!                     // current state
    const prev    = past[past.length - 1]           // state to restore
    futureRef.current = [current, ...futureRef.current]
    historyRef.current = past
    skipHistory.current = true
    setSections(prev)
    showToast('Undone ↩')
  }

  function redo() {
    if (futureRef.current.length === 0) return
    const [next, ...rest] = futureRef.current
    futureRef.current  = rest
    historyRef.current = [...historyRef.current, next]
    skipHistory.current = true
    setSections(next)
    showToast('Redone ↪')
  }
  const [device, setDevice]       = useState<Device>('desktop')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [dragFrom, setDragFrom]   = useState<number | null>(null)
  const [dragOver, setDragOver]   = useState<number | null>(null)
  const [iframeKey, setIframeKey] = useState(0)
  const [uploadingKeys, setUploadingKeys] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [showLayers, setShowLayers]       = useState(false)
  const [layersFocusId, setLayersFocusId] = useState<string | null>(null)
  // ── Free-move editor ──────────────────────────────────────────────────────
  const [moveMode, setMoveMode] = useState(false)
  const [elementOverrides, setElementOverrides] = useState<Record<string, { x: number; y: number; w?: number; h?: number }>>({})
  const [savingOverrides, setSavingOverrides] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  // Keyboard shortcuts: Ctrl+Z = undo, Ctrl+Y / Ctrl+Shift+Z = redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (!ctrl) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load settings + element overrides on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        setRaw(data)
        rawRef.current = data
        if (data.pageSections) {
          try { setSections(JSON.parse(data.pageSections)) } catch {}
        }
      })
    fetch('/api/admin/element-overrides')
      .then(r => r.json())
      .then(d => {
        try {
          const ov = JSON.parse(d.overrides ?? '{}')
          setElementOverrides(ov)
        } catch {}
      })
      .catch(() => {})
  }, [])

  // Listen for section clicks / deletes / element overrides from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'section-click') {
        const id = e.data.id as string
        setActiveId(id)
        sendToIframe({ type: 'highlight-section', id })
      }
      if (e.data?.type === 'delete-section') {
        const id = e.data.id as string
        if (!window.confirm('Delete this section? This cannot be undone.')) return
        setSections(prev => {
          const newSections = prev.filter(s => s.id !== id)
          // Save to DB immediately
          fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...raw, pageSections: JSON.stringify(newSections) }),
          }).then(() => setIframeKey(k => k + 1)).catch(() => {})
          // Also remove from customSections if it's a CS_ section
          if (id.startsWith('CS_')) {
            fetch('/api/settings').then(r => r.json()).then((d: Record<string, string>) => {
              try {
                const cs = JSON.parse(d.customSections || '[]')
                const filtered = cs.filter((c: any) => c.id !== id)
                fetch('/api/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ customSections: JSON.stringify(filtered) }),
                })
              } catch {}
            })
          }
          return newSections
        })
        setActiveId(prev => prev === id ? null : prev)
      }
      if (e.data?.type === 'save-element-override') {
        const { selector, override } = e.data as {
          selector: string
          override: { x: number; y: number; w?: number; h?: number }
        }
        setElementOverrides(prev => {
          const next = { ...prev, [selector]: override }
          // Persist immediately
          fetch('/api/admin/element-overrides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ overrides: JSON.stringify(next) }),
          }).catch(() => {})
          return next
        })
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  function sendToIframe(msg: Record<string, unknown>) {
    iframeRef.current?.contentWindow?.postMessage(msg, '*')
  }

  function selectSection(id: string) {
    setActiveId(id)
    sendToIframe({ type: 'highlight-section', id })
    sendToIframe({ type: 'scroll-to-section', id })
  }

  function updateField(key: string, value: string) {
    const next = { ...rawRef.current, [key]: value }
    rawRef.current = next
    setRaw(next)
  }

  async function handleMediaUpload(key: string, file: File) {
    setUploadingKeys(prev => ({ ...prev, [key]: true }))
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        showToast(err.error ?? 'Upload failed', false)
        return
      }
      const { url } = await res.json()
      // Use rawRef (always fresh) to avoid stale closure bug
      const newRaw = { ...rawRef.current, [key]: url }
      rawRef.current = newRaw
      setRaw(newRaw)
      await doSave(newRaw)
      showToast('Uploaded & saved!')
      setIframeKey(k => k + 1)
    } catch {
      showToast('Upload failed — check your connection', false)
    } finally {
      setUploadingKeys(prev => ({ ...prev, [key]: false }))
    }
  }

  function handleListDelete(key: string, index: number) {
    const currentVal = raw[key]
    let items: Array<unknown>
    try {
      items = JSON.parse(currentVal ?? JSON.stringify((DEFAULT_SETTINGS as unknown as Record<string, unknown>)[key] ?? []))
    } catch {
      items = []
    }
    const next = [...items]
    next.splice(index, 1)
    updateField(key, JSON.stringify(next))
  }

  function readListItems(key: string): Array<Record<string, unknown>> {
    const currentVal = rawRef.current[key]
    try {
      const items = JSON.parse(currentVal ?? JSON.stringify((DEFAULT_SETTINGS as unknown as Record<string, unknown>)[key] ?? []))
      return Array.isArray(items) ? items : []
    } catch {
      return []
    }
  }

  function listItemUploadKey(fieldKey: string, index: number, imageKey: string) {
    return `${fieldKey}.${index}.${imageKey}`
  }

  async function handleListItemImageUpload(fieldKey: string, index: number, imageKey: string, file: File) {
    const uploadKey = listItemUploadKey(fieldKey, index, imageKey)
    setUploadingKeys(prev => ({ ...prev, [uploadKey]: true }))
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        showToast(err.error ?? 'Upload failed', false)
        return
      }
      const { url } = await res.json()
      const items = readListItems(fieldKey)
      const next = [...items]
      next[index] = { ...next[index], [imageKey]: url }
      const newRaw = { ...rawRef.current, [fieldKey]: JSON.stringify(next) }
      rawRef.current = newRaw
      setRaw(newRaw)
      await doSave(newRaw)
      showToast('Uploaded & saved!')
      setIframeKey(k => k + 1)
    } catch {
      showToast('Upload failed — check your connection', false)
    } finally {
      setUploadingKeys(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  async function handleListItemImageClear(fieldKey: string, index: number, imageKey: string) {
    const items = readListItems(fieldKey)
    const next = [...items]
    next[index] = { ...next[index], [imageKey]: '' }
    const newRaw = { ...rawRef.current, [fieldKey]: JSON.stringify(next) }
    rawRef.current = newRaw
    setRaw(newRaw)
    await doSave(newRaw)
    setIframeKey(k => k + 1)
  }

  async function doSave(currentRaw = rawRef.current) {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentRaw, pageSections: JSON.stringify(sections) }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      setIframeKey(k => k + 1)
    } finally {
      setSaving(false)
    }
  }

  async function save() { await doSave() }

  // Drag-to-reorder handlers
  function onDragStart(i: number) { setDragFrom(i) }
  function onDragOver(e: React.DragEvent, i: number) { e.preventDefault(); setDragOver(i) }
  function onDrop(i: number) {
    if (dragFrom === null || dragFrom === i) return
    const next = [...sections]
    const [item] = next.splice(dragFrom, 1)
    next.splice(i, 0, item)
    setSections(next)
    setDragFrom(null)
    setDragOver(null)
  }

  function toggleVisible(id: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }

  async function deleteSection(id: string) {
    if (!window.confirm('Delete this section? This cannot be undone.')) return
    const newSections = sections.filter(s => s.id !== id)
    setSections(newSections)
    if (activeId === id) setActiveId(null)
    // Auto-save immediately with updated sections
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...raw, pageSections: JSON.stringify(newSections) }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setIframeKey(k => k + 1)
    } finally {
      setSaving(false)
    }
  }

  function updateSectionZ(id: string, z: number) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, zIndex: isNaN(z) ? undefined : z } : s))
  }

  const schema = activeId ? SCHEMA[activeId] : null
  const hasFields = (schema?.fields.length ?? 0) > 0

  return (
    <div className="h-screen flex flex-col bg-[#0b0d13] overflow-hidden" style={{ fontFamily: 'var(--font-body, system-ui, sans-serif)' }}>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={[
          'fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold pointer-events-none transition-all',
          toast.ok ? 'bg-[#0b0d13] border border-[#4ade80]/40 text-white' : 'bg-red-950 border border-red-500/40 text-red-300',
        ].join(' ')}>
          {toast.ok
            ? <CheckCircle2 className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
            : <X className="w-4 h-4 text-red-400 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 h-14 border-b border-white/8 flex-shrink-0 bg-[#0b0d13]">
        <Link href="/admin" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <LayoutDashboard className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
        <span className="text-sm font-bold text-white hidden sm:inline">Page Builder</span>

        {/* Device switcher */}
        <div className="flex gap-0.5 mx-auto bg-white/5 p-1 rounded-xl">
          {(Object.entries(DEVICES) as [Device, typeof DEVICES.desktop][]).map(([key, d]) => {
            const Icon = d.icon
            return (
              <button
                key={key}
                onClick={() => setDevice(key)}
                title={d.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${device === key ? 'bg-white/12 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{d.label}</span>
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <button
          onClick={() => { setShowLayers(l => !l); setLayersFocusId(null); setActiveId(null) }}
          title="Manage layers & z-index"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${showLayers ? 'bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30' : 'text-white/30 hover:text-white/70 hover:bg-white/5'}`}
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Layers</span>
        </button>

        {/* ── Move Mode toggle ──────────────────────────────────────── */}
        <button
          onClick={() => {
            const next = !moveMode
            setMoveMode(next)
            setShowLayers(false)
            setActiveId(null)
            sendToIframe({ type: 'set-move-mode', enabled: next })
            if (next) {
              // Send current overrides to iframe
              sendToIframe({ type: 'load-overrides', overrides: JSON.stringify(elementOverrides) })
            }
          }}
          title={moveMode ? 'Exit Move Mode' : 'Free-move elements (drag any element to reposition or resize)'}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            moveMode
              ? 'bg-[#60a5fa]/15 text-[#60a5fa] border border-[#60a5fa]/30'
              : 'text-white/30 hover:text-white/70 hover:bg-white/5'
          }`}
        >
          <Move className="w-4 h-4" />
          <span className="hidden sm:inline">{moveMode ? 'Moving…' : 'Move'}</span>
        </button>

        {/* Reset all positions */}
        {Object.keys(elementOverrides).length > 0 && (
          <button
            onClick={async () => {
              sendToIframe({ type: 'reset-all-overrides' })
              setElementOverrides({})
              await fetch('/api/admin/element-overrides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ overrides: '{}' }),
              })
              showToast('All positions reset')
            }}
            title="Reset all element positions"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs text-[#f87171]/70 hover:text-[#f87171] hover:bg-[#f87171]/8 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Reset positions</span>
          </button>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-white/5 rounded-xl p-1">
          <button
            onClick={undo}
            disabled={historyRef.current.length < 2}
            title="Undo (Ctrl+Z)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Undo</span>
          </button>
          <button
            onClick={redo}
            disabled={futureRef.current.length === 0}
            title="Redo (Ctrl+Y)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Redo</span>
          </button>
        </div>

        <button
          onClick={() => setIframeKey(k => k + 1)}
          title="Refresh preview"
          className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <a
          href="/"
          target="_blank"
          title="Open storefront"
          className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] text-[#0b0d13] rounded-xl text-sm font-bold hover:bg-[#22c55e] disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save'}
        </button>
      </header>

      {/* ── Move mode hint bar ───────────────────────────────────────────── */}
      {moveMode && (
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-[#60a5fa]/10 border-b border-[#60a5fa]/20 text-xs text-[#60a5fa]/90 flex-shrink-0">
          <Move className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong className="text-[#60a5fa]">Click any element</strong> in the preview to select it.
            Drag the <strong className="text-[#60a5fa]">blue MOVE handle</strong> to reposition on X/Y.
            Drag the <strong className="text-[#60a5fa]">blue corner</strong> to resize.
            Positions save automatically.
          </span>
          {Object.keys(elementOverrides).length > 0 && (
            <span className="ml-auto flex-shrink-0 bg-[#60a5fa]/20 px-2 py-0.5 rounded-full">
              {Object.keys(elementOverrides).length} override{Object.keys(elementOverrides).length !== 1 ? 's' : ''} saved
            </span>
          )}
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left panel ───────────────────────────────────────────────── */}
        <aside className="w-[280px] flex flex-col border-r border-white/8 bg-[#0e1118] overflow-y-auto flex-shrink-0">

          {showLayers ? (
            // ── Layers panel ────────────────────────────────────────────
            <>
              <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-[#0e1118]">
                {layersFocusId ? (
                  <button
                    onClick={() => setLayersFocusId(null)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <Layers className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                )}
                <span className="text-sm font-semibold text-white">
                  {layersFocusId ? `${SCHEMA[layersFocusId]?.icon} ${SCHEMA[layersFocusId]?.label} — Elements` : 'Layers'}
                </span>
                <span className="ml-auto text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wide">Z-axis</span>
              </div>

              {/* Depth bar chart */}
              {(() => {
                const items = layersFocusId
                  ? (SCHEMA[layersFocusId]?.elements ?? []).map(el => ({
                      icon: el.icon,
                      label: el.label,
                      z: parseInt(raw[el.key] ?? '') || el.defaultZ,
                    }))
                  : sections.filter(s => s.visible).map(s => ({
                      icon: SCHEMA[s.id]?.icon ?? '□',
                      label: s.label,
                      z: s.zIndex ?? 0,
                    }))
                if (items.length === 0) return null
                const maxZ = Math.max(...items.map(i => i.z), 1)
                const minZ = Math.min(...items.map(i => i.z), 0)
                const range = maxZ - minZ || 1
                return (
                  <div className="px-4 py-4 border-b border-white/8">
                    <p className="text-[11px] font-semibold text-white/35 uppercase tracking-widest mb-3">Depth Preview</p>
                    <div className="flex items-end gap-1 h-12 bg-white/3 rounded-xl px-2 pt-2">
                      {items.map((item, i) => {
                        const pct = Math.max(12, ((item.z - minZ) / range) * 80 + 12)
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${item.label}: z ${item.z}`}>
                            <div
                              className="w-full rounded-t transition-all duration-300"
                              style={{
                                height: `${pct}%`,
                                background: `rgba(74,222,128,${0.10 + (pct / 100) * 0.60})`,
                                borderTop: `1.5px solid rgba(74,222,128,${0.25 + (pct / 100) * 0.65})`,
                              }}
                            />
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {items.map((item, i) => (
                        <div key={i} className="flex-1 text-center" style={{ fontSize: '11px' }}>{item.icon}</div>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/20 mt-2">Taller bar = higher z-index = in front</p>
                  </div>
                )
              })()}

              {/* Layer rows */}
              <div className="p-3 space-y-0.5 select-none">
                {layersFocusId ? (
                  // ── Element slots for the focused section ──────────────
                  <>
                    {(SCHEMA[layersFocusId]?.elements ?? []).map(el => {
                      const z = parseInt(raw[el.key] ?? '') || el.defaultZ
                      return (
                        <div key={el.key} className="flex items-center gap-2 px-2.5 py-2.5 rounded-xl hover:bg-white/5 transition-all group">
                          <span className="text-base flex-shrink-0 w-6 text-center">{el.icon}</span>
                          <span className="text-[12px] text-white/65 flex-1 truncate">{el.label}</span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => updateField(el.key, String(Math.max(0, z - 1)))}
                              className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                            >−</button>
                            <input
                              type="number"
                              value={z}
                              min={0}
                              max={999}
                              onChange={e => updateField(el.key, e.target.value)}
                              onClick={e => e.stopPropagation()}
                              className="w-12 bg-white/8 border border-white/12 rounded-lg px-1.5 py-1 text-xs text-white text-center focus:outline-none focus:border-[#4ade80] transition-colors"
                            />
                            <button
                              onClick={() => updateField(el.key, String(z + 1))}
                              className="w-5 h-5 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                            >+</button>
                          </div>
                        </div>
                      )
                    })}
                    <p className="text-[11px] text-white/20 pt-3 px-1 leading-relaxed">
                      Higher z-index = appears in front of other elements. Click <strong className="text-white/40">Save</strong> to apply.
                    </p>
                  </>
                ) : (
                  // ── Section list ───────────────────────────────────────
                  <>
                    {sections.map((sec, i) => {
                      const meta = SCHEMA[sec.id]
                      const hasElems = (meta?.elements?.length ?? 0) > 0
                      const z = sec.zIndex ?? 0
                      return (
                        <div
                          key={sec.id}
                          draggable
                          onDragStart={() => onDragStart(i)}
                          onDragOver={e => onDragOver(e, i)}
                          onDrop={() => onDrop(i)}
                          onDragEnd={() => { setDragFrom(null); setDragOver(null) }}
                          className={[
                            'group flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all',
                            dragOver === i ? 'ring-2 ring-[#4ade80] ring-inset' : '',
                            !sec.visible ? 'opacity-40' : '',
                            'hover:bg-white/5',
                          ].filter(Boolean).join(' ')}
                        >
                          <GripVertical className="w-3.5 h-3.5 text-white/15 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                          <button onClick={() => toggleVisible(sec.id)} className="text-white/20 hover:text-white/70 transition-colors flex-shrink-0">
                            {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-sm flex-shrink-0">{meta?.icon ?? '□'}</span>
                          <span className="text-[12px] text-white/60 flex-1 truncate min-w-0">{sec.label}</span>
                          {hasElems && (
                            <button
                              onClick={() => setLayersFocusId(sec.id)}
                              className="opacity-0 group-hover:opacity-100 text-[11px] text-[#4ade80]/70 hover:text-[#4ade80] transition-all flex-shrink-0 px-1.5 py-0.5 rounded-md border border-[#4ade80]/20 hover:border-[#4ade80]/50"
                              title="Manage elements"
                            >
                              ⋯
                            </button>
                          )}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={e => { e.stopPropagation(); updateSectionZ(sec.id, z - 1) }}
                              className="w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                            >−</button>
                            <input
                              type="number"
                              value={z}
                              min={-10}
                              max={999}
                              onChange={e => updateSectionZ(sec.id, parseInt(e.target.value))}
                              onClick={e => e.stopPropagation()}
                              className="w-11 bg-white/8 border border-white/12 rounded-lg px-1 py-1 text-xs text-white text-center focus:outline-none focus:border-[#4ade80] transition-colors"
                              title={`Z-index for ${sec.label}`}
                            />
                            <button
                              onClick={e => { e.stopPropagation(); updateSectionZ(sec.id, z + 1) }}
                              className="w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                            >+</button>
                          </div>
                        </div>
                      )
                    })}
                    <p className="text-[11px] text-white/20 mt-3 px-1 leading-relaxed">
                      Set z-index per section. Click <strong className="text-white/35">⋯</strong> on sections that have elements to manage per-element depth. Click <strong className="text-white/40">Save</strong> to apply.
                    </p>
                  </>
                )}
              </div>
            </>
          ) : activeId && hasFields ? (
            // ── Section field editor ────────────────────────────────────
            <>
              <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-[#0e1118]">
                <button
                  onClick={() => setActiveId(null)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm mr-0.5">{schema?.icon}</span>
                <span className="text-sm font-semibold text-white">{schema?.label}</span>
              </div>

              <div className="p-4 space-y-5">
                {schema!.fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                      {f.label}
                    </label>

                    {f.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={raw[f.key] ?? ''}
                        onChange={e => updateField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className={`${INPUT} resize-none`}
                      />
                    ) : f.type === 'color' ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={raw[f.key] ?? '#3a79a9'}
                          onChange={e => updateField(f.key, e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={raw[f.key] ?? ''}
                          onChange={e => updateField(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className={`${INPUT} flex-1`}
                        />
                      </div>
                    ) : f.type === 'select' ? (
                      <select
                        value={raw[f.key] ?? ''}
                        onChange={e => updateField(f.key, e.target.value)}
                        className={INPUT}
                      >
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'image' || f.type === 'video' ? (
                      <MediaField
                        fieldKey={f.key}
                        type={f.type}
                        value={raw[f.key] ?? ''}
                        onUrlChange={v => updateField(f.key, v)}
                        onUpload={file => handleMediaUpload(f.key, file)}
                        uploading={!!uploadingKeys[f.key]}
                        placeholder={f.placeholder}
                      />
                    ) : f.type === 'list' ? (
                      <ListField
                        value={
                          raw[f.key] !== undefined
                            ? raw[f.key]
                            : JSON.stringify((DEFAULT_SETTINGS as unknown as Record<string, unknown>)[f.key] ?? [])
                        }
                        labelKey={f.labelKey}
                        itemImageFields={f.itemImageFields}
                        onDelete={i => handleListDelete(f.key, i)}
                        onItemImageUpload={(i, imageKey, file) => handleListItemImageUpload(f.key, i, imageKey, file)}
                        onItemImageClear={(i, imageKey) => handleListItemImageClear(f.key, i, imageKey)}
                        uploadingItemKey={(i, imageKey) => !!uploadingKeys[listItemUploadKey(f.key, i, imageKey)]}
                      />
                    ) : (
                      <input
                        type="text"
                        value={raw[f.key] ?? ''}
                        onChange={e => updateField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className={INPUT}
                      />
                    )}
                  </div>
                ))}

                <p className="text-[11px] text-white/25 pt-1 border-t border-white/5">
                  Click <strong className="text-white/40">Save</strong> in the top bar to publish changes.
                  Uploaded media saves automatically.
                </p>
              </div>
            </>
          ) : (
            // ── Global design + sections list ───────────────────────────
            <>
              {/* Design panel */}
              <div className="p-4 border-b border-white/8">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">
                  <Palette className="w-3.5 h-3.5" /> Global Design
                </p>
                <div className="space-y-3">

                  {[
                    { key: 'sfPrimary', label: 'Primary Color',    def: '#3a79a9' },
                    { key: 'sfBg',      label: 'Background Color', def: '#f6f5f3' },
                    { key: 'sfText',    label: 'Text Color',       def: '#222222' },
                  ].map(({ key, label, def }) => (
                    <div key={key}>
                      <label className="block text-[11px] text-white/40 mb-1">{label}</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={raw[key] ?? def}
                          onChange={e => updateField(key, e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={raw[key] ?? def}
                          onChange={e => updateField(key, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4ade80]"
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-[11px] text-white/40 mb-1">Section Spacing</label>
                    <select value={raw['sfSpacing'] ?? 'default'} onChange={e => updateField('sfSpacing', e.target.value)} className={SELECT}>
                      <option value="compact">Compact</option>
                      <option value="default">Default</option>
                      <option value="comfortable">Comfortable</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/40 mb-1">Button Shape</label>
                    <select value={raw['sfRadiusBtn'] ?? 'pill'} onChange={e => updateField('sfRadiusBtn', e.target.value)} className={SELECT}>
                      <option value="pill">Pill (fully rounded)</option>
                      <option value="lg">Large Rounded</option>
                      <option value="md">Medium Rounded</option>
                      <option value="sm">Slightly Rounded</option>
                      <option value="none">Square</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/40 mb-1">Card Shape</label>
                    <select value={raw['sfRadiusCard'] ?? 'xl'} onChange={e => updateField('sfRadiusCard', e.target.value)} className={SELECT}>
                      <option value="xl">Extra Rounded</option>
                      <option value="lg">Large Rounded</option>
                      <option value="md">Medium Rounded</option>
                      <option value="sm">Slightly Rounded</option>
                      <option value="none">Square</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/40 mb-1">Icon Size</label>
                    <select value={raw['sfIconSize'] ?? 'md'} onChange={e => updateField('sfIconSize', e.target.value)} className={SELECT}>
                      <option value="sm">Small</option>
                      <option value="md">Medium (Default)</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Sections list */}
              <div className="p-4 select-none">
                <div className="flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5 text-white/40" />
                  <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Sections</p>
                </div>
                <p className="text-[11px] text-white/20 mb-3">Drag to reorder · 👁 show/hide · 🗑 delete · click to edit</p>
                <div className="space-y-0.5">
                  {sections.map((sec, i) => {
                    const meta = SCHEMA[sec.id]
                    const editable = (meta?.fields.length ?? 0) > 0
                    return (
                      <div
                        key={sec.id}
                        draggable
                        onDragStart={() => onDragStart(i)}
                        onDragOver={e => onDragOver(e, i)}
                        onDrop={() => onDrop(i)}
                        onDragEnd={() => { setDragFrom(null); setDragOver(null) }}
                        onClick={() => editable
                          ? selectSection(sec.id)
                          : sendToIframe({ type: 'scroll-to-section', id: sec.id })}
                        className={[
                          'group flex items-center gap-2 px-2.5 py-2.5 rounded-xl transition-all cursor-pointer',
                          activeId === sec.id ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80',
                          dragOver === i ? 'ring-2 ring-[#4ade80] ring-inset' : '',
                          !sec.visible ? 'opacity-40' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        <GripVertical className="w-3.5 h-3.5 text-white/15 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                        <span className="text-sm flex-shrink-0">{meta?.icon ?? '□'}</span>
                        <span className="text-[13px] flex-1 truncate">{sec.label}</span>

                        {meta?.cmsTab && (
                          <Link
                            href="/admin/settings"
                            onClick={e => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-[#4ade80] transition-all flex-shrink-0"
                            title="Edit in CMS"
                          >
                            <Settings2 className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); toggleVisible(sec.id) }}
                          className="text-white/20 hover:text-white/70 transition-colors flex-shrink-0"
                          title={sec.visible ? 'Hide section' : 'Show section'}
                        >
                          {sec.visible
                            ? <Eye className="w-3.5 h-3.5" />
                            : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); deleteSection(sec.id) }}
                          className="text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg p-0.5 transition-all flex-shrink-0"
                          title="Delete section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
                <p className="mt-4 text-[11px] text-white/20 leading-relaxed">
                  For content like testimonials, FAQ, and ingredients, use the{' '}
                  <Link href="/admin/settings" className="text-[#4ade80] hover:underline">Content & CMS</Link>{' '}
                  page.
                </p>
              </div>
            </>
          )}
        </aside>

        {/* ── Preview iframe ────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 bg-[#13161f] flex items-start justify-center overflow-auto p-5">
          <div
            className="relative bg-white shadow-2xl overflow-hidden flex-shrink-0 transition-all duration-300"
            style={{
              width: DEVICES[device].width,
              height: 'calc(100vh - 56px - 40px)',
              borderRadius: device === 'desktop' ? '8px' : '20px',
              minWidth: device !== 'desktop' ? DEVICES[device].width : undefined,
            }}
          >
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src="/?builder=1"
              className="w-full h-full border-0"
              title="Storefront Preview"
              onLoad={() => {
                if (activeId) {
                  setTimeout(() => sendToIframe({ type: 'highlight-section', id: activeId }), 150)
                }
                // Send saved overrides so iframe applies them
                setTimeout(() => {
                  sendToIframe({ type: 'load-overrides', overrides: JSON.stringify(elementOverrides) })
                  if (moveMode) sendToIframe({ type: 'set-move-mode', enabled: true })
                }, 300)
              }}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
