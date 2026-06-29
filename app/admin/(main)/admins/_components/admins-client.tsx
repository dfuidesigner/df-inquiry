"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShieldCheck, UserPlus } from "lucide-react"
import type { AdminRole, PermissionKey } from "@/generated/prisma/client"
import type { AdminUser } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { deleteAdminAction } from "@/actions/admin/admin"
import { AdminFormDialog } from "./admin-form-dialog"
import { AdminsTable } from "./admins-table"

export type AdminRowData = {
  id: string
  name: string
  email: string
  role: AdminRole | string
  isActive: boolean
  permissions: PermissionKey[]
  assignedLeadCount: number
  createdAt: string
}

type AdminsClientProps = {
  admins: AdminRowData[]
  currentAdmin: AdminUser
}

function can(admin: AdminUser, permission: PermissionKey) {
  if (admin.role === "SUPER_ADMIN") return true
  return admin.permissions?.includes(permission) ?? false
}

export function AdminsClient({ admins, currentAdmin }: AdminsClientProps) {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminRowData | null>(null)
  const [isPending, startTransition] = useTransition()

  const permissions = {
    canCreate: can(currentAdmin, "CREATE_ADMIN"),
    canEdit: can(currentAdmin, "EDIT_ADMIN"),
    canDelete: can(currentAdmin, "DELETE_ADMIN"),
  }

  function handleDelete(admin: AdminRowData) {
    if (!window.confirm(`Delete admin ${admin.name}? Assigned leads will become unassigned.`)) return

    startTransition(async () => {
      const res = await deleteAdminAction(admin.id)
      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pt-4 pb-6 sm:flex-row sm:items-center lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admins
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage admin users, permissions, and lead access.
            </p>
          </div>
        </div>

        {permissions.canCreate && (
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Create Admin
          </Button>
        )}
      </div>

      <div className="px-4 lg:px-8">
        <AdminsTable
          admins={admins}
          currentAdminId={currentAdmin.id}
          permissions={permissions}
          disabled={isPending}
          onEdit={setEditingAdmin}
          onDelete={handleDelete}
        />
      </div>

      <AdminFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        currentAdmin={currentAdmin}
      />

      <AdminFormDialog
        open={!!editingAdmin}
        onOpenChange={(open) => !open && setEditingAdmin(null)}
        mode="edit"
        admin={editingAdmin}
        currentAdmin={currentAdmin}
      />
    </div>
  )
}
