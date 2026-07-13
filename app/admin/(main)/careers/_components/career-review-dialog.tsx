"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
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
import { updateCareerSubmissionAction } from "@/actions/admin/careers"
import type { CareerSubmissionRow } from "./careers-client"

const STATUSES = ["NEW", "REVIEWING", "SHORTLISTED", "INTERVIEW", "REJECTED", "HIRED"] as const

type CareerReviewDialogProps = {
  submission: CareerSubmissionRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CareerReviewDialog({
  submission,
  open,
  onOpenChange,
}: CareerReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {submission && (
        <CareerReviewForm
          key={submission.id}
          submission={submission}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  )
}

function CareerReviewForm({
  submission,
  onOpenChange,
}: {
  submission: CareerSubmissionRow
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(submission.status)
  const [adminNote, setAdminNote] = useState(submission.adminNote)

  function onSubmit() {
    startTransition(async () => {
      const res = await updateCareerSubmissionAction(submission.id, {
        status: status as (typeof STATUSES)[number],
        adminNote,
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
    <DialogContent className="sm:max-w-150">
      <DialogHeader>
        <DialogTitle>{submission.name}</DialogTitle>
        <DialogDescription>
          {submission.position} application from {submission.email}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid gap-3 rounded-lg border p-4 text-sm md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{submission.phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="font-medium">{submission.location || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Company</p>
            <p className="font-medium">{submission.currentCompany || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Experience</p>
            <p className="font-medium">{submission.experienceYears ?? 0} years</p>
          </div>
        </div>

        {submission.coverLetter && (
          <div className="space-y-2">
            <Label>Cover Letter</Label>
            <div className="max-h-36 overflow-y-auto rounded-lg border bg-muted/30 p-3 text-sm">
              {submission.coverLetter}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Admin Note</Label>
          <Textarea
            rows={4}
            value={adminNote}
            onChange={(event) => setAdminNote(event.target.value)}
            placeholder="Internal note for this application"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Review
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

