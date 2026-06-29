import { prisma } from "@/lib/prisma"
import {
  hasPermission,
  permissionList,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import { AdminsClient, type AdminRowData } from "./_components/admins-client"

export default async function AdminsPage() {
  const currentAdmin = await requireAdminWithPermissions()

  if (
    !hasPermission(currentAdmin, "CREATE_ADMIN") &&
    !hasPermission(currentAdmin, "EDIT_ADMIN") &&
    !hasPermission(currentAdmin, "DELETE_ADMIN")
  ) {
    throw new Error("You do not have permission to manage admins.")
  }

  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      permissions: {
        select: { permission: true },
      },
      _count: {
        select: { assignedLeads: true },
      },
    },
  })

  const rows: AdminRowData[] = admins.map((admin) => ({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    permissions: admin.permissions.map((item) => item.permission),
    assignedLeadCount: admin._count.assignedLeads,
    createdAt: admin.createdAt.toISOString(),
  }))

  return (
    <AdminsClient
      admins={rows}
      currentAdmin={{
        id: currentAdmin.id,
        name: currentAdmin.name,
        email: currentAdmin.email,
        role: currentAdmin.role,
        permissions: permissionList(currentAdmin),
      }}
    />
  )
}
