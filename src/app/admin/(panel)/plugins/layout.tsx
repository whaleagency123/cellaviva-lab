import { PermissionGuard } from '@/components/admin/PermissionGuard'
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PermissionGuard permission="plugins">{children}</PermissionGuard>
}
