"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ClipboardList, Plus } from "lucide-react"
import type { AdminRole, PermissionKey } from "@/generated/prisma/client"
import type { AdminUser } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { LeadsTable } from "./leads-table"
import { LeadFormDialog } from "./lead-form-dialog"
import { LeadStatusDialog } from "./lead-status-dialog"
import { LeadActionDialog } from "./lead-action-dialog"
import { LeadTimelineDialog } from "./lead-timeline-dialog"
import {
  assignLeadAction,
  deleteLeadAction,
  updateLeadStatusAction,
} from "@/actions/admin/leads"
import type { LeadStatus } from "@/lib/validations/admin-lead"

export type LeadActionRow = {
  id: string
  actionType: string
  outcome: string
  note: string
  createdAt: string
}

export type LeadRowData = {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: string
  rewardValue: number | null
  source: string
  assignedToId: string
  assignedToName: string
  createdAt: string
  updatedAt: string
  recentActions: LeadActionRow[]
}

export type AdminOption = {
  id: string
  name: string
  email: string
  role: AdminRole | string
}

type LeadsClientProps = {
  leads: LeadRowData[]
  admins: AdminOption[]
  currentAdmin: AdminUser
}

function can(admin: AdminUser, permission: PermissionKey) {
  if (admin.role === "SUPER_ADMIN") return true
  return admin.permissions?.includes(permission) ?? false
}

export function LeadsClient({ leads, admins, currentAdmin }: LeadsClientProps) {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<LeadRowData | null>(null)
  const [statusLead, setStatusLead] = useState<LeadRowData | null>(null)
  const [actionLead, setActionLead] = useState<LeadRowData | null>(null)
  const [timelineLead, setTimelineLead] = useState<LeadRowData | null>(null)
  const [isPending, startTransition] = useTransition()

  const permissions = {
    canCreate: can(currentAdmin, "CREATE_LEAD"),
    canEdit: can(currentAdmin, "EDIT_LEAD"),
    canDelete: can(currentAdmin, "DELETE_LEAD"),
    canAssign: can(currentAdmin, "ASSIGN_LEAD"),
    canExport: can(currentAdmin, "EXPORT_LEADS"),
  }

  function handleDelete(lead: LeadRowData) {
    if (!window.confirm(`Delete lead for ${lead.name}?`)) return

    startTransition(async () => {
      const res = await deleteLeadAction(lead.id)
      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      router.refresh()
    })
  }

  function handleAssign(lead: LeadRowData, assignedToId: string) {
    startTransition(async () => {
      const res = await assignLeadAction(lead.id, { assignedToId })
      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      router.refresh()
    })
  }

  function handleQuickStatus(lead: LeadRowData, status: LeadStatus) {
    startTransition(async () => {
      const res = await updateLeadStatusAction(lead.id, { status })
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
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Leads
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage {leads.length} leads, follow-ups, status, and assignments.
            </p>
          </div>
        </div>

        {permissions.canCreate && (
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Lead
          </Button>
        )}
      </div>

      <div className="px-4 lg:px-8">
        <LeadsTable
          leads={leads}
          admins={admins}
          permissions={permissions}
          disabled={isPending}
          onEdit={setEditingLead}
          onDelete={handleDelete}
          onStatus={setStatusLead}
          onAction={setActionLead}
          onTimeline={setTimelineLead}
          onAssign={handleAssign}
          onQuickStatus={handleQuickStatus}
        />
      </div>

      <LeadFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        admins={admins}
        mode="create"
      />

      <LeadFormDialog
        open={!!editingLead}
        onOpenChange={(open) => !open && setEditingLead(null)}
        admins={admins}
        mode="edit"
        lead={editingLead}
      />

      <LeadStatusDialog
        lead={statusLead}
        open={!!statusLead}
        onOpenChange={(open) => !open && setStatusLead(null)}
      />

      <LeadActionDialog
        lead={actionLead}
        open={!!actionLead}
        onOpenChange={(open) => !open && setActionLead(null)}
      />

      <LeadTimelineDialog
        lead={timelineLead}
        open={!!timelineLead}
        onOpenChange={(open) => !open && setTimelineLead(null)}
      />
    </div>
  )
}
