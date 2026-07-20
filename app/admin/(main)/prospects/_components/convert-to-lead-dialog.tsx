"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowRightCircle, Loader2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LEAD_STATUSES, type LeadStatus } from "@/lib/validations/admin-lead"
import { convertProspectToLeadAction } from "@/actions/admin/prospects"
import type { ProspectRowData } from "./prospects-client"

type AdminOption = { id: string; name: string }

type ConvertToLeadDialogProps = {
  prospect: ProspectRowData | null
  admins: AdminOption[]
  canAssign: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConvertToLeadDialog({
  prospect,
  admins,
  canAssign,
  open,
  onOpenChange,
}: ConvertToLeadDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [service, setService] = useState("")
  const [status, setStatus] = useState<LeadStatus>("NEW")
  const [assignedToId, setAssignedToId] = useState("")
  const [rewardValue, setRewardValue] = useState("")
  const [message, setMessage] = useState("")

  function resetForm() {
    setService("")
    setStatus("NEW")
    setAssignedToId("")
    setRewardValue("")
    setMessage("")
  }

  function onSubmit() {
    if (!prospect || service.trim().length < 2) return

    startTransition(async () => {
      const res = await convertProspectToLeadAction(prospect.id, {
        service: service.trim(),
        status,
        assignedToId: assignedToId || undefined,
        rewardValue: rewardValue || undefined,
        message: message || undefined,
      })

      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      resetForm()
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm()
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightCircle className="h-5 w-5" />
            Convert to Lead
          </DialogTitle>
          <DialogDescription>
            Turn <strong>{prospect?.name}</strong> into a real lead. A service
            is required since leads track it and prospects don&apos;t.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-3 text-sm text-muted-foreground">
            {prospect?.email} · {prospect?.phone}
            {prospect?.categoryName && ` · ${prospect.categoryName}`}
          </div>

          <div className="space-y-2">
            <Label>Service *</Label>
            <Input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. Web Development, Corporate Training"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as LeadStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {canAssign && (
              <div className="space-y-2">
                <Label>Assign to</Label>
                <Select
                  value={assignedToId || "unassigned"}
                  onValueChange={(v) =>
                    setAssignedToId(v === "unassigned" ? "" : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {admins.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Lead Value (optional)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={rewardValue}
              onChange={(e) => setRewardValue(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Message / Note (optional)</Label>
            <Textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                prospect?.note || "Notes carried over to the new lead"
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending || service.trim().length < 2}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Convert to Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
