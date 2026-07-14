"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, UserRoundCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { reassignLeadForRecheckAction } from "@/actions/admin/leads"
import type { AdminOption, LeadRowData } from "./leads-client"

type LeadReassignDialogProps = {
  lead: LeadRowData | null
  admins: AdminOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadReassignDialog({
  lead,
  admins,
  open,
  onOpenChange,
}: LeadReassignDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [assignedToId, setAssignedToId] = useState("")
  const [note, setNote] = useState("")
  const [resetStatus, setResetStatus] = useState(true)

  const eligibleAdmins = admins.filter((a) => a.id !== lead?.assignedToId)

  useEffect(() => {
    if (open) {
      setAssignedToId("")
      setNote("")
      setResetStatus(lead?.status === "LOST" || lead?.status === "CONVERTED")
    }
  }, [open, lead])

  function onSubmit() {
    if (!lead || !assignedToId) return

    startTransition(async () => {
      const res = await reassignLeadForRecheckAction(lead.id, {
        assignedToId,
        note,
        resetStatus,
      })

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
          <DialogTitle className="flex items-center gap-2">
            <UserRoundCheck className="h-5 w-5" />
            Reassign for Recheck
          </DialogTitle>
          <DialogDescription>
            Currently assigned to <strong>{lead?.assignedToName}</strong>,
            marked <strong>{lead?.status?.replace("_", " ")}</strong>. Pick
            another admin to double-check this lead.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reassign to</Label>
            <Select value={assignedToId} onValueChange={setAssignedToId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an admin" />
              </SelectTrigger>
              <SelectContent>
                {eligibleAdmins.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    {admin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why is this being rechecked?"
            />
          </div>

          <label className="flex items-start gap-3 rounded-md border p-3">
            <Checkbox
              checked={resetStatus}
              onCheckedChange={(checked) => setResetStatus(checked === true)}
            />
            <span className="text-sm">
              Reset status to <strong>Follow Up</strong> so it shows as active
              again
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending || !assignedToId}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
