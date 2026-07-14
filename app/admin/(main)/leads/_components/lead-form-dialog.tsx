"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  CreateLeadSchema,
  LEAD_STATUSES,
  type CreateLeadInput,
} from "@/lib/validations/admin-lead"
import { createLeadAction, updateLeadAction } from "@/actions/admin/leads"
import type {
  AdminOption,
  LeadCategoryOption,
  LeadRowData,
} from "./leads-client"
import type { z } from "zod"

type CreateLeadOutput = z.output<typeof CreateLeadSchema>

type LeadFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  admins: AdminOption[]
  mode: "create" | "edit"
  lead?: LeadRowData | null
  categories: LeadCategoryOption[]
}

export function LeadFormDialog({
  open,
  onOpenChange,
  admins,
  mode,
  categories,
  lead,
}: LeadFormDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateLeadOutput>({
    resolver: zodResolver(CreateLeadSchema),
    defaultValues: {
      status: "NEW",
      assignedToId: "",
      source: "",
    },
  })

  useEffect(() => {
    if (!open) return

    reset({
      name: lead?.name ?? "",
      email: lead?.email ?? "",
      phone: lead?.phone ?? "",
      service: lead?.service ?? "",
      message: lead?.message ?? "",
      status: (lead?.status as CreateLeadInput["status"]) ?? "NEW",
      rewardValue: lead?.rewardValue?.toString() ?? "",
      source: lead?.source ?? "",
      assignedToId: lead?.assignedToId ?? "",
      categoryId: lead?.categoryId ?? ""
    })
    setServerError("")
  }, [lead, open, reset])

  function onSubmit(data: CreateLeadInput) {
    setServerError("")

    startTransition(async () => {
      const res =
        mode === "edit" && lead
          ? await updateLeadAction(lead.id, data)
          : await createLeadAction(data)

      if (!res.success) {
        setServerError(res.message)
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
      <DialogContent className="sm:max-w-175">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Lead" : "Create Lead"}
          </DialogTitle>
          <DialogDescription>
            Capture the contact details, service interest, source, and
            assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Customer name" />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} placeholder="+1 555 000 0000" />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Service</Label>
              <Input
                {...register("service")}
                placeholder="Course, product, or service"
              />
              {errors.service && (
                <p className="text-xs text-destructive">
                  {errors.service.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={watch("categoryId") || "none"}
                onValueChange={(value) =>
                  setValue("categoryId", value === "none" ? "" : value, {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as CreateLeadInput["status"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned Admin</Label>
              <Select
                value={watch("assignedToId") || "unassigned"}
                onValueChange={(value) =>
                  setValue(
                    "assignedToId",
                    value === "unassigned" ? "" : value,
                    {
                      shouldDirty: true,
                    }
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lead Value</Label>
              <Input
                {...register("rewardValue")}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Input
                {...register("source")}
                placeholder="Website, Ads, Referral"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              {...register("message")}
              rows={4}
              placeholder="Notes from the inquiry or lead form"
            />
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {mode === "edit" ? "Save Changes" : "Create Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
