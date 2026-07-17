import { prisma } from "@/lib/prisma"
import {
  hasPermission,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import { ActivityClient, type ActivityRow } from "./_components/activity-client"

function defaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

export default async function ActivityLogPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string; to?: string }>
}) {
  const admin = await requireAdminWithPermissions()

  if (!hasPermission(admin, "VIEW_ACTIVITY_LOG")) {
    throw new Error("You do not have permission to view the activity log.")
  }

  const resolved = await searchParams
  const fallback = defaultRange()
  const fromDate =
    resolved?.from && /^\d{4}-\d{2}-\d{2}$/.test(resolved.from)
      ? resolved.from
      : fallback.from
  const toDate =
    resolved?.to && /^\d{4}-\d{2}-\d{2}$/.test(resolved.to)
      ? resolved.to
      : fallback.to

  const rangeStart = new Date(`${fromDate}T00:00:00`)
  const rangeEnd = new Date(`${toDate}T23:59:59.999`)

  const [rawActions, admins] = await Promise.all([
    prisma.leadAction.findMany({
      where: { createdAt: { gte: rangeStart, lte: rangeEnd } },
      orderBy: { createdAt: "desc" },
      take: 1000,
      include: {
        admin: { select: { id: true, name: true } },
        inquiry: { select: { id: true, name: true, email: true, phone: true } },
      },
    }),
    prisma.admin.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  const rows: ActivityRow[] = rawActions.map((action) => ({
    id: action.id,
    actionType: action.actionType,
    outcome: action.outcome,
    note: action.note ?? "",
    metadata: action.metadata as ActivityRow["metadata"],
    createdAt: action.createdAt.toISOString(),
    adminId: action.adminId ?? "",
    adminName: action.admin?.name ?? "System / Unknown",
    leadId: action.inquiryId,
    leadName: action.inquiry?.name ?? "Deleted lead",
    leadEmail: action.inquiry?.email ?? "",
    leadPhone: action.inquiry?.phone ?? "",
  }))

  return (
    <ActivityClient rows={rows} admins={admins} from={fromDate} to={toDate} />
  )
}
