"use client"

import { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
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
  email: string
  phone: string
  service: string
  message: string | null
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  status: string | null
  createdAt: Date
  actions: Action[]
}

export function LeadSheet({ lead }: { lead: Lead }) {
  const [isOpen, setIsOpen] = useState(false)

  const cleanPhone = lead.phone.replace(/\D/g, "")

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

      <SheetContent className="flex w-full min-w-75 flex-col overflow-y-auto border-l-0 bg-white px-4 sm:max-w-2xl sm:min-w-[600px] sm:border-l sm:border-slate-200 sm:px-10">
        <SheetHeader className="mb-6 border-b border-slate-100 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-gra text-2xl text-slate-900">
              {lead.name}
            </SheetTitle>
            <span className="text-xs font-medium text-slate-400">
              {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          <SheetDescription className="text-slate-500">
            Review lead details and interaction history.
          </SheetDescription>
        </SheetHeader>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#20bd5a]"
          >
            💬 WhatsApp
          </a>
          <a
            href={`tel:${cleanPhone}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            📞 Call
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-900"
          >
            ✉️ Email
          </a>
        </div>

        {/* Lead Details Grid */}
        <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          <h3 className="mb-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
            Lead Information
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="col-span-2">
              <dt className="text-sm font-medium text-slate-500">
                Email Address
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">
                {lead.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">
                Phone Number
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">
                {lead.phone}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">
                Service Requested
              </dt>
              <dd className="mt-1 text-sm font-semibold text-indigo-700">
                {lead.service}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Marketing Source
              </dt>
              <dd className="mt-1 flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-900">
                  {lead.utm_source || lead.source || "Direct / Unknown"}
                </span>
                {(lead.utm_medium || lead.utm_campaign) && (
                  <span className="text-xs font-medium text-slate-500">
                    {[lead.utm_medium, lead.utm_campaign]
                      .filter(Boolean)
                      .join(" • ")}
                  </span>
                )}
                {(lead.utm_term || lead.utm_content) && (
                  <span className="text-xs text-slate-400">
                    {[lead.utm_term, lead.utm_content]
                      .filter(Boolean)
                      .join(" • ")}
                  </span>
                )}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-slate-500">Message</dt>
              <dd className="mt-2 rounded-md border border-slate-100 bg-white p-3 text-sm whitespace-pre-wrap text-slate-700">
                {lead.message || (
                  <span className="text-slate-400 italic">
                    No message provided.
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
            Log New Activity
          </h3>
          <LogActionForm
            inquiryId={lead.id}
            currentStatus={lead.status || "NEW"}
            onSuccess={() => setIsOpen(false)}
          />
        </div>

        <div className="mb-10">
          <h3 className="mb-6 text-xs font-bold tracking-wider text-slate-500 uppercase">
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
                        {formatDistanceToNow(new Date(action.createdAt), {
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
