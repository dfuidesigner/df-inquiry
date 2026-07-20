import { z } from "zod"

export const CreateProspectCategorySchema = z.object({
  name: z.string().min(2, "Category name is required").max(40),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Use a hex color like #3b82f6")
    .optional(),
})
export const UpdateProspectCategorySchema =
  CreateProspectCategorySchema.partial()
export type CreateProspectCategoryInput = z.infer<
  typeof CreateProspectCategorySchema
>
export type UpdateProspectCategoryInput = z.infer<
  typeof UpdateProspectCategorySchema
>

// Same "coerce numbers to strings" fix we applied to lead imports, since
// Excel cells that look numeric come back as JS numbers, not strings.
function toTrimmedString(value: unknown) {
  if (value === undefined || value === null) return undefined
  const trimmed = (typeof value === "string" ? value : String(value)).trim()
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

export const ImportProspectRowSchema = z.object({
  name: requiredImportString("Name is required"),
  email: requiredImportEmail,
  phone: requiredImportString("Phone is required"),
  category: optionalImportString,
  note: optionalImportString,
})
export type ImportProspectRow = z.infer<typeof ImportProspectRowSchema>

export const ConvertProspectSchema = z.object({
  service: z.string().min(2, "Service is required"),
  status: z.string().optional(),
  assignedToId: z.string().optional(),
  rewardValue: z.string().optional(),
  message: z.string().optional(),
})
export type ConvertProspectInput = z.infer<typeof ConvertProspectSchema>
