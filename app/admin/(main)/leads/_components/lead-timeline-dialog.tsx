"use client"

import {
  CheckCircle2,
  Clock,
  Edit3,
  History,
  MessageSquare,
  UserRoundCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import type { LeadActionRow, LeadRowData } from "./leads-client"

type LeadTimelineDialogProps = {
  lead: LeadRowData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function iconForAction(action: LeadActionRow) {
  if (action.actionType === "STATUS_UPDATE") return CheckCircle2
  if (action.actionType === "ASSIGNMENT") return UserRoundCheck
  if (action.actionType === "LEAD_UPDATED") return Edit3
  if (action.actionType === "LEAD_CREATED") return Clock
  return MessageSquare
}

function toneForAction(action: LeadActionRow) {
  if (action.actionType === "STATUS_UPDATE")
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (action.actionType === "ASSIGNMENT")
    return "border-blue-200 bg-blue-50 text-blue-700"
  if (action.actionType === "LEAD_UPDATED")
    return "border-amber-200 bg-amber-50 text-amber-700"
  if (action.actionType === "LEAD_CREATED")
    return "border-slate-200 bg-slate-50 text-slate-700"
  return "border-violet-200 bg-violet-50 text-violet-700"
}

export function LeadTimelineDialog({
  lead,
  open,
  onOpenChange,
}: LeadTimelineDialogProps) {
  const actions = lead?.recentActions ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lead Timeline
          </DialogTitle>
          <DialogDescription>
            Every status change, assignment, edit, and note for {lead?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-125 space-y-4 overflow-y-auto pr-2">
          {actions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No timeline entries yet.
            </div>
          ) : (
            actions.map((action, index) => {
              const Icon = iconForAction(action)

              return (
                <div key={action.id} className="relative flex gap-4">
                  {index < actions.length - 1 && (
                    <div className="absolute top-10 left-4 h-[calc(100%-1rem)] w-px bg-border" />
                  )}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${toneForAction(action)}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {action.actionType.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-sm font-medium">
                          {action.outcome}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(action.createdAt)}
                      </span>
                    </div>
                    {action.note && (
                      <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">
                        {action.note}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
