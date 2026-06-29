import { prisma } from "@/lib/prisma"
import {
  hasPermission,
  leadAccessWhere,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import {
  DashboardClient,
  type DashboardData,
} from "./_components/dashboard-client"

const STATUS_ORDER = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "FOLLOW_UP",
  "CONVERTED",
  "LOST",
]

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function weekKey(date: Date) {
  const firstDay = startOfDay(date)
  const day = firstDay.getDay()
  const diff = firstDay.getDate() - day
  const weekStart = new Date(firstDay.setDate(diff))

  return weekStart.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  })
}

function incrementMap(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount)
}

export default async function DashboardPage() {
  const admin = await requireAdminWithPermissions()
  const canManageAdmins =
    hasPermission(admin, "CREATE_ADMIN") ||
    hasPermission(admin, "EDIT_ADMIN") ||
    hasPermission(admin, "DELETE_ADMIN")

  const leads = await prisma.inquiry.findMany({
    where: leadAccessWhere(admin),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      service: true,
      status: true,
      rewardValue: true,
      createdAt: true,
      assignedTo: {
        select: { name: true },
      },
    },
  })

  const totalAdmins = canManageAdmins ? await prisma.admin.count() : null
  const activeAdmins = canManageAdmins
    ? await prisma.admin.count({ where: { isActive: true } })
    : null

  const statusCounts = new Map<string, number>()
  const serviceCounts = new Map<string, number>()
  const weeklyCounts = new Map<string, number>()
  const adminCounts = new Map<string, number>()

  for (const status of STATUS_ORDER) {
    statusCounts.set(status, 0)
  }

  const lastEightWeeks = Array.from({ length: 8 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (7 - index) * 7)
    return weekKey(date)
  })

  for (const label of lastEightWeeks) {
    weeklyCounts.set(label, 0)
  }

  for (const lead of leads) {
    incrementMap(statusCounts, lead.status ?? "NEW")
    incrementMap(serviceCounts, lead.service || "Unknown")
    const leadWeek = weekKey(lead.createdAt)
    if (weeklyCounts.has(leadWeek)) {
      incrementMap(weeklyCounts, leadWeek)
    }
    incrementMap(adminCounts, lead.assignedTo?.name ?? "Unassigned")
  }

  const converted = statusCounts.get("CONVERTED") ?? 0
  const openLeads = leads.filter(
    (lead) => !["CONVERTED", "LOST"].includes(lead.status ?? "NEW")
  ).length
  const totalValue = leads.reduce(
    (sum, lead) => sum + (lead.rewardValue ?? 0),
    0
  )

  const data: DashboardData = {
    role: admin.role,
    stats: {
      totalLeads: leads.length,
      openLeads,
      convertedLeads: converted,
      conversionRate:
        leads.length === 0 ? 0 : Math.round((converted / leads.length) * 100),
      totalValue,
      totalAdmins,
      activeAdmins,
    },
    statusDistribution: Array.from(statusCounts.entries()).map(
      ([label, value]) => ({ label, value })
    ),
    weeklyTrend: Array.from(weeklyCounts.entries()).map(([label, value]) => ({
      label,
      value,
    })),
    topServices: Array.from(serviceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value })),
    adminPerformance: Array.from(adminCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value })),
    latestLeads: leads.slice(0, 6).map((lead) => ({
      id: lead.id,
      name: lead.name,
      service: lead.service,
      status: lead.status ?? "NEW",
      value: lead.rewardValue ?? null,
      createdAt: lead.createdAt.toISOString(),
    })),
  }

  return <DashboardClient data={data} />
}
