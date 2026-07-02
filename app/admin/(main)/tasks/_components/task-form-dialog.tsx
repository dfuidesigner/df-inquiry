"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { type Resolver, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays, Clock, Loader2, Save } from "lucide-react"
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
  ADMIN_TASK_STATUSES,
  ADMIN_TASK_TYPES,
  CreateAdminTaskSchema,
  type AdminTaskStatusInput,
  type AdminTaskTypeInput,
  type CreateAdminTaskInput,
  type UpdateAdminTaskInput,
} from "@/lib/validations/admin-task"
import {
  createAdminTaskAction,
  updateAdminTaskAction,
} from "@/actions/admin/tasks"
import type { LeadOption, TaskRowData } from "./tasks-client"

type TaskFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  task?: TaskRowData | null
  leads: LeadOption[]
}

function formatDateInput(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10)
  return new Date(value).toISOString().slice(0, 10)
}

function typeLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

export function TaskFormDialog({
  open,
  onOpenChange,
  mode,
  task,
  leads,
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <TaskForm
          key={task?.id ?? "new-task"}
          mode={mode}
          task={task}
          leads={leads}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  )
}

function TaskForm({
  mode,
  task,
  leads,
  onOpenChange,
}: {
  mode: "create" | "edit"
  task?: TaskRowData | null
  leads: LeadOption[]
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAdminTaskInput>({
    resolver: zodResolver(
      CreateAdminTaskSchema
    ) as Resolver<CreateAdminTaskInput>,
    defaultValues: {
      taskType: (task?.taskType as AdminTaskTypeInput) ?? "CALL",
      status: (task?.status as AdminTaskStatusInput) ?? "DONE",
      title: task?.title ?? "",
      clientName: task?.clientName ?? "",
      clientPhone: task?.clientPhone ?? "",
      clientEmail: task?.clientEmail ?? "",
      description: task?.description ?? "",
      outcome: task?.outcome ?? "",
      durationMinutes: task?.durationMinutes ?? 15,
      taskDate: formatDateInput(task?.taskDate),
      leadId: task?.leadId ?? "",
    },
  })

  function onSubmit(values: CreateAdminTaskInput) {
    startTransition(async () => {
      const payload = {
        ...values,
        leadId: values.leadId === "none" ? "" : values.leadId,
      }

      const res =
        mode === "edit" && task
          ? await updateAdminTaskAction(
              task.id,
              payload as UpdateAdminTaskInput
            )
          : await createAdminTaskAction(payload)

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
    <DialogContent className="sm:max-w-175">
      <DialogHeader>
        <DialogTitle>{mode === "edit" ? "Edit Task" : "Add Task"}</DialogTitle>
        <DialogDescription>
          Log what was done, who it was for, and how much time it took.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select
              value={watch("taskType")}
              onValueChange={(value) =>
                setValue("taskType", value as AdminTaskTypeInput, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_TASK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {typeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={watch("status") ?? "DONE"}
              onValueChange={(value) =>
                setValue("status", value as AdminTaskStatusInput, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_TASK_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {typeLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>What did you do?</Label>
            <Input
              {...register("title")}
              placeholder="Called client, met client, sent proposal, completed follow-up"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input
              {...register("clientName")}
              placeholder="Client or company name"
            />
          </div>

          <div className="space-y-2">
            <Label>Client Phone</Label>
            <Input {...register("clientPhone")} placeholder="+1 555 000 0000" />
          </div>

          <div className="space-y-2">
            <Label>Client Email</Label>
            <Input
              {...register("clientEmail")}
              type="email"
              placeholder="client@example.com"
            />
            {errors.clientEmail && (
              <p className="text-xs text-destructive">
                {errors.clientEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Related Lead</Label>
            <Select
              value={watch("leadId") || "none"}
              onValueChange={(value) =>
                setValue("leadId", value === "none" ? "" : value, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No linked lead</SelectItem>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} - {lead.service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Task Date
            </Label>
            <Input {...register("taskDate")} type="date" />
            {errors.taskDate && (
              <p className="text-xs text-destructive">
                {errors.taskDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Time Taken
            </Label>
            <Input
              {...register("durationMinutes")}
              type="number"
              min="1"
              step="1"
              placeholder="Minutes"
            />
            {errors.durationMinutes && (
              <p className="text-xs text-destructive">
                {errors.durationMinutes.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Details</Label>
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Add context: what was discussed, what was prepared, what was completed"
          />
        </div>

        <div className="space-y-2">
          <Label>Outcome / Next Step</Label>
          <Textarea
            {...register("outcome")}
            rows={3}
            placeholder="Example: client asked for pricing, meeting scheduled, proposal sent"
          />
        </div>

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
            {mode === "edit" ? "Save Changes" : "Add Task"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
