"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Plus, Tag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
  createProspectCategoryAction,
  deleteProspectCategoryAction,
} from "@/actions/admin/prospect-categories"
import type { ProspectCategoryOption } from "./prospects-client"

type ProspectCategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: ProspectCategoryOption[]
}

export function ProspectCategoryDialog({
  open,
  onOpenChange,
  categories,
}: ProspectCategoryDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [color, setColor] = useState("#3b82f6")
  const [deleteTarget, setDeleteTarget] =
    useState<ProspectCategoryOption | null>(null)
  const [isDeleting, startDeleteTransition] = useTransition()

  function onCreate() {
    if (name.trim().length < 2) return
    startTransition(async () => {
      const res = await createProspectCategoryAction({
        name: name.trim(),
        color,
      })
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      setName("")
      router.refresh()
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    startDeleteTransition(async () => {
      const res = await deleteProspectCategoryAction(deleteTarget.id)
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      setDeleteTarget(null)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Manage Prospect Categories
          </DialogTitle>
          <DialogDescription>
            A separate list from your Lead categories — use this for industries
            like Hospitality, Healthcare, LMS, Corporate Learning, etc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label>New category</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hospitality, Healthcare"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border"
              />
            </div>
            <Button
              type="button"
              onClick={onCreate}
              disabled={isPending || name.trim().length < 2}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </Button>
          </div>

          <div className="max-h-75 space-y-2 overflow-y-auto">
            {categories.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No categories yet.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color ?? "#64748b" }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => setDeleteTarget(category)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>

        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(o) => !o && setDeleteTarget(null)}
          title="Delete category"
          description={`Delete category "${deleteTarget?.name}"? Prospects keep their data but become uncategorized.`}
          confirmLabel="Delete"
          isPending={isDeleting}
          onConfirm={confirmDelete}
        />
      </DialogContent>
    </Dialog>
  )
}
