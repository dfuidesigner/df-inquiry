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
