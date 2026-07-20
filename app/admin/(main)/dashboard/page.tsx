import { prisma } from "@/lib/prisma"
import {
  hasPermission,
  leadAccessWhere,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import type { Prisma } from "@/generated/prisma/client"
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

type DashboardRange = "today" | "yesterday" | "7d" | "30d" | "month"
const VALID_RANGES: DashboardRange[] = ["today", "yesterday", "7d", "30d", "month"]

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

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(monthIndex) ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
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

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

// Resolves a preset (or custom month) into a concrete [start, end) window,
// plus the granularity the trend chart should render at.
function resolveDateWindow(range: DashboardRange, month?: string) {
  const todayStart = startOfDay(new Date())
  const tomorrowStart = addDays(todayStart, 1)

  if (range === "today") {
    return {
      start: todayStart,
      end: tomorrowStart,
      label: "Today",
      granularity: "hour" as const,
      monthValue: currentMonthValue(),
    }
  }

  if (range === "yesterday") {
    const start = addDays(todayStart, -1)
    return {
      start,
      end: todayStart,
      label: "Yesterday",
      granularity: "hour" as const,
      monthValue: currentMonthValue(),
    }
  }

  if (range === "7d") {
    const start = addDays(todayStart, -6) // includes today = 7 days total
    return {
      start,
      end: tomorrowStart,
      label: "Last 7 Days",
      granularity: "day" as const,
      monthValue: currentMonthValue(),
    }
  }

  if (range === "30d") {
    const start = addDays(todayStart, -29)
    return {
      start,
      end: tomorrowStart,
      label: "Last 30 Days",
      granularity: "day" as const,
      monthValue: currentMonthValue(),
    }
  }

  const parsed = parseMonth(month)
  return {
    start: parsed.start,
    end: parsed.end,
    label: parsed.label,
    granularity: "day" as const,
    monthValue: parsed.value,
  }
}

function formatHourLabel(hour: number) {
  const period = hour < 12 ? "AM" : "PM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}${period}`
}

// Builds contiguous buckets (hourly or daily) covering the window, so the
// trend chart's granularity adapts to how wide the selected range is.
function buildTrendBuckets(
  start: Date,
  end: Date,
  granularity: "hour" | "day"
) {
  const buckets: { key: string; label: string }[] = []
  const stepMs = granularity === "hour" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000

  let cursor = start.getTime()
  let index = 0
  while (cursor < end.getTime()) {
    const bucketDate = new Date(cursor)
    buckets.push({
      key: String(index),
      label:
        granularity === "hour"
          ? formatHourLabel(bucketDate.getHours())
          : String(bucketDate.getDate()),
    })
    cursor += stepMs
    index += 1
  }

  return buckets
}

function bucketIndexFor(date: Date, start: Date, granularity: "hour" | "day") {
  const stepMs = granularity === "hour" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  return Math.floor((date.getTime() - start.getTime()) / stepMs)
}

function incrementMap(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount)
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    range?: string
    month?: string
    status?: string
    assignedToId?: string
    categoryId?: string
  }>
}) {
  const resolvedSearchParams = await searchParams

  const selectedRange: DashboardRange = VALID_RANGES.includes(
    resolvedSearchParams?.range as DashboardRange
  )
    ? (resolvedSearchParams!.range as DashboardRange)
    : "month"

  const window = resolveDateWindow(selectedRange, resolvedSearchParams?.month)

  const admin = await requireAdminWithPermissions()
  const canManageAdmins =
    hasPermission(admin, "CREATE_ADMIN") ||
    hasPermission(admin, "EDIT_ADMIN") ||
    hasPermission(admin, "DELETE_ADMIN")
  const canViewAllLeads = hasPermission(admin, "VIEW_ALL_LEADS")
  const isTeamWideActivity = canViewAllLeads || hasPermission(admin, "VIEW_REPORTS")

  const selectedStatus =
    resolvedSearchParams?.status &&
    STATUS_ORDER.includes(resolvedSearchParams.status)
      ? resolvedSearchParams.status
      : ""
  const selectedAssignedToId = resolvedSearchParams?.assignedToId?.trim() || ""
  const selectedCategoryId = resolvedSearchParams?.categoryId?.trim() || ""

  const leadWhere: Prisma.InquiryWhereInput = {
    ...leadAccessWhere(admin),
    createdAt: {
      gte: window.start,
      lt: window.end,
    },
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(selectedAssignedToId ? { assignedToId: selectedAssignedToId } : {}),
    ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
  }

  const [leads, categories, filterAdmins, leadActions] = await Promise.all([
    prisma.inquiry.findMany({
      where: leadWhere,
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
    }),
    prisma.leadCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    // Only admins who can see every lead get a meaningful "filter by admin"
    // dropdown — restricted admins only ever see their own leads anyway.
    canViewAllLeads
      ? prisma.admin.findMany({
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([{ id: admin.id, name: admin.name }]),
    // Team/self activity — sourced from the audit log, not current lead
    // state, so it reflects actual actions taken in the window.
    prisma.leadAction.findMany({
      where: {
        createdAt: { gte: window.start, lt: window.end },
        adminId: isTeamWideActivity ? { not: null } : admin.id,
      },
      select: { adminId: true, inquiryId: true, actionType: true },
    }),
  ])

  const totalAdmins = canManageAdmins ? await prisma.admin.count() : null
  const activeAdmins = canManageAdmins
    ? await prisma.admin.count({ where: { isActive: true } })
    : null

  const statusCounts = new Map<string, number>()
  const serviceCounts = new Map<string, number>()
  const adminCounts = new Map<string, number>()

  for (const status of STATUS_ORDER) {
    statusCounts.set(status, 0)
  }

  const trendBuckets = buildTrendBuckets(window.start, window.end, window.granularity)
  const trendCounts = new Map<string, number>(trendBuckets.map((b) => [b.key, 0]))

  for (const lead of leads) {
    incrementMap(statusCounts, lead.status ?? "NEW")
    incrementMap(serviceCounts, lead.service || "Unknown")
    incrementMap(adminCounts, lead.assignedTo?.name ?? "Unassigned")

    const bucketIndex = bucketIndexFor(lead.createdAt, window.start, window.granularity)
    if (bucketIndex >= 0 && bucketIndex < trendBuckets.length) {
      incrementMap(trendCounts, trendBuckets[bucketIndex].key)
    }
  }

  const converted = statusCounts.get("CONVERTED") ?? 0
  const openLeads = leads.filter(
    (lead) => !["CONVERTED", "LOST"].includes(lead.status ?? "NEW")
  ).length
  const totalValue = leads.reduce(
    (sum, lead) => sum + (lead.rewardValue ?? 0),
    0
  )

  // Aggregate actions-taken / leads-handled / assignments-made per admin,
  // straight from the LeadAction audit trail.
  const adminNameById = new Map(filterAdmins.map((a) => [a.id, a.name]))
  const activityByAdmin = new Map<
    string,
    { actionsCount: number; leadIds: Set<string>; assignmentsCount: number }
  >()

  for (const action of leadActions) {
    if (!action.adminId) continue
    const entry =
      activityByAdmin.get(action.adminId) ??
      { actionsCount: 0, leadIds: new Set<string>(), assignmentsCount: 0 }

    entry.actionsCount += 1
    entry.leadIds.add(action.inquiryId)
    if (action.actionType === "ASSIGNMENT") entry.assignmentsCount += 1

    activityByAdmin.set(action.adminId, entry)
  }

  const teamActivity = Array.from(activityByAdmin.entries())
    .map(([adminId, entry]) => ({
      adminId,
      adminName: adminNameById.get(adminId) ?? "Unknown Admin",
      actionsCount: entry.actionsCount,
      leadsHandled: entry.leadIds.size,
      assignmentsCount: entry.assignmentsCount,
    }))
    .sort((a, b) => b.actionsCount - a.actionsCount)
    .slice(0, 8)

  const data: DashboardData = {
    role: admin.role,
    selectedMonth: window.monthValue,
    selectedRangeLabel: window.label,
    trendGranularity: window.granularity,
    isTeamWideActivity,
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
    trend: trendBuckets.map((bucket) => ({
      label: bucket.label,
      value: trendCounts.get(bucket.key) ?? 0,
    })),
    topServices: Array.from(serviceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value })),
    adminPerformance: Array.from(adminCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value })),
    teamActivity,
    latestLeads: leads.slice(0, 6).map((lead) => ({
      id: lead.id,
      name: lead.name,
      service: lead.service,
      status: lead.status ?? "NEW",
      value: lead.rewardValue ?? null,
      createdAt: lead.createdAt.toISOString(),
    })),
    filters: {
      range: selectedRange,
      statuses: STATUS_ORDER,
      categories: categories.map((c) => ({ id: c.id, name: c.name })),
      admins: filterAdmins.map((a) => ({ id: a.id, name: a.name })),
      selectedStatus,
      selectedAssignedToId,
      selectedCategoryId,
    },
  }

  return <DashboardClient data={data} />
}