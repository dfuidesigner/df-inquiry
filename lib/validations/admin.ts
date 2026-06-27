import { z } from "zod"

export const AdminLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>
