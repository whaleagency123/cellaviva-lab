'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, Eye, EyeOff, RefreshCw, FileText } from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverEmoji: string
  category: string
  published: boolean
  createdAt: string
  updatedAt: string
}

const EMPTY: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
  slug: '', title: '', excerpt: '', body: '', coverEmoji: '🌿', category: 'Hair Care', published: false,
}

const CATEGORIES = ['Hair Care', 'Hair Science', 'Ingredients', 'Lifestyle', 'Product News', 'Tips & Guides']
const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'
const LABEL = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selected, setSelected] = useState<BlogPost | null>(null)
  const [draft, setDraft] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  function startNew() {
    setSelected(null)
    setIsNew(true)
    setDraft(EMPTY)
  }

  function selectPost(p: BlogPost) {
    setSelected(p)
    setIsNew(false)
    setDraft({ slug: p.slug, title: p.title, excerpt: p.excerpt, body: p.body, coverEmoji: p.coverEmoji, category: p.category, published: p.published })
  }

  function upd<K extends keyof typeof draft>(k: K, v: typeof draft[K]) {
    setDraft(d => ({ ...d, [k]: v }))
  }

  async function save() {
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        })
        if (!res.ok) {
          const err = await res.json()
          alert(err.error ?? 'Failed to create post')
          return
        }
        const post = await res.json()
        setIsNew(false)
        setSelected(post)
        load()
      } else if (selected) {
        await fetch(`/api/admin/blog/${selected.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        })
        load()
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (selected?.id === id) { setSelected(null); setDraft(EMPTY) }
    load()
    setDeleting(null)
  }

  async function togglePublish(p: BlogPost) {
    await fetch(`/api/admin/blog/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !p.published }),
    })
    load()
    if (selected?.id === p.id) upd('published', !p.published)
  }

  const showEditor = isNew || selected !== null

  return (
    <div className="flex h-full min-h-screen">
      {/* Post list */}
      <aside className="w-72 bg-[#0c0e15] border-r border-white/5 flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-white/5 flex items-center justify-between">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Blog Posts</p>
          <button onClick={startNew} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ade80]/10 text-[#4ade80] rounded-lg text-xs font-semibold hover:bg-[#4ade80]/20 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Post
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-white/30">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="p-6 text-center text-white/25 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No posts yet. Create your first one.
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {posts.map(p => (
                <div
                  key={p.id}
                  onClick={() => selectPost(p)}
                  className={`group w-full text-left px-3 py-3 rounded-xl cursor-pointer transition-all ${selected?.id === p.id ? 'bg-white/8' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl flex-shrink-0 mt-0.5">{p.coverEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/80 truncate leading-tight">{p.title}</p>
                      <p className="text-xs text-white/30 mt-0.5 truncate">{p.category}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); togglePublish(p) }}
                        title={p.published ? 'Unpublish' : 'Publish'}
                        className={`text-xs rounded-full px-2 py-0.5 font-semibold transition-colors ${p.published ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/8 text-white/30 hover:text-white/60'}`}
                      >
                        {p.published ? 'Live' : 'Draft'}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); deletePost(p.id) }}
                        disabled={deleting === p.id}
                        className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Editor */}
      {showEditor ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-0 z-10 bg-[#0f1117] border-b border-white/5 px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{isNew ? '✏️ New Post' : `✏️ ${draft.title || 'Untitled'}`}</h1>
              <p className="text-xs text-white/30 mt-0.5">
                {isNew ? 'Fill in all fields then save to publish' : `/${draft.slug}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isNew && selected && (
                <button
                  onClick={() => togglePublish(selected)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${draft.published ? 'bg-white/8 text-white/60 hover:bg-white/12' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                >
                  {draft.published ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}
                </button>
              )}
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 bg-[#4ade80] text-[#0b0d13] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#22c55e] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : saved ? '✓ Saved!' : isNew ? 'Create Post' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="flex-1 p-8 space-y-5 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={LABEL}>Post Title *</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={e => {
                    upd('title', e.target.value)
                    if (isNew) upd('slug', slugify(e.target.value))
                  }}
                  className={INPUT}
                  placeholder="Your article headline"
                />
              </div>
              <div>
                <label className={LABEL}>URL Slug *</label>
                <input
                  type="text"
                  value={draft.slug}
                  onChange={e => upd('slug', slugify(e.target.value))}
                  className={INPUT}
                  placeholder="url-friendly-title"
                />
              </div>
              <div>
                <label className={LABEL}>Category</label>
                <select value={draft.category} onChange={e => upd('category', e.target.value)} className={INPUT + ' bg-[#13161f]'}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Cover Emoji</label>
                <input type="text" value={draft.coverEmoji} onChange={e => upd('coverEmoji', e.target.value)} className={INPUT} placeholder="🌿" />
              </div>
            </div>

            <div>
              <label className={LABEL}>Excerpt (shown in blog list)</label>
              <textarea
                rows={3}
                value={draft.excerpt}
                onChange={e => upd('excerpt', e.target.value)}
                className={INPUT + ' resize-none'}
                placeholder="A short description that appears on the blog listing page..."
              />
            </div>

            <div>
              <label className={LABEL}>Body Content (Markdown supported)</label>
              <textarea
                rows={24}
                value={draft.body}
                onChange={e => upd('body', e.target.value)}
                className={INPUT + ' resize-y font-mono text-xs leading-relaxed'}
                placeholder="Write your full article here. Supports Markdown formatting:&#10;&#10;## Heading&#10;**bold**, *italic*, [link](url)&#10;&#10;- Bullet list&#10;- Item 2"
              />
            </div>

            {!isNew && selected && (
              <div className="bg-white/3 rounded-2xl p-4 flex items-center justify-between text-xs text-white/30">
                <span>Post ID: <code className="font-mono">{selected.id}</code></span>
                <span>Created: {new Date(selected.createdAt).toLocaleDateString()}</span>
                <a href={`/blog/${draft.slug}`} target="_blank" className="text-[#4ade80] hover:underline">View on site ↗</a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/20">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Select a post to edit or create a new one</p>
          </div>
        </div>
      )}
    </div>
  )
}
