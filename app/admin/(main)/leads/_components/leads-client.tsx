"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ClipboardList, Plus, Import as ImportIcon, Tag } from "lucide-react"
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
import { LeadReassignDialog } from "./lead-reassign-dialog"
import { LeadCategoryDialog } from "./lead-category-dialog"
import { LeadImportDialog } from "./lead-import-dialog"
import { assignLeadCategoryAction } from "@/actions/admin/lead-categories"

export type LeadCategoryOption = {
  id: string
  name: string
  color: string | null
}

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
  categoryId: string
  categoryName: string
  categoryColor: string | null
  reassignmentCount: number
  reassignmentBucket: string
  lastReassignedFromName: string
  lastReassignedToName: string
  lastReassignedAt: string
  lastNote: string
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
  categories: LeadCategoryOption[]
}

function can(admin: AdminUser, permission: PermissionKey) {
  if (admin.role === "SUPER_ADMIN") return true
  return admin.permissions?.includes(permission) ?? false
}

export function LeadsClient({
  leads,
  admins,
  categories,
  currentAdmin,
}: LeadsClientProps) {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<LeadRowData | null>(null)
  const [statusLead, setStatusLead] = useState<LeadRowData | null>(null)
  const [actionLead, setActionLead] = useState<LeadRowData | null>(null)
  const [timelineLead, setTimelineLead] = useState<LeadRowData | null>(null)
  const [reassignLead, setReassignLead] = useState<LeadRowData | null>(null)
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  function handleCategoryChange(lead: LeadRowData, categoryId: string) {
    startTransition(async () => {
      const res = await assignLeadCategoryAction(lead.id, categoryId || null)
      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      router.refresh()
    })
  }

  const [isPending, startTransition] = useTransition()

  const permissions = {
    canCreate: can(currentAdmin, "CREATE_LEAD"),
    canEdit: can(currentAdmin, "EDIT_LEAD"),
    canManageCategories: can(currentAdmin, "MANAGE_LEAD_CATEGORIES"),
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
        <div className="flex items-center gap-2">
          {permissions.canManageCategories && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsCategoryManagerOpen(true)}
            >
              <Tag className="h-4 w-4" /> Categories
            </Button>
          )}
          {permissions.canCreate && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsImportOpen(true)}
            >
              <ImportIcon className="h-4 w-4" /> Import
            </Button>
          )}
          {permissions.canCreate && (
            <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" /> Create Lead
            </Button>
          )}
        </div>

        {/* {permissions.canCreate && (
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Lead
          </Button>
        )} */}
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
          onReassign={setReassignLead}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />
      </div>

      <LeadFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        admins={admins}
        mode="create"
        categories={categories}
      />

      <LeadFormDialog
        open={!!editingLead}
        onOpenChange={(open) => !open && setEditingLead(null)}
        admins={admins}
        mode="edit"
        categories={categories}
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
      <LeadReassignDialog
        lead={reassignLead}
        admins={admins}
        open={!!reassignLead}
        onOpenChange={(open) => !open && setReassignLead(null)}
      />
      <LeadCategoryDialog
        open={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
        categories={categories}
      />

      <LeadImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
    </div>
  )
}
