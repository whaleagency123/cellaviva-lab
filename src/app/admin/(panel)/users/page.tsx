'use client'
import { useState, useEffect } from 'react'
import {
  Shield, Plus, Trash2, Pencil, X, Check,
  Eye, EyeOff, Save, Loader2, Key, User, Mail,
} from 'lucide-react'
import { PERMISSION_KEYS, PERMISSION_LABELS } from '@/lib/permissions-shared'
import type { Permission } from '@/lib/permissions-shared'

interface AdminUser {
  id: string
  username: string
  email: string
  role: string
  permissions: string
  createdAt: string
}

const CARD  = 'bg-[#13161f] border border-white/5 rounded-2xl'
const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/50 transition-colors'

const PERM_GROUPS: { label: string; items: Permission[] }[] = [
  { label: 'Store',     items: ['dashboard', 'orders', 'products', 'customers', 'subscriptions', 'returns'] },
  { label: 'Marketing', items: ['discounts', 'reviews', 'channels', 'analytics', 'blog'] },
  { label: 'Design',    items: ['builder', 'settings', 'plugins'] },
  { label: 'Finance',   items: ['payments'] },
  { label: 'Admin',     items: ['users'] },
]

export default function UsersPage() {
  const [users, setUsers]           = useState<AdminUser[]>([])
  const [loading, setLoading]       = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editId, setEditId]         = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null)
  const [showPw, setShowPw]         = useState(false)
  const [myRole, setMyRole]         = useState<string>('')

  const [form, setForm] = useState({
    username: '', email: '', password: '',
    role: 'admin', permissions: [] as Permission[],
  })
  const [editPerms, setEditPerms]     = useState<Permission[]>([])
  const [newPassword, setNewPassword] = useState('')

  function msg(text: string, ok = true) {
    setToast({ msg: text, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    setLoading(true)
    const [ur, mr] = await Promise.all([fetch('/api/admin/users'), fetch('/api/admin/me')])
    if (ur.ok) setUsers(await ur.json())
    if (mr.ok) { const me = await mr.json(); setMyRole(me.role) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function parsePerms(raw: string): Permission[] {
    try { return JSON.parse(raw) } catch { return [] }
  }

  function togglePerm(perm: Permission, list: Permission[], set: (p: Permission[]) => void) {
    set(list.includes(perm) ? list.filter(p => p !== perm) : [...list, perm])
  }

  function selectAll(items: Permission[], list: Permission[], set: (p: Permission[]) => void) {
    const allIn = items.every(p => list.includes(p))
    set(allIn ? list.filter(p => !items.includes(p)) : [...new Set([...list, ...items])])
  }

  async function createUser() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) { msg(d.error ?? 'Failed', false); return }
      msg(`${d.username} created!`)
      setShowCreate(false)
      setForm({ username: '', email: '', password: '', role: 'admin', permissions: [] })
      load()
    } finally { setSaving(false) }
  }

  async function savePermissions(id: string) {
    setSaving(true)
    try {
      const body: Record<string, unknown> = { permissions: editPerms }
      if (newPassword) body.password = newPassword
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (res.ok) { msg('Saved!'); setEditId(null); setNewPassword(''); load() }
      else { const d = await res.json(); msg(d.error ?? 'Failed', false) }
    } finally { setSaving(false) }
  }

  async function removeUser(id: string, name: string) {
    if (!confirm(`Delete admin "${name}"? Cannot be undone.`)) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) { msg(`${name} deleted`); load() }
    else { const d = await res.json(); msg(d.error ?? 'Failed', false) }
  }

  // Permission checkbox group
  function PermGroup({ label, items, list, setList }: {
    label: string; items: Permission[]; list: Permission[]; setList: (p: Permission[]) => void
  }) {
    const allIn = items.every(p => list.includes(p))
    return (
      <div className="bg-white/3 rounded-xl p-4 border border-white/6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{label}</p>
          <button onClick={() => selectAll(items, list, setList)}
            className="text-[10px] text-[#4ade80]/60 hover:text-[#4ade80] transition-colors">
            {allIn ? 'None' : 'All'}
          </button>
        </div>
        <div className="space-y-2">
          {items.map(perm => (
            <label key={perm} className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => togglePerm(perm, list, setList)}>
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${list.includes(perm) ? 'bg-[#4ade80] border-[#4ade80]' : 'border-white/20 hover:border-[#4ade80]/50'}`}>
                {list.includes(perm) && <Check className="w-3 h-3 text-[#0b0d13]" />}
              </div>
              <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                {PERMISSION_LABELS[perm]}
              </span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  if (myRole && myRole !== 'super_admin') {
    return (
      <div className="p-8 min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Super admin access required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 min-h-screen bg-[#0f1117]">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold pointer-events-none ${toast.ok ? 'bg-[#0b0d13] border border-[#4ade80]/40 text-white' : 'bg-red-950 border border-red-500/40 text-red-300'}`}>
          {toast.ok ? <Check className="w-4 h-4 text-[#4ade80]" /> : <X className="w-4 h-4 text-red-400" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#4ade80]" /> Admin Users
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Create accounts and assign specific permissions for each admin.</p>
        </div>
        <button onClick={() => setShowCreate(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4ade80] text-[#0b0d13] rounded-xl text-sm font-bold hover:bg-[#22c55e] transition-colors">
          <Plus className="w-4 h-4" /> Add Admin User
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className={`${CARD} p-6`}>
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#4ade80]" /> New Admin User
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="e.g. sarah_editor" className={`${INPUT} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@example.com" className={`${INPUT} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 characters" className={`${INPUT} pl-9 pr-10`} />
                <button onClick={() => setShowPw(s => !s)} type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={INPUT}>
                <option value="admin">Admin — limited by permissions below</option>
                <option value="super_admin">Super Admin — full access to everything</option>
              </select>
            </div>
          </div>

          {form.role !== 'super_admin' && (
            <div className="mb-6">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Page &amp; Feature Access
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {PERM_GROUPS.map(g => (
                  <PermGroup key={g.label} label={g.label} items={g.items}
                    list={form.permissions}
                    setList={p => setForm(f => ({ ...f, permissions: p }))} />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={createUser} disabled={saving || !form.username || !form.email || !form.password}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4ade80] text-[#0b0d13] rounded-xl text-sm font-bold hover:bg-[#22c55e] disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create User
            </button>
            <button onClick={() => setShowCreate(false)}
              className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white rounded-xl text-sm font-semibold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className={CARD}>
        {loading ? (
          <div className="p-8 flex items-center justify-center gap-2 text-white/30">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map(user => {
              const isEditing = editId === user.id
              const perms     = parsePerms(user.permissions)

              return (
                <div key={user.id}>
                  {/* Row */}
                  <div className="px-6 py-4 flex items-center gap-4 flex-wrap">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4ade80] to-[#16a34a] flex items-center justify-center text-[#0b0d13] font-black text-xs flex-shrink-0">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-white">{user.username}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${user.role === 'super_admin' ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-white/8 text-white/40'}`}>
                          {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </div>
                      <p className="text-xs text-white/35">{user.email}</p>
                    </div>

                    {/* Permission preview */}
                    {user.role !== 'super_admin' && (
                      <div className="hidden md:flex flex-wrap gap-1">
                        {perms.length === 0
                          ? <span className="text-xs text-white/20 italic">No access</span>
                          : perms.slice(0, 3).map(p => (
                            <span key={p} className="text-[10px] bg-white/6 text-white/40 px-2 py-0.5 rounded-full">
                              {PERMISSION_LABELS[p]?.split(' ')[0]}
                            </span>
                          ))}
                        {perms.length > 3 && <span className="text-[10px] text-white/25">+{perms.length - 3}</span>}
                      </div>
                    )}
                    {user.role === 'super_admin' && (
                      <span className="hidden md:inline text-[10px] text-[#4ade80]/50 italic">All permissions</span>
                    )}

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {user.role !== 'super_admin' && (
                        <button
                          onClick={() => { setEditId(isEditing ? null : user.id); setEditPerms(perms); setNewPassword('') }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${isEditing ? 'bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/30' : 'text-white/40 border-white/10 hover:border-white/25 hover:text-white'}`}>
                          <Pencil className="w-3.5 h-3.5" />
                          {isEditing ? 'Editing…' : 'Edit'}
                        </button>
                      )}
                      <button onClick={() => removeUser(user.id, user.username)}
                        className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Edit permissions panel */}
                  {isEditing && (
                    <div className="px-6 pb-6 bg-white/2 border-t border-white/5">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-wider mt-5 mb-4 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Edit permissions for <span className="text-white/70 normal-case font-bold">{user.username}</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
                        {PERM_GROUPS.map(g => (
                          <PermGroup key={g.label} label={g.label} items={g.items}
                            list={editPerms} setList={setEditPerms} />
                        ))}
                      </div>

                      <div className="mb-5 max-w-sm">
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                          Reset Password <span className="text-white/20 normal-case font-normal">(leave blank to keep current)</span>
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input type="password" value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="New password" className={`${INPUT} pl-9`} />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => savePermissions(user.id)} disabled={saving}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#4ade80] text-[#0b0d13] rounded-xl text-sm font-bold hover:bg-[#22c55e] disabled:opacity-50 transition-colors">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Changes
                        </button>
                        <button onClick={() => { setEditId(null); setNewPassword('') }}
                          className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white rounded-xl text-sm font-semibold transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
