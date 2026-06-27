import { requireAdmin } from "@/lib/admin/auth"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AdminShell } from "@/components/admin/admin-shell"
import { SidebarConfigProvider } from "@/contexts/sidebar-context"
import { Toaster } from "sonner"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await requireAdmin()

  const currentAdmin = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  }

  return (
    <TooltipProvider>
      <SidebarConfigProvider>
        <AdminShell admin={currentAdmin}>{children}</AdminShell>
        <Toaster />
      </SidebarConfigProvider>
    </TooltipProvider>
  )
}
