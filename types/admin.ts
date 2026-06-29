import type { AdminRole, PermissionKey } from "@/generated/prisma/client"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminRole | string
  permissions?: PermissionKey[]
}
