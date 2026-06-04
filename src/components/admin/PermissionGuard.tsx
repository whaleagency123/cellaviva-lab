import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import type { Permission } from '@/lib/permissions'
import { Shield } from 'lucide-react'

interface Props {
  permission: Permission
  children: React.ReactNode
}

export async function PermissionGuard({ permission, children }: Props) {
  const allowed = await hasPermission(permission)
  if (!allowed) {
    return (
      <div className="p-8 min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/40 text-sm">
            You don&apos;t have permission to view this page.
            Contact your super admin to request access.
          </p>
        </div>
      </div>
    )
  }
  return <>{children}</>
}
