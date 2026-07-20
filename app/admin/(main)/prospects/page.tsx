import { prisma } from "@/lib/prisma"
import {
  hasPermission,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import {
  ProspectsClient,
  type ProspectRowData,
} from "./_components/prospects-client"

export default async function ProspectsPage() {
  const admin = await requireAdminWithPermissions()

  if (
    !hasPermission(admin, "VIEW_PROSPECTS") &&
    !hasPermission(admin, "MANAGE_PROSPECTS")
  ) {
    throw new Error("You do not have permission to view prospects.")
  }

  const [rawProspects, categories, admins] = await Promise.all([
    prisma.prospect.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, color: true } },
        convertedLead: { select: { id: true, name: true } },
        convertedBy: { select: { name: true } },
        importedBy: { select: { name: true } },
      },
    }),
    prisma.prospectCategory.findMany({ orderBy: { name: "asc" } }),
    hasPermission(admin, "ASSIGN_LEAD")
      ? prisma.admin.findMany({
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
  ])

  const prospects: ProspectRowData[] = rawProspects.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone,
    categoryId: p.categoryId ?? "",
    categoryName: p.category?.name ?? "",
    categoryColor: p.category?.color ?? null,
    note: p.note ?? "",
    source: p.source ?? "",
    isConverted: !!p.convertedLeadId,
    convertedLeadId: p.convertedLeadId ?? "",
    convertedLeadName: p.convertedLead?.name ?? "",
    convertedByName: p.convertedBy?.name ?? "",
    convertedAt: p.convertedAt?.toISOString() ?? "",
    importedByName: p.importedBy?.name ?? "",
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <ProspectsClient
      prospects={prospects}
      categories={categories}
      admins={admins}
      canManage={hasPermission(admin, "MANAGE_PROSPECTS")}
      canAssignOnConvert={hasPermission(admin, "ASSIGN_LEAD")}
    />
  )
}
