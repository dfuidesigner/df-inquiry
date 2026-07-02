import { z } from "zod"

export const ADMIN_TASK_TYPES = [
  "CALL",
  "CLIENT_MEETING",
  "FOLLOW_UP",
  "DEMO",
  "PROPOSAL",
  "DOCUMENTATION",
  "INTERNAL_WORK",
  "OTHER",
] as const

export const ADMIN_TASK_STATUSES = ["DONE", "IN_PROGRESS", "BLOCKED"] as const

export const CreateAdminTaskSchema = z.object({
  taskType: z.enum(ADMIN_TASK_TYPES),
  status: z.enum(ADMIN_TASK_STATUSES).default("DONE"),
  title: z.string().min(2, "Task title is required"),
  clientName: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z
    .union([z.string().email("Invalid client email"), z.literal("")])
    .optional(),
  description: z.string().optional(),
  outcome: z.string().optional(),
  durationMinutes: z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number().int().min(1, "Duration is required")
  ),
  taskDate: z.string().min(1, "Task date is required"),
  leadId: z.string().optional(),
})

export const UpdateAdminTaskSchema = CreateAdminTaskSchema.partial().extend({
  durationMinutes: z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number().int().min(1, "Duration is required").optional()
  ),
})

export type CreateAdminTaskInput = z.input<typeof CreateAdminTaskSchema>
export type UpdateAdminTaskInput = z.input<typeof UpdateAdminTaskSchema>
export type AdminTaskTypeInput = (typeof ADMIN_TASK_TYPES)[number]
export type AdminTaskStatusInput = (typeof ADMIN_TASK_STATUSES)[number]

