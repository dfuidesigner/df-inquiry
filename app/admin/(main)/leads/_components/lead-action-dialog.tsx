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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addLeadActionLogAction } from "@/actions/admin/leads"
import type { LeadRowData } from "./leads-client"

type LeadActionDialogProps = {
  lead: LeadRowData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadActionDialog({
  lead,
  open,
  onOpenChange,
}: LeadActionDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionType, setActionType] = useState("FOLLOW_UP")
  const [outcome, setOutcome] = useState("")
  const [note, setNote] = useState("")

  function onSubmit() {
    if (!lead) return

    startTransition(async () => {
      const res = await addLeadActionLogAction(lead.id, {
        actionType,
        outcome,
        note,
      })

      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      setActionType("FOLLOW_UP")
      setOutcome("")
      setNote("")
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Lead Note</DialogTitle>
          <DialogDescription>
            Log a call, follow-up, meeting, or other update for {lead?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Input
                value={actionType}
                onChange={(event) => setActionType(event.target.value)}
                placeholder="CALL, FOLLOW_UP, MEETING"
              />
            </div>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Input
                value={outcome}
                onChange={(event) => setOutcome(event.target.value)}
                placeholder="Interested, no answer, demo booked"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add useful context for the next follow-up"
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
          <Button
            onClick={onSubmit}
            disabled={isPending || actionType.length < 2 || outcome.length < 2}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
