"use client"

import { useActionState, useEffect, useRef } from "react"
import { addLeadAction } from "@/app/admin/actions"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function LogActionForm({
  inquiryId,
  currentStatus,
  onSuccess,
}: {
  inquiryId: string
  currentStatus: string
  onSuccess: () => void
}) {
  const [state, action, isPending] = useActionState(addLeadAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      onSuccess()
    }
  }, [state?.success, state?.timestamp, onSuccess])

  return (
    <form
      action={action}
      ref={formRef}
      className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm"
    >
      <input type="hidden" name="inquiryId" value={inquiryId} />

      <div className="space-y-3 border-b border-slate-200 pb-5">
        <Label
          htmlFor="newStatus"
          className="text-sm font-bold tracking-wider text-indigo-600 uppercase"
        >
          Update Pipeline Status
        </Label>
        <Select name="newStatus" defaultValue={currentStatus || "NEW"}>
          <SelectTrigger className="w-full border-indigo-100 bg-white shadow-sm focus:ring-indigo-500">
            <SelectValue placeholder="Lead Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="MEETING">Meeting Scheduled</SelectItem>
            <SelectItem value="WON">Won (Deal Closed!)</SelectItem>
            <SelectItem value="LOST">Lost / Unqualified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="actionType"
            className="text-sm font-semibold text-slate-700"
          >
            Action Type
          </Label>
          <Select name="actionType" defaultValue="CALL">
            <SelectTrigger className="w-full border-slate-200 bg-white focus:ring-indigo-500">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CALL">Phone Call</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="NOTE">Internal Note</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="outcome"
            className="text-sm font-semibold text-slate-700"
          >
            Outcome
          </Label>
          <Select name="outcome" required>
            <SelectTrigger className="w-full border-slate-200 bg-white focus:ring-indigo-500">
              <SelectValue placeholder="What happened?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NO_ANSWER">Did Not Pick Up</SelectItem>
              <SelectItem value="VOICEMAIL">Left Voicemail</SelectItem>
              <SelectItem value="CONNECTED">Connected / Spoke</SelectItem>
              <SelectItem value="SCHEDULED">Meeting Scheduled</SelectItem>
              <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm font-semibold text-slate-700">
          Detailed Notes
        </Label>
        <Textarea
          name="note"
          className="min-h-25 resize-y border-slate-200 bg-white focus-visible:ring-indigo-500"
          placeholder="Summarize the interaction..."
        />
      </div>

      {state?.error && (
        <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-indigo-600 py-6 font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
        disabled={isPending}
      >
        {isPending ? "Saving Activity..." : "Log Activity & Update Status"}
      </Button>
    </form>
  )
}
