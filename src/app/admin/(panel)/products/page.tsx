'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Plus, Search, Edit2, Trash2, X,
  Globe, AlertTriangle, Star, Archive, Eye,
  Upload, ImageIcon, Loader2,
} from 'lucide-react'

interface Variant {
  id: string; title: string; sku: string; barcode: string
  price: number; comparePrice: number; stock: number; weight: number
}

interface ProductFull {
  id: string; slug: string; title: string; description: string
  vendor: string; productType: string; tags: string[]
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'; featured: boolean
  price: number; salePrice: number | null; stock: number
  sku: string; barcode: string; weight: number; weightUnit: 'kg' | 'g' | 'lb' | 'oz'
  trackInventory: boolean; seoTitle: string; seoDescription: string
  images: string[]
  variants: Variant[]; createdAt: string; updatedAt: string
}

const MOCK_PRODUCTS: ProductFull[] = [
  {
    id: 'prod_stemuvita_01', slug: 'stemuvita',
    title: 'Stemuvita™ Hair Cleanse',
    description: 'Our flagship plant-based scalp cleanser powered by botanical stem cell technology. Gently removes buildup while delivering targeted nourishment deep into hair follicles. Clinically proven to reduce shedding by 91% in 8 weeks.',
    vendor: 'CELLAVIVA Labs', productType: 'Shampoo',
    tags: ['bestseller', 'hair-loss', 'plant-based', 'stem-cell'],
    status: 'ACTIVE', featured: true, price: 100, salePrice: 49, stock: 47,
    sku: 'CV-HCL-001', barcode: '5901234123457', weight: 0.35, weightUnit: 'kg', trackInventory: true,
    seoTitle: 'Stemuvita™ Hair Cleanse – Plant-Based Scalp Cleanser | CELLAVIVA',
    seoDescription: 'Clinically proven plant-based shampoo that reduces hair shedding by 91% in 8 weeks.',
    images: [],
    variants: [{ id: 'var_01', title: '250ml', sku: 'CV-HCL-001-250', barcode: '5901234123457', price: 49, comparePrice: 100, stock: 47, weight: 0.35 }],
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'prod_stemuvita_serum_01', slug: 'stemuvita-serum',
    title: 'Stemuvita™ Scalp Serum',
    description: 'The perfect complement to the Hair Cleanse. This concentrated leave-in serum delivers a powerful dose of plant stem cell actives directly to the scalp.',
    vendor: 'CELLAVIVA Labs', productType: 'Serum',
    tags: ['serum', 'leave-in', 'overnight', 'stem-cell'],
    status: 'ACTIVE', featured: false, price: 80, salePrice: 42, stock: 63,
    sku: 'CV-SER-001', barcode: '5901234123464', weight: 0.15, weightUnit: 'kg', trackInventory: true,
    seoTitle: 'Stemuvita™ Scalp Serum – Overnight Follicle Repair | CELLAVIVA',
    seoDescription: 'Leave-in scalp serum with concentrated plant stem cell actives. Stimulates follicle health overnight.',
    images: [],
    variants: [{ id: 'var_02', title: '50ml', sku: 'CV-SER-001-50', barcode: '5901234123464', price: 42, comparePrice: 80, stock: 63, weight: 0.15 }],
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2026-05-18T14:30:00Z',
  },
  {
    id: 'prod_bundle_01', slug: 'complete-routine-bundle',
    title: 'Complete Routine Bundle',
    description: 'Get both the Stemuvita™ Hair Cleanse and Scalp Serum at a bundled price. The complete system for maximum follicle regeneration.',
    vendor: 'CELLAVIVA Labs', productType: 'Bundle',
    tags: ['bundle', 'bestseller', 'value', 'complete-routine'],
    status: 'DRAFT', featured: false, price: 180, salePrice: 79, stock: 0,
    sku: 'CV-BDL-001', barcode: '5901234123471', weight: 0.5, weightUnit: 'kg', trackInventory: false,
    seoTitle: 'Complete Routine Bundle – Hair Cleanse + Scalp Serum | CELLAVIVA',
    seoDescription: 'The complete CELLAVIVA system. Get both products bundled together at the best price.',
    images: [], variants: [],
    createdAt: '2026-05-01T00:00:00Z', updatedAt: '2026-05-22T09:15:00Z',
  },
]

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-400',
  DRAFT: 'bg-amber-500/15 text-amber-400',
  ARCHIVED: 'bg-white/8 text-white/40',
}
const STATUS_ICON: Record<string, React.ElementType> = {
  ACTIVE: Eye, DRAFT: Edit2, ARCHIVED: Archive,
}

const EMPTY_PRODUCT: ProductFull = {
  id: '', slug: '', title: '', description: '', vendor: 'CELLAVIVA Labs', productType: '',
  tags: [], status: 'DRAFT', featured: false, price: 0, salePrice: null, stock: 0,
  sku: '', barcode: '', weight: 0, weightUnit: 'kg', trackInventory: true,
  seoTitle: '', seoDescription: '', images: [], variants: [],
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}

const CARD = 'bg-[#13161f] border border-white/5 rounded-2xl'
const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80] transition-colors'

function dbToAdmin(p: any): ProductFull {
  let status: ProductFull['status'] = 'ARCHIVED'
  if (p.active) status = 'ACTIVE'
  else if (p.comingSoon) status = 'DRAFT'
  return {
    id: p.id, slug: p.slug, title: p.title, description: p.description,
    vendor: 'CELLAVIVA Labs', productType: '', tags: [],
    status, featured: p.featured,
    price: p.price, salePrice: p.salePrice ?? null, stock: p.stock,
    sku: '', barcode: '', weight: 0, weightUnit: 'kg', trackInventory: true,
    seoTitle: '', seoDescription: '', images: p.images ?? [],
    variants: [], createdAt: p.createdAt, updatedAt: p.updatedAt,
  }
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<ProductFull[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [uploadingImg, setUploadingImg] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) setProducts(data.map(dbToAdmin))
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false))
  }, [])

  async function handleImageUpload(files: FileList | null) {
    if (!files || !editProduct) return
    setUploadingImg(true)
    try {
      const uploads = Array.from(files).map(async file => {
        const form = new FormData(); form.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
        if (!res.ok) throw new Error('Upload failed')
        const { url } = await res.json()
        return url as string
      })
      const urls = await Promise.all(uploads)
      setEditProduct(prev => prev ? { ...prev, images: [...(prev.images || []), ...urls] } : prev)
    } catch { alert('Upload failed') }
    finally { setUploadingImg(false) }
  }

  function removeImage(idx: number) {
    if (!editProduct) return
    setEditProduct({ ...editProduct, images: editProduct.images.filter((_, i) => i !== idx) })
  }
  const [editProduct, setEditProduct] = useState<ProductFull | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [activeTab, setActiveTab] = useState<'general' | 'images' | 'inventory' | 'variants' | 'seo'>('general')

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (statusFilter === 'ALL' || p.status === statusFilter)
  })

  function toggleSelect(id: string) {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }
  function toggleSelectAll() {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)))
  }
  function openNew() {
    setEditProduct({ ...EMPTY_PRODUCT, id: `prod_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    setIsNew(true); setActiveTab('general'); setTagInput('')
  }
  function openEdit(p: ProductFull) {
    setEditProduct({ ...p }); setIsNew(false); setActiveTab('general'); setTagInput('')
  }
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function closeEditor() { setEditProduct(null); setIsNew(false); setSaveError('') }

  async function saveProduct() {
    if (!editProduct) return
    setSaving(true); setSaveError('')
    const payload = {
      title:       editProduct.title,
      description: editProduct.description,
      price:       editProduct.price,
      salePrice:   editProduct.salePrice,
      stock:       editProduct.stock,
      images:      editProduct.images,
      featured:    editProduct.featured,
      status:      editProduct.status,
      comingSoon:  editProduct.status === 'DRAFT',
    }
    try {
      if (isNew) {
        const res = await fetch('/api/admin/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save')
        const created = await res.json()
        setProducts(prev => [dbToAdmin(created), ...prev])
      } else {
        const res = await fetch(`/api/admin/products/${editProduct.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to save')
        const updated = await res.json()
        setProducts(prev => prev.map(p => p.id === editProduct.id ? dbToAdmin(updated) : p))
      }
      closeEditor()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  async function bulkArchive() {
    await Promise.all([...selected].map(id =>
      fetch(`/api/admin/products/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })
    ))
    setProducts(prev => prev.map(p => selected.has(p.id) ? { ...p, status: 'ARCHIVED' as const } : p))
    setSelected(new Set())
  }
  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim() && editProduct) {
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!editProduct.tags.includes(tag)) setEditProduct({ ...editProduct, tags: [...editProduct.tags, tag] })
      setTagInput('')
    }
  }
  function removeTag(tag: string) {
    if (!editProduct) return
    setEditProduct({ ...editProduct, tags: editProduct.tags.filter((t) => t !== tag) })
  }

  const ep = editProduct

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-white/40 mt-0.5 text-sm">{products.length} products · {products.filter((p) => p.status === 'ACTIVE').length} active</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#0b0d13] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU, vendor…"
              className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl focus:outline-none focus:border-[#4ade80] w-72 transition-colors" />
          </div>
          <div className="flex rounded-xl border border-white/10 overflow-hidden text-sm">
            {['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 font-medium transition-colors ${statusFilter === s ? 'bg-[#4ade80] text-[#0b0d13]' : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}>
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-xl px-4 py-2 text-sm">
            <span className="font-semibold text-[#4ade80]">{selected.size} selected</span>
            <button onClick={bulkArchive} className="text-[#4ade80]/70 hover:text-[#4ade80] font-medium ml-2">Archive</button>
            <button onClick={() => setSelected(new Set())} className="text-white/30 hover:text-white/60 ml-1"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className={`${CARD} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/3">
              <th className="px-5 py-3.5 text-left w-10">
                <input type="checkbox" className="rounded accent-[#4ade80]" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} />
              </th>
              {['Product', 'Status', 'Vendor / Type', 'SKU', 'Inventory', 'Price', 'Updated', ''].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => {
              const SI = STATUS_ICON[p.status]
              return (
                <tr key={p.id} className={`transition-colors ${selected.has(p.id) ? 'bg-[#4ade80]/5' : 'hover:bg-white/3'}`}>
                  <td className="px-5 py-4">
                    <input type="checkbox" className="rounded accent-[#4ade80]" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-white/10" />
                        : <div className="w-10 h-10 bg-[#4ade80]/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🌿</div>
                      }
                      <div>
                        <p className="font-semibold text-white line-clamp-1">{p.title}</p>
                        <p className="text-xs text-white/30">{p.tags.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[p.status]}`}>
                      <SI className="w-3 h-3" />
                      {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/40">
                    <p className="font-medium text-white/60">{p.vendor}</p>
                    <p>{p.productType}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-white/30">{p.sku || '—'}</td>
                  <td className="px-5 py-4">
                    {p.trackInventory ? (
                      <span className={`font-semibold text-sm ${p.stock === 0 ? 'text-red-400' : p.stock < 20 ? 'text-amber-400' : 'text-white/70'}`}>
                        {p.stock === 0 ? (
                          <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Out of stock</span>
                        ) : `${p.stock} in stock`}
                      </span>
                    ) : (
                      <span className="text-white/30 text-xs">Not tracked</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {p.salePrice ? (
                      <div>
                        <p className="font-bold text-[#4ade80]">€{p.salePrice}</p>
                        <p className="text-xs text-white/30 line-through">€{p.price}</p>
                      </div>
                    ) : (
                      <p className="font-semibold text-white/70">€{p.price}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-white/30">
                    {new Date(p.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-white/30 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {loadingProducts && (
              <tr><td colSpan={9} className="px-5 py-16 text-center text-white/30"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
            )}
            {!loadingProducts && filtered.length === 0 && (
              <tr><td colSpan={9} className="px-5 py-16 text-center text-white/30">No products match your filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Drawer */}
      {ep && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={closeEditor} />
          <div className="w-[680px] max-w-full bg-[#0f1117] border-l border-white/5 shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{isNew ? 'Add Product' : 'Edit Product'}</h2>
              <div className="flex items-center gap-3">
                <select value={ep.status}
                  onChange={(e) => setEditProduct({ ...ep, status: e.target.value as ProductFull['status'] })}
                  className="text-xs bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#4ade80]">
                  <option value="ACTIVE" className="bg-[#13161f]">Active</option>
                  <option value="DRAFT" className="bg-[#13161f]">Draft</option>
                  <option value="ARCHIVED" className="bg-[#13161f]">Archived</option>
                </select>
                <button onClick={closeEditor} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-6">
              {(['general', 'images', 'inventory', 'variants', 'seo'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-[#4ade80] text-[#4ade80]' : 'border-transparent text-white/30 hover:text-white/60'}`}>
                  {tab === 'images'
                    ? <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" />Images {ep.images?.length ? <span className="bg-[#4ade80]/20 text-[#4ade80] text-xs px-1.5 rounded-full">{ep.images.length}</span> : null}</span>
                    : tab}
                </button>
              ))}
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === 'general' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Title *</label>
                    <input value={ep.title} onChange={(e) => setEditProduct({ ...ep, title: e.target.value })}
                      className={INPUT} placeholder="Product title" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Description</label>
                    <textarea value={ep.description} onChange={(e) => setEditProduct({ ...ep, description: e.target.value })} rows={4}
                      className={`${INPUT} resize-none`} placeholder="Product description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Price (€)</label>
                      <input type="number" value={ep.price} onChange={(e) => setEditProduct({ ...ep, price: Number(e.target.value) })} className={INPUT} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Compare-at Price (€)</label>
                      <input type="number" value={ep.salePrice ?? ''} onChange={(e) => setEditProduct({ ...ep, salePrice: e.target.value ? Number(e.target.value) : null })}
                        className={INPUT} placeholder="Optional" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Vendor</label>
                      <input value={ep.vendor} onChange={(e) => setEditProduct({ ...ep, vendor: e.target.value })} className={INPUT} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Product Type</label>
                      <input value={ep.productType} onChange={(e) => setEditProduct({ ...ep, productType: e.target.value })} className={INPUT} placeholder="e.g. Shampoo, Serum" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {ep.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 bg-[#4ade80]/10 text-[#4ade80] text-xs font-semibold px-2.5 py-1 rounded-full">
                          {tag}
                          <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag}
                      className={INPUT} placeholder="Type tag and press Enter" />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/8 hover:border-white/15 transition-colors">
                    <input type="checkbox" checked={ep.featured} onChange={(e) => setEditProduct({ ...ep, featured: e.target.checked })} className="rounded accent-[#4ade80]" />
                    <div>
                      <p className="text-sm font-semibold text-white/70">Featured product</p>
                      <p className="text-xs text-white/30">Show on homepage and featured sections</p>
                    </div>
                    {ep.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400 ml-auto" />}
                  </label>
                </>
              )}

              {/* ── Images Tab ── */}
              {activeTab === 'images' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-3">Product Images</label>

                    {/* Image grid */}
                    {(ep.images || []).length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {ep.images.map((url, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square">
                            <img src={url} alt={`Product ${idx+1}`} className="w-full h-full object-cover" />
                            {/* Main badge */}
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 bg-[#4ade80] text-[#0b0d13] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Main
                              </span>
                            )}
                            {/* Remove button */}
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                            {/* Move to main */}
                            {idx > 0 && (
                              <button
                                onClick={() => {
                                  const imgs = [...ep.images]
                                  imgs.splice(idx, 1)
                                  setEditProduct({ ...ep, images: [url, ...imgs] })
                                }}
                                className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Set main
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload drop zone */}
                    <label
                      className="flex flex-col items-center justify-center gap-3 w-full py-8 rounded-2xl border-2 border-dashed border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5 cursor-pointer transition-all"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); handleImageUpload(e.dataTransfer.files) }}
                    >
                      {uploadingImg ? (
                        <>
                          <Loader2 className="w-6 h-6 text-[#4ade80] animate-spin" />
                          <span className="text-sm text-white/50">Uploading…</span>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-white/30" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-white/70">Click to upload or drag & drop</p>
                            <p className="text-xs text-white/30 mt-1">JPG, PNG, WebP — auto-compressed • Multiple files OK</p>
                          </div>
                        </>
                      )}
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploadingImg}
                        onChange={e => handleImageUpload(e.target.files)}
                      />
                    </label>

                    {(ep.images || []).length > 0 && (
                      <p className="text-xs text-white/30 mt-2">
                        First image is the main product image. Hover to remove or set as main.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'inventory' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">SKU</label>
                      <input value={ep.sku} onChange={(e) => setEditProduct({ ...ep, sku: e.target.value })}
                        className={`${INPUT} font-mono`} placeholder="CV-XXX-001" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Barcode (EAN / UPC)</label>
                      <input value={ep.barcode} onChange={(e) => setEditProduct({ ...ep, barcode: e.target.value })}
                        className={`${INPUT} font-mono`} />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-white/8 rounded-xl hover:border-white/15 transition-colors">
                    <input type="checkbox" checked={ep.trackInventory} onChange={(e) => setEditProduct({ ...ep, trackInventory: e.target.checked })} className="rounded accent-[#4ade80]" />
                    <div>
                      <p className="text-sm font-semibold text-white/70">Track quantity</p>
                      <p className="text-xs text-white/30">Prevent sales when stock reaches zero</p>
                    </div>
                  </label>
                  {ep.trackInventory && (
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Available quantity</label>
                      <input type="number" value={ep.stock} onChange={(e) => setEditProduct({ ...ep, stock: Number(e.target.value) })} className={INPUT} />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Weight</label>
                      <input type="number" step="0.01" value={ep.weight} onChange={(e) => setEditProduct({ ...ep, weight: Number(e.target.value) })} className={INPUT} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5">Unit</label>
                      <select value={ep.weightUnit} onChange={(e) => setEditProduct({ ...ep, weightUnit: e.target.value as ProductFull['weightUnit'] })}
                        className={INPUT}>
                        {['kg', 'g', 'lb', 'oz'].map((u) => <option key={u} value={u} className="bg-[#13161f]">{u}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'variants' && (
                <div className="space-y-4">
                  <p className="text-sm text-white/40">Variants let you offer the product in different sizes, colours, or scents.</p>
                  {ep.variants.map((v, i) => (
                    <div key={v.id} className="border border-white/8 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white/60">Variant {i + 1}</p>
                        <button onClick={() => setEditProduct({ ...ep, variants: ep.variants.filter((_, j) => j !== i) })}
                          className="p-1 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Title', key: 'title' as const, type: 'text' },
                          { label: 'SKU', key: 'sku' as const, type: 'text' },
                          { label: 'Price (€)', key: 'price' as const, type: 'number' },
                          { label: 'Stock', key: 'stock' as const, type: 'number' },
                        ].map(({ label, key, type }) => (
                          <div key={key}>
                            <label className="text-xs font-medium text-white/40 mb-1 block">{label}</label>
                            <input type={type} value={v[key]} onChange={(e) => {
                              const vars = [...ep.variants]
                              vars[i] = { ...v, [key]: type === 'number' ? Number(e.target.value) : e.target.value }
                              setEditProduct({ ...ep, variants: vars })
                            }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4ade80] transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditProduct({ ...ep, variants: [...ep.variants, { id: `var_${Date.now()}`, title: '', sku: '', barcode: '', price: ep.price, comparePrice: ep.salePrice ?? 0, stock: 0, weight: ep.weight }] })}
                    className="w-full border-2 border-dashed border-white/10 rounded-xl py-3 text-sm text-white/30 hover:border-[#4ade80]/50 hover:text-[#4ade80] flex items-center justify-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Add variant
                  </button>
                </div>
              )}

              {activeTab === 'seo' && (
                <>
                  <div className="bg-white/4 border border-white/8 rounded-xl p-4 mb-2">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Search engine preview</p>
                    <p className="text-blue-400 font-medium text-sm truncate">{ep.seoTitle || ep.title || 'Product title'} | CELLAVIVA</p>
                    <p className="text-emerald-500 text-xs mt-0.5">cellaviva.com/products/{ep.slug || 'product-slug'}</p>
                    <p className="text-white/40 text-xs mt-1 line-clamp-2">{ep.seoDescription || ep.description || 'Product description will appear here.'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Page title</label>
                    <input value={ep.seoTitle} onChange={(e) => setEditProduct({ ...ep, seoTitle: e.target.value })}
                      className={INPUT} placeholder={ep.title} />
                    <p className="text-xs text-white/25 mt-1">{ep.seoTitle.length}/70 characters</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">Meta description</label>
                    <textarea value={ep.seoDescription} onChange={(e) => setEditProduct({ ...ep, seoDescription: e.target.value })} rows={3}
                      className={`${INPUT} resize-none`} />
                    <p className="text-xs text-white/25 mt-1">{ep.seoDescription.length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 mb-1.5">URL handle</label>
                    <div className="flex">
                      <span className="flex items-center px-3 border border-r-0 border-white/10 rounded-l-xl text-xs text-white/30 bg-white/5">/products/</span>
                      <input value={ep.slug} onChange={(e) => setEditProduct({ ...ep, slug: e.target.value })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-r-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#4ade80] transition-colors" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
              {saveError && <p className="text-xs text-red-400 flex-1">{saveError}</p>}
              <button onClick={closeEditor} className="px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors">
                Discard
              </button>
              <button onClick={saveProduct} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 text-[#0b0d13] text-sm font-semibold transition-colors flex items-center gap-2">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isNew ? 'Create product' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
