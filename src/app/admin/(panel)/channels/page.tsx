'use client'
import { useState, useEffect } from 'react'
import {
  Megaphone, ExternalLink, CheckCircle, AlertCircle,
  TrendingUp, DollarSign, Eye, MousePointer,
  Plus, Settings, X, ToggleLeft, ToggleRight, Zap,
  Save, Trash2, Link2,
} from 'lucide-react'

type ConnectStatus  = 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'ENDED'

interface SocialChannel {
  id: string; name: string; handle: string; color: string; bgColor: string
  abbr: string; status: ConnectStatus; followers: string; reach: string
  lastSync: string; link: string; profileUrl: string
}
interface AdCampaign {
  id: string; name: string; platform: string; platformColor: string
  status: CampaignStatus; budget: number; spent: number; impressions: string
  clicks: number; cpc: number; roas: number; conversions: number; startDate: string
  campaignUrl: string
}
interface Pixel {
  name: string; platform: string; abbr: string; color: string
  installed: boolean; pixelId: string; events: string[]
}

const PLATFORM_AD_URLS: Record<string, string> = {
  Facebook:  'https://www.facebook.com/adsmanager',
  Instagram: 'https://www.facebook.com/adsmanager',
  TikTok:    'https://ads.tiktok.com',
  Google:    'https://ads.google.com',
  YouTube:   'https://ads.google.com',
  Pinterest: 'https://ads.pinterest.com',
  Snapchat:  'https://ads.snapchat.com',
}

const PIXEL_TEST_URLS: Record<string, string> = {
  'Meta Pixel':          'https://business.facebook.com/events_manager',
  'Google Tag Manager':  'https://tagmanager.google.com',
  'TikTok Pixel':        'https://ads.tiktok.com/i18n/events_manager',
  'Pinterest Tag':       'https://ads.pinterest.com/advertiser/conversions',
  'Snapchat Pixel':      'https://ads.snapchat.com/ads/b/assets/snap-pixel',
}

const PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'Google', 'YouTube', 'Pinterest', 'Snapchat']

const INIT_CHANNELS: SocialChannel[] = [
  { id: 'fb',   name: 'Facebook',    handle: '@cellaviva',         color: '#1877F2', bgColor: '#1877F218', abbr: 'f',  status: 'CONNECTED', followers: '12.4K', reach: '48K/mo',   lastSync: '2 min ago',  link: 'https://business.facebook.com', profileUrl: 'https://facebook.com/cellaviva' },
  { id: 'ig',   name: 'Instagram',   handle: '@cellaviva.hair',    color: '#E1306C', bgColor: '#E1306C18', abbr: 'in', status: 'CONNECTED', followers: '28.7K', reach: '112K/mo',  lastSync: '5 min ago',  link: 'https://business.instagram.com', profileUrl: 'https://instagram.com/cellaviva.hair' },
  { id: 'tk',   name: 'TikTok',      handle: '@cellaviva',         color: '#69C9D0', bgColor: '#69C9D018', abbr: 'tk', status: 'CONNECTED', followers: '9.1K',  reach: '220K/mo',  lastSync: '12 min ago', link: 'https://ads.tiktok.com', profileUrl: 'https://tiktok.com/@cellaviva' },
  { id: 'yt',   name: 'YouTube',     handle: 'CELLAVIVA Official', color: '#FF0000', bgColor: '#FF000018', abbr: 'yt', status: 'CONNECTED', followers: '4.2K',  reach: '31K/mo',   lastSync: 'Just now',   link: 'https://studio.youtube.com', profileUrl: 'https://youtube.com' },
  { id: 'pin',  name: 'Pinterest',   handle: '@cellaviva',         color: '#E60023', bgColor: '#E6002318', abbr: 'p',  status: 'CONNECTED', followers: '6.8K',  reach: '54K/mo',   lastSync: 'Just now',   link: 'https://ads.pinterest.com', profileUrl: 'https://pinterest.com/cellaviva' },
  { id: 'tw',   name: 'X (Twitter)', handle: '@CellavivaHair',     color: '#1D9BF0', bgColor: '#1D9BF018', abbr: 'X',  status: 'CONNECTED', followers: '3.2K',  reach: '18K/mo',   lastSync: 'Just now',   link: 'https://x.com', profileUrl: 'https://x.com/CellavivaHair' },
  { id: 'goog', name: 'Google',      handle: 'Google Shopping',    color: '#4285F4', bgColor: '#4285F418', abbr: 'G',  status: 'CONNECTED', followers: '—',     reach: '80K/mo',   lastSync: '1 hr ago',   link: 'https://ads.google.com', profileUrl: 'https://ads.google.com' },
]

const INIT_CAMPAIGNS: AdCampaign[] = [
  { id: 'c001', name: 'Summer Hair Loss Awareness', platform: 'Facebook',  platformColor: '#1877F2', status: 'ACTIVE', budget: 1500, spent: 847,  impressions: '124K', clicks: 3240, cpc: 0.26, roas: 4.8, conversions: 73, startDate: '2026-05-01', campaignUrl: 'https://www.facebook.com/adsmanager' },
  { id: 'c002', name: 'Stemuvita Before & After',   platform: 'Instagram', platformColor: '#E1306C', status: 'ACTIVE', budget: 800,  spent: 612,  impressions: '89K',  clicks: 2180, cpc: 0.28, roas: 3.9, conversions: 41, startDate: '2026-05-10', campaignUrl: 'https://www.facebook.com/adsmanager' },
  { id: 'c003', name: 'Hair Loss Solution TikTok',  platform: 'TikTok',    platformColor: '#010101', status: 'ACTIVE', budget: 500,  spent: 298,  impressions: '310K', clicks: 4100, cpc: 0.07, roas: 5.2, conversions: 38, startDate: '2026-05-15', campaignUrl: 'https://ads.tiktok.com' },
  { id: 'c004', name: 'Stemuvita™ Google Shopping', platform: 'Google',    platformColor: '#4285F4', status: 'ACTIVE', budget: 2000, spent: 1340, impressions: '58K',  clicks: 1920, cpc: 0.70, roas: 6.1, conversions: 98, startDate: '2026-04-01', campaignUrl: 'https://ads.google.com' },
  { id: 'c005', name: 'Retargeting — Abandoned Cart',platform:'Facebook',  platformColor: '#1877F2', status: 'ACTIVE', budget: 400,  spent: 318,  impressions: '26K',  clicks: 1140, cpc: 0.28, roas: 7.4, conversions: 41, startDate: '2026-04-20', campaignUrl: 'https://www.facebook.com/adsmanager' },
  { id: 'c006', name: 'Brand Awareness Q2',          platform: 'Instagram', platformColor: '#E1306C', status: 'ACTIVE', budget: 1200, spent: 487,  impressions: '142K', clicks: 3820, cpc: 0.13, roas: 3.1, conversions: 29, startDate: '2026-05-20', campaignUrl: 'https://www.facebook.com/adsmanager' },
  { id: 'c007', name: 'YouTube Hair Loss Series',    platform: 'YouTube',   platformColor: '#FF0000', status: 'ACTIVE', budget: 600,  spent: 214,  impressions: '67K',  clicks: 980,  cpc: 0.22, roas: 4.3, conversions: 18, startDate: '2026-05-22', campaignUrl: 'https://ads.google.com' },
  { id: 'c008', name: 'Pinterest Hair Care Pins',    platform: 'Pinterest', platformColor: '#E60023', status: 'ACTIVE', budget: 350,  spent: 128,  impressions: '210K', clicks: 2640, cpc: 0.05, roas: 3.7, conversions: 14, startDate: '2026-05-24', campaignUrl: 'https://ads.pinterest.com' },
]

const INIT_PIXELS: Pixel[] = [
  { name: 'Meta Pixel',          platform: 'Facebook / Instagram', abbr: 'f',  color: '#1877F2', installed: false, pixelId: '', events: ['PageView', 'ViewContent', 'AddToCart', 'Purchase'] },
  { name: 'Google Tag Manager',  platform: 'Google Ads + Analytics', abbr: 'G', color: '#4285F4', installed: false, pixelId: '', events: ['PageView', 'Purchase', 'Lead'] },
  { name: 'TikTok Pixel',        platform: 'TikTok Ads',           abbr: 'tk', color: '#010101', installed: false, pixelId: '', events: ['PageView', 'ViewContent', 'Purchase'] },
  { name: 'Pinterest Tag',       platform: 'Pinterest Ads',        abbr: 'p',  color: '#E60023', installed: false, pixelId: '', events: ['PageView', 'ViewContent', 'AddToCart', 'Purchase'] },
  { name: 'Snapchat Pixel',      platform: 'Snapchat Ads',         abbr: 'sc', color: '#FFFC00', installed: false, pixelId: '', events: ['PAGE_VIEW', 'VIEW_CONTENT', 'PURCHASE'] },
]

const PIXEL_DB_KEYS: Record<string, string> = {
  'Meta Pixel': 'meta_pixel_id', 'Google Tag Manager': 'gtm_id',
  'TikTok Pixel': 'tiktok_pixel_id', 'Pinterest Tag': 'pinterest_tag_id', 'Snapchat Pixel': 'snapchat_pixel_id',
}

const STATUS_STYLE: Record<CampaignStatus, string> = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-400', PAUSED: 'bg-amber-500/15 text-amber-400',
  DRAFT: 'bg-white/8 text-white/40', ENDED: 'bg-red-500/15 text-red-400',
}
const CONNECT_STYLE: Record<ConnectStatus, string> = {
  CONNECTED: 'text-emerald-400', DISCONNECTED: 'text-white/30', ERROR: 'text-red-400',
}
const CONNECT_ICON: Record<ConnectStatus, typeof CheckCircle> = {
  CONNECTED: CheckCircle, DISCONNECTED: AlertCircle, ERROR: AlertCircle,
}
const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'

type Tab = 'channels' | 'campaigns' | 'pixels'

export default function ChannelsPage() {
  const [channels,   setChannels]   = useState<SocialChannel[]>(INIT_CHANNELS)
  const [campaigns,  setCampaigns]  = useState<AdCampaign[]>(INIT_CAMPAIGNS)
  const [pixels,     setPixels]     = useState<Pixel[]>(INIT_PIXELS)
  const [tab,        setTab]        = useState<Tab>('channels')

  // ── Pixel modal ──────────────────────────────────────────────
  const [editPixel,       setEditPixel]       = useState<Pixel | null>(null)
  const [pixelId,         setPixelId]         = useState('')
  const [selectedEvents,  setSelectedEvents]  = useState<string[]>([])
  const [saving,          setSaving]          = useState(false)
  const [saveMsg,         setSaveMsg]         = useState('')

  // ── Channel settings modal ───────────────────────────────────
  const [editChannel,    setEditChannel]    = useState<SocialChannel | null>(null)
  const [chHandle,       setChHandle]       = useState('')
  const [chProfileUrl,   setChProfileUrl]   = useState('')
  const [chSaving,       setChSaving]       = useState(false)

  // ── New campaign modal ───────────────────────────────────────
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', platform: 'Facebook', budget: '' })
  const [campaignSaving, setCampaignSaving] = useState(false)

  // ── Edit campaign modal ──────────────────────────────────────
  const [editCampaign, setEditCampaign] = useState<AdCampaign | null>(null)
  const [editCamp, setEditCamp] = useState({ name: '', budget: '', status: 'ACTIVE' as CampaignStatus })

  // ── Load pixel IDs from DB ───────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/pixels')
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, string>) => {
        setPixels(prev => prev.map(px => {
          const id = data[PIXEL_DB_KEYS[px.name]]
          return id ? { ...px, pixelId: id, installed: true } : px
        }))
      }).catch(() => {})
  }, [])

  // ── Pixel: Save & Activate ───────────────────────────────────
  async function handleSavePixel() {
    if (!editPixel) return
    setSaving(true); setSaveMsg('')
    try {
      const res = await fetch('/api/admin/pixels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: PIXEL_DB_KEYS[editPixel.name], value: pixelId }),
      })
      if (res.ok) {
        setPixels(prev => prev.map(px => px.name === editPixel.name ? { ...px, pixelId, installed: !!pixelId, events: selectedEvents } : px))
        setSaveMsg('Saved & Active!')
        setTimeout(() => { setSaveMsg(''); setEditPixel(null) }, 1500)
      } else { setSaveMsg('Failed to save.') }
    } catch { setSaveMsg('Network error.') }
    finally { setSaving(false) }
  }

  // ── Pixel: Remove ────────────────────────────────────────────
  async function handleRemovePixel(px: Pixel) {
    await fetch('/api/admin/pixels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: PIXEL_DB_KEYS[px.name], value: '' }),
    }).catch(() => {})
    setPixels(prev => prev.map(p => p.name === px.name ? { ...p, pixelId: '', installed: false } : p))
  }

  // ── Channel: Save settings ───────────────────────────────────
  function handleSaveChannel() {
    if (!editChannel) return
    setChSaving(true)
    setChannels(prev => prev.map(ch => ch.id === editChannel.id
      ? { ...ch, handle: chHandle, profileUrl: chProfileUrl }
      : ch
    ))
    setTimeout(() => { setChSaving(false); setEditChannel(null) }, 600)
  }

  // ── Channel: Connect/Disconnect ──────────────────────────────
  function handleConnect(ch: SocialChannel) {
    window.open(ch.link, '_blank')
    // Mark as connected after user visits the platform
    setChannels(prev => prev.map(c => c.id === ch.id ? { ...c, status: 'CONNECTED' as ConnectStatus, lastSync: 'Just now' } : c))
  }

  // ── Campaign: Toggle ─────────────────────────────────────────
  function toggleCampaign(id: string) {
    setCampaigns(prev => prev.map(c => c.id === id
      ? { ...c, status: c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
      : c
    ))
  }

  // ── Campaign: New ────────────────────────────────────────────
  function handleNewCampaign() {
    if (!newCampaign.name || !newCampaign.budget) return
    setCampaignSaving(true)
    const color = INIT_CHANNELS.find(c => c.name === newCampaign.platform)?.color ?? '#4ade80'
    const nc: AdCampaign = {
      id: 'c' + Date.now(), name: newCampaign.name, platform: newCampaign.platform,
      platformColor: color, status: 'DRAFT', budget: Number(newCampaign.budget),
      spent: 0, impressions: '0', clicks: 0, cpc: 0, roas: 0, conversions: 0,
      startDate: new Date().toISOString().slice(0,10),
      campaignUrl: PLATFORM_AD_URLS[newCampaign.platform] ?? '#',
    }
    setTimeout(() => {
      setCampaigns(prev => [nc, ...prev])
      setNewCampaign({ name: '', platform: 'Facebook', budget: '' })
      setCampaignSaving(false); setShowNewCampaign(false)
    }, 500)
  }

  // ── Campaign: Edit save ──────────────────────────────────────
  function handleSaveCampaign() {
    if (!editCampaign) return
    setCampaigns(prev => prev.map(c => c.id === editCampaign.id
      ? { ...c, name: editCamp.name, budget: Number(editCamp.budget), status: editCamp.status }
      : c
    ))
    setEditCampaign(null)
  }

  // ── Campaign: Delete ─────────────────────────────────────────
  function handleDeleteCampaign(id: string) {
    if (!window.confirm('Delete this campaign?')) return
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  // ── Export campaigns CSV ─────────────────────────────────────
  function exportCampaigns() {
    const rows = [
      ['Campaign', 'Platform', 'Status', 'Budget', 'Spent', 'Impressions', 'Clicks', 'ROAS', 'Conversions'],
      ...campaigns.map(c => [c.name, c.platform, c.status, `$${c.budget}`, `$${c.spent}`, c.impressions, c.clicks, `${c.roas}x`, c.conversions])
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `campaigns-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  const totalSpend = campaigns.filter(c => c.status === 'ACTIVE').reduce((s, c) => s + c.spent, 0)
  const totalConv  = campaigns.filter(c => c.status === 'ACTIVE').reduce((s, c) => s + c.conversions, 0)
  const roasArr    = campaigns.filter(c => c.status === 'ACTIVE' && c.roas > 0)
  const roas       = roasArr.length ? (roasArr.reduce((s, c) => s + c.roas, 0) / roasArr.length).toFixed(1) : '0.0'
  const connected  = channels.filter(c => c.status === 'CONNECTED').length

  const TABS = [
    { id: 'channels' as Tab,  label: 'Social Channels' },
    { id: 'campaigns' as Tab, label: 'Ad Campaigns' },
    { id: 'pixels' as Tab,    label: 'Pixels & Tracking' },
  ]

  return (
    <div className="p-8 space-y-7 min-h-screen bg-[#0f1117]">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-blue-400" /> Channels &amp; Ads
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Connect social platforms, manage ad campaigns, and track pixels.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCampaigns}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
            Export CSV
          </button>
          <button onClick={() => setShowNewCampaign(true)}
            className="flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0b0d13] font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Connected Platforms', value: `${connected}/${channels.length}`, icon: Zap,          accent: '#4ade80' },
          { label: 'Ad Spend (Active)',   value: `$${totalSpend.toLocaleString()}`, icon: DollarSign,   accent: '#60a5fa' },
          { label: 'Avg. ROAS',           value: `${roas}×`,                        icon: TrendingUp,    accent: '#a78bfa' },
          { label: 'Conversions',         value: totalConv,                          icon: MousePointer,  accent: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className={`${CARD} p-5`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${k.accent}18` }}>
              <k.icon className="w-4 h-4" style={{ color: k.accent }} />
            </div>
            <p className="text-2xl font-black text-white">{k.value}</p>
            <p className="text-xs text-white/35 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 gap-0.5 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${tab === t.id ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Social Channels ── */}
      {tab === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {channels.map(ch => {
            const Icon = CONNECT_ICON[ch.status]
            return (
              <div key={ch.id} className={`${CARD} p-5`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                      style={{ background: ch.bgColor, border: `1px solid ${ch.color}30` }}>
                      <span style={{ color: ch.color }}>{ch.abbr}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{ch.name}</p>
                      <p className="text-[10px] text-white/35">{ch.handle}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-semibold ${CONNECT_STYLE[ch.status]}`}>
                    <Icon className="w-3 h-3" />
                    {ch.status === 'CONNECTED' ? 'Connected' : ch.status === 'ERROR' ? 'Error' : 'Not connected'}
                  </div>
                </div>

                {ch.status === 'CONNECTED' && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/4 rounded-xl p-3">
                      <p className="text-white font-bold text-sm">{ch.followers}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">Followers</p>
                    </div>
                    <div className="bg-white/4 rounded-xl p-3">
                      <p className="text-white font-bold text-sm">{ch.reach}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">Reach</p>
                    </div>
                  </div>
                )}

                {ch.status === 'ERROR' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-4">
                    <p className="text-xs text-red-400">Connection error — reconnect to restore sync.</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {ch.status === 'CONNECTED' ? (
                    <>
                      <a href={ch.profileUrl} target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold py-2 rounded-xl text-xs transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Open Platform
                      </a>
                      <button
                        onClick={() => { setEditChannel(ch); setChHandle(ch.handle); setChProfileUrl(ch.profileUrl) }}
                        title="Edit channel settings"
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white/70 font-semibold p-2 rounded-xl text-xs transition-colors">
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleConnect(ch)}
                      className="flex-1 flex items-center justify-center gap-1.5 font-bold py-2 rounded-xl text-xs transition-colors"
                      style={{ background: `${ch.color}22`, border: `1px solid ${ch.color}40` }}>
                      <Plus className="w-3.5 h-3.5" style={{ color: ch.color }} />
                      <span style={{ color: ch.color }}>{ch.status === 'ERROR' ? 'Reconnect' : 'Connect'}</span>
                    </button>
                  )}
                </div>
                {ch.status === 'CONNECTED' && (
                  <p className="text-[10px] text-white/20 mt-2 text-center">Last sync: {ch.lastSync}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Ad Campaigns ── */}
      {tab === 'campaigns' && (
        <div className={`${CARD} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Campaign', 'Platform', 'Status', 'Budget', 'Spent', 'Impressions', 'Clicks', 'CPC', 'ROAS', 'Conv.', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-white/25 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3.5 max-w-[180px]">
                      <div className="font-semibold text-white/80 text-xs truncate">{c.name}</div>
                      <div className="text-white/25 text-[10px] mt-0.5">from {c.startDate}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: `${c.platformColor}20`, color: c.platformColor }}>
                        {c.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-white/50 text-xs">${c.budget}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-semibold text-white/80">${c.spent}</div>
                      {c.budget > 0 && (
                        <div className="h-1 bg-white/8 rounded-full mt-1 w-16">
                          <div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.min((c.spent / c.budget) * 100, 100)}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-white/50 text-xs">{c.impressions}</td>
                    <td className="px-4 py-3.5 text-white/50 text-xs">{c.clicks > 0 ? c.clicks.toLocaleString() : '—'}</td>
                    <td className="px-4 py-3.5 text-white/50 text-xs">{c.cpc > 0 ? `$${c.cpc}` : '—'}</td>
                    <td className="px-4 py-3.5">
                      {c.roas > 0
                        ? <span className={`text-xs font-bold ${c.roas >= 3 ? 'text-[#4ade80]' : c.roas >= 1.5 ? 'text-amber-400' : 'text-red-400'}`}>{c.roas}×</span>
                        : <span className="text-white/25 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-white/50 text-xs">{c.conversions > 0 ? c.conversions : '—'}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        {/* Toggle active/pause */}
                        {c.status === 'ACTIVE'
                          ? <button onClick={() => toggleCampaign(c.id)} title="Pause" className="text-amber-400 hover:text-amber-300 p-1 rounded-lg hover:bg-amber-500/10 transition-colors"><ToggleRight className="w-4 h-4" /></button>
                          : <button onClick={() => toggleCampaign(c.id)} title="Activate" className="text-white/30 hover:text-[#4ade80] p-1 rounded-lg hover:bg-[#4ade80]/10 transition-colors"><ToggleLeft className="w-4 h-4" /></button>
                        }
                        {/* Edit */}
                        <button onClick={() => { setEditCampaign(c); setEditCamp({ name: c.name, budget: String(c.budget), status: c.status }) }}
                          title="Edit campaign" className="text-white/25 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        {/* Open on platform */}
                        <a href={c.campaignUrl} target="_blank" rel="noreferrer" title="Open in ad platform"
                          className="text-white/25 hover:text-blue-400 p-1 rounded-lg hover:bg-blue-500/10 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {/* Delete */}
                        <button onClick={() => handleDeleteCampaign(c.id)} title="Delete"
                          className="text-white/25 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pixels & Tracking ── */}
      {tab === 'pixels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pixels.map(px => (
            <div key={px.name} className={`${CARD} p-5`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: `${px.color}20`, border: `1px solid ${px.color}30` }}>
                    <span style={{ color: px.color === '#010101' || px.color === '#FFFC00' ? '#fff' : px.color }}>{px.abbr}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{px.name}</p>
                    <p className="text-[10px] text-white/35">{px.platform}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-semibold ${px.installed ? 'text-emerald-400' : 'text-white/30'}`}>
                  {px.installed ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {px.installed ? 'Active' : 'Not installed'}
                </span>
              </div>

              {px.installed && (
                <>
                  <div className="bg-white/4 rounded-xl p-3 mb-3">
                    <p className="text-[10px] text-white/30 mb-1">Pixel / Tag ID</p>
                    <p className="font-mono text-xs text-white/70">{px.pixelId}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {px.events.map(ev => (
                      <span key={ev} className="text-[10px] bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded-full font-semibold">{ev}</span>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-2">
                {px.installed ? (
                  <>
                    <button onClick={() => { setEditPixel(px); setPixelId(px.pixelId); setSelectedEvents([...px.events]) }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold py-2 rounded-xl text-xs transition-colors">
                      <Settings className="w-3.5 h-3.5" /> Configure
                    </button>
                    <a href={PIXEL_TEST_URLS[px.name]} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold py-2 rounded-xl text-xs transition-colors">
                      <Eye className="w-3.5 h-3.5" /> Test Events
                    </a>
                    <button onClick={() => handleRemovePixel(px)} title="Remove pixel"
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold p-2 rounded-xl text-xs transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setEditPixel(px); setPixelId(''); setSelectedEvents([...px.events]) }}
                    className="flex-1 flex items-center justify-center gap-1.5 font-bold py-2 rounded-xl text-xs transition-colors"
                    style={{ background: `${px.color}20`, border: `1px solid ${px.color}40`, color: px.color === '#010101' || px.color === '#FFFC00' ? '#fff' : px.color }}>
                    <Plus className="w-3.5 h-3.5" /> Install Pixel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Pixel configure ── */}
      {editPixel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditPixel(null)} />
          <div className="relative bg-[#13161f] border border-white/10 rounded-2xl p-6 w-full max-w-md z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white">Configure {editPixel.name}</h2>
              <button onClick={() => setEditPixel(null)} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Pixel / Tag ID</label>
                <input value={pixelId} onChange={e => setPixelId(e.target.value)}
                  placeholder={`Enter your ${editPixel.name} ID…`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/40 font-mono transition-colors" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Events to Track</label>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedEvents(['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Lead'])}
                      className="text-[10px] text-[#4ade80] hover:underline">All</button>
                    <button onClick={() => setSelectedEvents([])}
                      className="text-[10px] text-white/30 hover:text-white/50 hover:underline">None</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Lead'].map(ev => {
                    const checked = selectedEvents.includes(ev)
                    return (
                      <label key={ev} onClick={() => setSelectedEvents(prev =>
                        checked ? prev.filter(e => e !== ev) : [...prev, ev]
                      )} className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${checked ? 'border-[#4ade80] bg-[#4ade80]' : 'border-white/20 group-hover:border-white/40'}`}>
                          {checked && <CheckCircle className="w-3 h-3 text-[#0b0d13]" />}
                        </div>
                        <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{ev}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSavePixel} disabled={saving}
                  className="flex-1 bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 text-[#0b0d13] font-bold py-2.5 rounded-xl text-sm transition-colors">
                  {saving ? 'Saving…' : saveMsg || 'Save & Activate'}
                </button>
                <button onClick={() => setEditPixel(null)} className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Channel settings ── */}
      {editChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditChannel(null)} />
          <div className="relative bg-[#13161f] border border-white/10 rounded-2xl p-6 w-full max-w-md z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white">Channel Settings — {editChannel.name}</h2>
              <button onClick={() => setEditChannel(null)} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Handle / Username</label>
                <input value={chHandle} onChange={e => setChHandle(e.target.value)} placeholder="@yourbrand"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/40 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                  <Link2 className="w-3 h-3 inline mr-1" /> Profile URL
                </label>
                <input value={chProfileUrl} onChange={e => setChProfileUrl(e.target.value)} placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/40 transition-colors" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveChannel} disabled={chSaving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 text-[#0b0d13] font-bold py-2.5 rounded-xl text-sm transition-colors">
                  <Save className="w-4 h-4" /> {chSaving ? 'Saving…' : 'Save Changes'}
                </button>
                <button onClick={() => setEditChannel(null)} className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: New Campaign ── */}
      {showNewCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewCampaign(false)} />
          <div className="relative bg-[#13161f] border border-white/10 rounded-2xl p-6 w-full max-w-md z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white">New Ad Campaign</h2>
              <button onClick={() => setShowNewCampaign(false)} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Campaign Name</label>
                <input value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Summer Sale 2026"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/40 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Platform</label>
                <select value={newCampaign.platform} onChange={e => setNewCampaign(p => ({ ...p, platform: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4ade80]/40 transition-colors">
                  {PLATFORMS.map(p => <option key={p} value={p} className="bg-[#13161f]">{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Budget ($)</label>
                <input type="number" value={newCampaign.budget} onChange={e => setNewCampaign(p => ({ ...p, budget: e.target.value }))} placeholder="500"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/40 transition-colors" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleNewCampaign} disabled={campaignSaving || !newCampaign.name || !newCampaign.budget}
                  className="flex-1 bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 text-[#0b0d13] font-bold py-2.5 rounded-xl text-sm transition-colors">
                  {campaignSaving ? 'Creating…' : 'Create Campaign'}
                </button>
                <button onClick={() => setShowNewCampaign(false)} className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Campaign ── */}
      {editCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditCampaign(null)} />
          <div className="relative bg-[#13161f] border border-white/10 rounded-2xl p-6 w-full max-w-md z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white">Edit Campaign</h2>
              <button onClick={() => setEditCampaign(null)} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Campaign Name</label>
                <input value={editCamp.name} onChange={e => setEditCamp(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4ade80]/40 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Budget ($)</label>
                <input type="number" value={editCamp.budget} onChange={e => setEditCamp(p => ({ ...p, budget: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4ade80]/40 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Status</label>
                <select value={editCamp.status} onChange={e => setEditCamp(p => ({ ...p, status: e.target.value as CampaignStatus }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4ade80]/40 transition-colors">
                  {(['ACTIVE', 'PAUSED', 'DRAFT', 'ENDED'] as CampaignStatus[]).map(s => (
                    <option key={s} value={s} className="bg-[#13161f]">{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveCampaign}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0b0d13] font-bold py-2.5 rounded-xl text-sm transition-colors">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button onClick={() => setEditCampaign(null)} className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
