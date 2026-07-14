import { prisma } from "@/lib/prisma"
import {
  hasPermission,
  leadAccessWhere,
  permissionList,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import {
  LeadsClient,
  type AdminOption,
  type LeadRowData,
} from "./_components/leads-client"

export default async function LeadsPage() {
  const admin = await requireAdminWithPermissions()
  const permissions = permissionList(admin)

  const [rawLeads, categories] = await Promise.all([
    prisma.inquiry.findMany({
      where: leadAccessWhere(admin),
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, color: true } },
        reassignments: {
          orderBy: { createdAt: "desc" },
          select: {
            createdAt: true,
            fromAdmin: { select: { name: true } },
            toAdmin: { select: { name: true } },
          },
        },
        _count: {
          select: { reassignments: true },
        },
        actions: {
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true,
            actionType: true,
            outcome: true,
            note: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.leadCategory.findMany({ orderBy: { name: "asc" } }),
  ])

  const admins = hasPermission(admin, "ASSIGN_LEAD")
    ? await prisma.admin.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true, role: true },
      })
    : []

  const leads: LeadRowData[] = rawLeads.map((lead) => {
    const reassignmentCount = lead._count.reassignments
    const latestReassignment = lead.reassignments[0]

    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      message: lead.message ?? "",
      status: lead.status ?? "NEW",
      rewardValue: lead.rewardValue ?? null,
      source: lead.source ?? "",
      assignedToId: lead.assignedToId ?? "",
      assignedToName: lead.assignedTo?.name ?? "Unassigned",
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
      categoryId: lead.categoryId ?? "",
      categoryName: lead.category?.name ?? "",
      categoryColor: lead.category?.color ?? null,
      reassignmentCount,
      reassignmentBucket:
        reassignmentCount === 0
          ? "Not reassigned"
          : reassignmentCount === 1
            ? "Reassigned once"
            : "Reassigned 2+ times",
      lastReassignedFromName: latestReassignment?.fromAdmin?.name ?? "",
      lastReassignedToName: latestReassignment?.toAdmin?.name ?? "",
      lastReassignedAt: latestReassignment?.createdAt.toISOString() ?? "",
      lastNote: lead.actions[0]?.note ?? "",
      recentActions: lead.actions.map((action) => ({
        id: action.id,
        actionType: action.actionType,
        outcome: action.outcome,
        note: action.note ?? "",
        createdAt: action.createdAt.toISOString(),
      })),
    }
  })

  const adminOptions: AdminOption[] = admins.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role,
  }))

  return (
    <LeadsClient
      leads={leads}
      admins={adminOptions}
      categories={categories}
      currentAdmin={{
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions,
      }}
    />
  )
}
