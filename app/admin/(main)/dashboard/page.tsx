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

function currentMonthValue() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

function parseMonth(month?: string) {
  const fallback = currentMonthValue()
  const value = month && /^\d{4}-\d{2}$/.test(month) ? month : fallback
  const [yearText, monthText] = value.split("-")
  const year = Number(yearText)
  const monthIndex = Number(monthText) - 1

  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return parseMonth(fallback)
  }

  const start = new Date(year, monthIndex, 1)
  const end = new Date(year, monthIndex + 1, 1)
  const label = start.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  })

  return { value, start, end, label }
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function dayKey(date: Date) {
  return String(date.getDate())
}

function incrementMap(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount)
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ month?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const selectedMonth = parseMonth(resolvedSearchParams?.month)
  const admin = await requireAdminWithPermissions()
  const canManageAdmins =
    hasPermission(admin, "CREATE_ADMIN") ||
    hasPermission(admin, "EDIT_ADMIN") ||
    hasPermission(admin, "DELETE_ADMIN")

  const leads = await prisma.inquiry.findMany({
    where: {
      ...leadAccessWhere(admin),
      createdAt: {
        gte: selectedMonth.start,
        lt: selectedMonth.end,
      },
    },
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
  const dailyCounts = new Map<string, number>()
  const adminCounts = new Map<string, number>()

  for (const status of STATUS_ORDER) {
    statusCounts.set(status, 0)
  }

  for (let day = 1; day <= daysInMonth(selectedMonth.start); day += 1) {
    dailyCounts.set(String(day), 0)
  }

  for (const lead of leads) {
    incrementMap(statusCounts, lead.status ?? "NEW")
    incrementMap(serviceCounts, lead.service || "Unknown")
    incrementMap(dailyCounts, dayKey(lead.createdAt))
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
    selectedMonth: selectedMonth.value,
    selectedMonthLabel: selectedMonth.label,
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
    monthlyTrend: Array.from(dailyCounts.entries()).map(([label, value]) => ({
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

