import { z } from "zod"

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "FOLLOW_UP",
  "CONVERTED",
  "LOST",
] as const

export const LeadStatusSchema = z.enum(LEAD_STATUSES)

export const CreateLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  service: z.string().min(2, "Service is required"),
  message: z.string().optional(),
  status: LeadStatusSchema,
  rewardValue: z.string().optional(),
  source: z.string().optional(),
  assignedToId: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  categoryId: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
})

export const UpdateLeadSchema = CreateLeadSchema.partial().extend({
  name: z.string().min(2, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(6, "Phone number is required").optional(),
  service: z.string().min(2, "Service is required").optional(),
})

export const UpdateLeadStatusSchema = z.object({
  status: LeadStatusSchema,
  note: z.string().optional(),
})

export const AssignLeadSchema = z.object({
  assignedToId: z.string().optional(),
})

export const LeadActionSchema = z.object({
  actionType: z.string().min(2, "Action type is required"),
  outcome: z.string().min(2, "Outcome is required"),
  note: z.string().optional(),
})

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>
export type UpdateLeadStatusInput = z.infer<typeof UpdateLeadStatusSchema>
export type AssignLeadInput = z.infer<typeof AssignLeadSchema>
export type LeadActionInput = z.infer<typeof LeadActionSchema>
export type LeadStatus = z.infer<typeof LeadStatusSchema>

export const CreateLeadCategorySchema = z.object({
  name: z.string().min(2, "Category name is required").max(40),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Use a hex color like #3b82f6")
    .optional(),
})
export const UpdateLeadCategorySchema = CreateLeadCategorySchema.partial()

export type CreateLeadCategoryInput = z.infer<typeof CreateLeadCategorySchema>
export type UpdateLeadCategoryInput = z.infer<typeof UpdateLeadCategorySchema>

export const ReassignLeadSchema = z.object({
  assignedToId: z.string().min(1, "Select an admin to reassign to"),
  note: z.string().optional(),
  resetStatus: z.boolean().optional(),
})

export type ReassignLeadInput = z.infer<typeof ReassignLeadSchema>

function toTrimmedString(value: unknown) {
  if (value === undefined || value === null) return undefined
  const str = typeof value === "string" ? value : String(value)
  const trimmed = str.trim()
  return trimmed === "" ? undefined : trimmed
}

const requiredImportString = (message: string) =>
  z.preprocess(toTrimmedString, z.string().min(1, message))

const optionalImportString = z.preprocess(
  toTrimmedString,
  z.string().optional()
)

const requiredImportEmail = z.preprocess(
  toTrimmedString,
  z.string().min(1, "Email is required").email("Invalid email")
)

export const ImportLeadRowSchema = z.object({
  name: requiredImportString("Name is required"),
  email: requiredImportEmail,
  phone: requiredImportString("Phone is required"),
  service: requiredImportString("Service is required"),
  message: optionalImportString,
  status: optionalImportString,
  rewardValue: z.union([z.string(), z.number()]).optional(),
  source: optionalImportString,
  category: optionalImportString,
  assignedToEmail: optionalImportString,
  utm_source: optionalImportString,
  utm_medium: optionalImportString,
  utm_campaign: optionalImportString,
  utm_content: optionalImportString,
  utm_term: optionalImportString,
})
export type ImportLeadRow = z.infer<typeof ImportLeadRowSchema>
