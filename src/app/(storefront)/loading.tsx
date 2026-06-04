export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--sf-bg, #f8f9f4)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--sf-primary, #2d5a27)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--sf-text-muted, #6b7280)' }}>Loading…</p>
      </div>
    </div>
  )
}
