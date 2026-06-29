"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LEAD_STATUSES, type LeadStatus } from "@/lib/validations/admin-lead"
import { updateLeadStatusAction } from "@/actions/admin/leads"
import type { LeadRowData } from "./leads-client"

type LeadStatusDialogProps = {
  lead: LeadRowData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadStatusDialog({
  lead,
  open,
  onOpenChange,
}: LeadStatusDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [status, setStatus] = useState<LeadStatus>("NEW")
  const [note, setNote] = useState("")

  const [prevLeadId, setPrevLeadId] = useState<string | undefined>(undefined)
  const [prevOpen, setPrevOpen] = useState(false)

  if (lead?.id !== prevLeadId || open !== prevOpen) {
    setPrevLeadId(lead?.id)
    setPrevOpen(open)
    if (open && lead) {
      setStatus((lead.status as LeadStatus) ?? "NEW")
      setNote("")
    }
  }

  function onSubmit() {
    if (!lead) return

    startTransition(async () => {
      const res = await updateLeadStatusAction(lead.id, { status, note })
      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Lead Status</DialogTitle>
          <DialogDescription>
            Change the status for {lead?.name} and optionally add a follow-up
            note.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as LeadStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUSES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Optional status note"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
