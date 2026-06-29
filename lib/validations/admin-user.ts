import { z } from "zod"
import { ALL_PERMISSIONS } from "@/lib/admin/permission-constants"

const PermissionSchema = z.enum(ALL_PERMISSIONS as [string, ...string[]])
const OptionalPasswordSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(8, "Password must be at least 8 characters").optional()
)

export const AdminFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "MANAGER", "SALES"]),
  isActive: z.boolean(),
  permissions: z.array(PermissionSchema),
})

export type AdminFormValues = z.infer<typeof AdminFormSchema>

export const CreateAdminSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["MANAGER", "SALES"]),
  isActive: z.boolean().default(true),
  permissions: z.array(PermissionSchema).default([]),
})

export const UpdateAdminSchema = CreateAdminSchema.omit({
  password: true,
  role: true,
})
  .partial()
  .extend({
    role: z.enum(["SUPER_ADMIN", "MANAGER", "SALES"]).optional(),
    password: OptionalPasswordSchema,
    permissions: z.array(PermissionSchema).optional(),
  })

export type CreateAdminInput = z.infer<typeof CreateAdminSchema>
export type UpdateAdminInput = z.infer<typeof UpdateAdminSchema>
