"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Building2, Import as ImportIcon, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ProspectsTable } from "./prospects-table"
import { ProspectCategoryDialog } from "./prospect-category-dialog"
import { ProspectImportDialog } from "./prospect-import-dialog"
import { ConvertToLeadDialog } from "./convert-to-lead-dialog"
import {
  assignProspectCategoryAction,
  deleteManyProspectsAction,
  deleteProspectAction,
} from "@/actions/admin/prospects"

export type ProspectCategoryOption = {
  id: string
  name: string
  color: string | null
}

export type ProspectRowData = {
  id: string
  name: string
  email: string
  phone: string
  categoryId: string
  categoryName: string
  categoryColor: string | null
  note: string
  source: string
  isConverted: boolean
  convertedLeadId: string
  convertedLeadName: string
  convertedByName: string
  convertedAt: string
  importedByName: string
  createdAt: string
  updatedAt: string
}

type AdminOption = { id: string; name: string }

type ProspectsClientProps = {
  prospects: ProspectRowData[]
  categories: ProspectCategoryOption[]
  admins: AdminOption[]
  canManage: boolean
  canAssignOnConvert: boolean
}

export function ProspectsClient({
  prospects,
  categories,
  admins,
  canManage,
  canAssignOnConvert,
}: ProspectsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [convertTarget, setConvertTarget] = useState<ProspectRowData | null>(
    null
  )
  const [deleteTarget, setDeleteTarget] = useState<ProspectRowData | null>(null)
  const [bulkDeleteState, setBulkDeleteState] = useState<{
    ids: string[]
    clearSelection: () => void
  } | null>(null)

  function handleCategoryChange(prospect: ProspectRowData, categoryId: string) {
    startTransition(async () => {
      const res = await assignProspectCategoryAction(
        prospect.id,
        categoryId || null
      )
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      router.refresh()
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await deleteProspectAction(deleteTarget.id)
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      setDeleteTarget(null)
      router.refresh()
    })
  }

  function confirmBulkDelete() {
    if (!bulkDeleteState) return
    startTransition(async () => {
      const res = await deleteManyProspectsAction(bulkDeleteState.ids)
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      bulkDeleteState.clearSelection()
      setBulkDeleteState(null)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pt-4 pb-6 sm:flex-row sm:items-center lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Industry Prospects
            </h1>
            <p className="text-sm text-muted-foreground">
              Imported contacts by industry/category. Convert the promising ones
              into real leads.
            </p>
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsCategoryManagerOpen(true)}
            >
              <Tag className="h-4 w-4" /> Categories
            </Button>
            <Button className="gap-2" onClick={() => setIsImportOpen(true)}>
              <ImportIcon className="h-4 w-4" /> Import
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 lg:px-8">
        <ProspectsTable
          prospects={prospects}
          categories={categories}
          canManage={canManage}
          disabled={isPending}
          onCategoryChange={handleCategoryChange}
          onConvert={setConvertTarget}
          onDelete={setDeleteTarget}
          onBulkDeleteRequest={(ids, clearSelection) =>
            setBulkDeleteState({ ids, clearSelection })
          }
        />
      </div>

      <ProspectCategoryDialog
        open={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
        categories={categories}
      />

      <ProspectImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
      />

      <ConvertToLeadDialog
        prospect={convertTarget}
        admins={admins}
        canAssign={canAssignOnConvert}
        open={!!convertTarget}
        onOpenChange={(open) => !open && setConvertTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete prospect"
        description={`Delete ${deleteTarget?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        isPending={isPending}
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={!!bulkDeleteState}
        onOpenChange={(open) => !open && setBulkDeleteState(null)}
        title="Delete selected prospects"
        description={`This will permanently delete ${bulkDeleteState?.ids.length ?? 0} prospect(s). This cannot be undone.`}
        confirmLabel="Delete All"
        isPending={isPending}
        onConfirm={confirmBulkDelete}
      />
    </div>
  )
}
