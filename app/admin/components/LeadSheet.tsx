"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogActionForm } from "./LogActionForm"

type Action = {
  id: string
  actionType: string
  outcome: string
  note: string | null
  createdAt: Date
}

type Lead = {
  id: string
  name: string
  actions: Action[]
  status: string | null
}

export function LeadSheet({ lead }: { lead: Lead }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50"
        >
          View & Manage
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full min-w-75 flex-col overflow-y-auto border-l-0 bg-white px-2 sm:max-w-xl sm:min-w-xl sm:border-l sm:border-slate-200 sm:px-10">
        <SheetHeader className="mb-6 border-b border-slate-100 pb-6">
          <SheetTitle className="font-gra text-2xl text-slate-900">
            {lead.name}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            Log new activity or review interaction history.
          </SheetDescription>
        </SheetHeader>

        <div className="mb-10">
          <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase">
            New Activity
          </h3>
          <LogActionForm
            inquiryId={lead.id}
            currentStatus={lead.status || "NEW"}
            onSuccess={() => setIsOpen(false)}
          />
        </div>

        <div>
          <h3 className="mb-6 text-sm font-bold tracking-wider text-slate-500 uppercase">
            Activity Timeline
          </h3>

          {lead.actions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No activity logged yet. Time to reach out!
            </div>
          ) : (
            <div className="relative ml-3 space-y-8 border-l-2 border-slate-100 pb-4">
              {lead.actions.map((action) => (
                <div key={action.id} className="relative pl-6">
                  <span className="absolute top-1.5 -left-2.25 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-indigo-500">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  </span>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        {action.actionType}
                        <span className="mx-2 text-slate-300">→</span>
                        <span className="text-indigo-600">
                          {action.outcome.replace("_", " ")}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        {formatDistanceToNow(action.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {action.note && (
                      <div className="mt-1 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700 shadow-sm">
                        {action.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
