"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { createAdminLeadAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

export function CreateLeadSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isPending] = useActionState(createAdminLeadAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()

      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [state?.success, state?.timestamp])
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-indigo-600 font-semibold text-white shadow-sm transition-all hover:bg-indigo-700">
          <Plus /> Add New Lead
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full min-w-75 flex-col overflow-y-auto border-l-0 bg-white px-4 sm:max-w-2xl sm:min-w-150 sm:border-l sm:border-slate-200 sm:px-10">
        <SheetHeader className="mb-6 border-b border-slate-100 pt-4 pb-6">
          <SheetTitle className="font-gra text-2xl text-slate-900">
            Create Manual Lead
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            Manually inject a prospective client or incoming call directly into
            your system pipeline.
          </SheetDescription>
        </SheetHeader>

        <form action={action} ref={formRef} className="space-y-5 font-gra">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-slate-700">
              Client Name
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g. John Doe"
              className="border-slate-200 focus-visible:ring-indigo-500"
            />
            {state?.fields?.name && (
              <p className="text-xs text-red-500">{state.fields.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-slate-700"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-xs font-bold text-slate-700"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 99999 99999"
                className="border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="service"
                className="text-xs font-bold text-slate-700"
              >
                Requested Service
              </Label>
              <Select name="service" required>
                <SelectTrigger className="w-full border-slate-200 bg-white">
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website-design">
                    Website Design & Dev
                  </SelectItem>
                  <SelectItem value="mobile-app">
                    Mobile App Development
                  </SelectItem>
                  <SelectItem value="saas">Custom SaaS Development</SelectItem>
                  <SelectItem value="digital-marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="game-development">
                    Game Development
                  </SelectItem>
                  <SelectItem value="Education-ERP-CRM">
                    Education ERP & CRM
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="status"
                className="text-xs font-bold text-slate-700"
              >
                Initial Pipeline Status
              </Label>
              <Select name="status" defaultValue="NEW">
                <SelectTrigger className="w-full border-slate-200 bg-white">
                  <SelectValue placeholder="Pipeline Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="HOT">Hot Lead 🔥</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="MEETING">Meeting Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="message"
              className="text-xs font-bold text-slate-700"
            >
              Project Brief / Note
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Add summary notes or project parameters here..."
              className="resize-y border-slate-200 focus-visible:ring-indigo-500"
            />
          </div>

          {state?.error && (
            <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
              {state.error}
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 py-6 font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
            >
              {isPending ? "Creating Entry..." : "Save and Inject Lead"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
