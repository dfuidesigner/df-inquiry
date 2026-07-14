import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin/auth"
import type { Admin, PermissionKey } from "@/generated/prisma/client"
export { ALL_PERMISSIONS, PERMISSION_LABELS } from "./permission-constants"

type AdminWithPermissions = Admin & {
  permissions: { permission: PermissionKey }[]
}

export function isSuperAdmin(admin: Pick<Admin, "role">) {
  return admin.role === "SUPER_ADMIN"
}

export function permissionList(admin: AdminWithPermissions | null) {
  if (!admin) return []
  return admin.permissions.map((item) => item.permission)
}

export function hasPermission(
  admin: AdminWithPermissions | null,
  permission: PermissionKey
) {
  if (!admin) return false
  if (isSuperAdmin(admin)) return true
  return admin.permissions.some((item) => item.permission === permission)
}

export function hasAnyPermission(
  admin: AdminWithPermissions | null,
  permissions: PermissionKey[]
) {
  return permissions.some((permission) => hasPermission(admin, permission))
}

export async function getCurrentAdminWithPermissions() {
  const admin = await getCurrentAdmin()
  if (!admin) return null

  return prisma.admin.findUnique({
    where: { id: admin.id },
    include: {
      permissions: {
        select: { permission: true },
      },
    },
  })
}

export async function requireAdminWithPermissions() {
  const admin = await getCurrentAdminWithPermissions()

  if (!admin || !admin.isActive) {
    redirect("/admin/login")
  }

  return admin
}

export async function requirePermission(permission: PermissionKey) {
  const admin = await requireAdminWithPermissions()

  if (!hasPermission(admin, permission)) {
    throw new Error("You do not have permission to perform this action.")
  }

  return admin
}

// export function canViewLead(
//   admin: AdminWithPermissions,
//   lead: { assignedToId: string | null }
// ) {
//   if (hasPermission(admin, "VIEW_ALL_LEADS")) return true
//   if (!hasPermission(admin, "VIEW_ASSIGNED_LEADS")) return false
//   return lead.assignedToId === admin.id
// }

// export function leadAccessWhere(admin: AdminWithPermissions) {
//   if (hasPermission(admin, "VIEW_ALL_LEADS")) return {}
//   if (hasPermission(admin, "VIEW_ASSIGNED_LEADS"))
//     return { assignedToId: admin.id }
//   return { id: "__no_leads_for_this_admin__" }
// }


export const leadAccessSelect = {
  id: true,
  assignedToId: true,
  reassignments: { select: { fromAdminId: true } },
} as const

export function toLeadAccessInput(lead: {
  assignedToId: string | null
  reassignments: { fromAdminId: string | null }[]
}) {
  return {
    assignedToId: lead.assignedToId,
    reassignedFromAdminIds: lead.reassignments
      .map((r) => r.fromAdminId)
      .filter((x): x is string => !!x),
  }
}

export function canViewLead(
  admin: AdminWithPermissions,
  lead: { assignedToId: string | null; reassignedFromAdminIds?: string[] }
) {
  if (hasPermission(admin, "VIEW_ALL_LEADS")) return true
  if (!hasPermission(admin, "VIEW_ASSIGNED_LEADS")) return false
  if (lead.assignedToId === admin.id) return true
  // Admin was reassigned away from this lead at some point — keep visibility.
  return lead.reassignedFromAdminIds?.includes(admin.id) ?? false
}

export function leadAccessWhere(admin: AdminWithPermissions) {
  if (hasPermission(admin, "VIEW_ALL_LEADS")) return {}
  if (hasPermission(admin, "VIEW_ASSIGNED_LEADS")) {
    return {
      OR: [
        { assignedToId: admin.id },
        { reassignments: { some: { fromAdminId: admin.id } } },
      ],
    }
  }
  return { id: "__no_leads_for_this_admin__" }
}