"use client"

import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  LineChart,
  ShieldCheck,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type ChartPoint = {
  label: string
  value: number
}

export type TeamActivityRow = {
  adminId: string
  adminName: string
  actionsCount: number
  leadsHandled: number
  assignmentsCount: number
}

export type DashboardData = {
  role: string
  selectedMonth: string
  selectedRangeLabel: string
  trendGranularity: "hour" | "day"
  isTeamWideActivity: boolean
  stats: {
    totalLeads: number
    openLeads: number
    convertedLeads: number
    conversionRate: number
    totalValue: number
    totalAdmins: number | null
    activeAdmins: number | null
  }
  statusDistribution: ChartPoint[]
  trend: ChartPoint[]
  topServices: ChartPoint[]
  adminPerformance: ChartPoint[]
  teamActivity: TeamActivityRow[]
  latestLeads: Array<{
    id: string
    name: string
    service: string
    status: string
    value: number | null
    createdAt: string
  }>
  filters: {
    range: string
    statuses: string[]
    categories: Array<{ id: string; name: string }>
    admins: Array<{ id: string; name: string }>
    selectedStatus: string
    selectedAssignedToId: string
    selectedCategoryId: string
  }
}

type DashboardClientProps = {
  data: DashboardData
}

const RANGE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "month", label: "Custom Month" },
]

const statusTones: Record<string, string> = {
  NEW: "bg-sky-500",
  CONTACTED: "bg-indigo-500",
  QUALIFIED: "bg-emerald-500",
  FOLLOW_UP: "bg-amber-500",
  CONVERTED: "bg-green-500",
  LOST: "bg-rose-500",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function maxValue(points: ChartPoint[]) {
  return Math.max(1, ...points.map((point) => point.value))
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

const chartColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500",
]

function BarList({
  points,
  colors = false,
}: {
  points: ChartPoint[]
  colors?: boolean
}) {
  const max = maxValue(points)

  return (
    <div className="space-y-4">
      {points.map((point, index) => (
        <div key={point.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium">
              {point.label.replace("_", " ")}
            </span>
            <span className="text-muted-foreground">{point.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                colors
                  ? (statusTones[point.label] ??
                    chartColors[index % chartColors.length])
                  : chartColors[index % chartColors.length]
              }`}
              style={{ width: `${Math.max(4, (point.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function TrendBars({ points }: { points: ChartPoint[] }) {
  const max = maxValue(points)
  // Show every label if there aren't many buckets (hourly view), otherwise
  // thin them out so a 30-day view doesn't cram 30 overlapping labels.
  const labelInterval = points.length <= 12 ? 1 : Math.ceil(points.length / 8)

  return (
    <div className="flex h-full min-h-56 items-end gap-1 rounded-lg border bg-muted/20 p-4">
      {points.map((point, index) => {
        const showLabel =
          index === 0 ||
          index === points.length - 1 ||
          index % labelInterval === 0

        return (
          <div
            key={`${point.label}-${index}`}
            className="flex h-full min-w-2 flex-1 flex-col justify-end gap-2"
          >
            <div
              className="min-h-1 rounded-t-sm bg-blue-900 transition-all"
              style={{ height: `${Math.max(4, (point.value / max) * 100)}%` }}
              title={`${point.value} leads — ${point.label}`}
            />
            <div className="h-4 text-center text-[10px] text-muted-foreground">
              {showLabel ? point.label : ""}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function DashboardClient({ data }: DashboardClientProps) {
  const router = useRouter()
  const { filters } = data

  function buildQuery(
    overrides: Partial<{
      range: string
      month: string
      status: string
      assignedToId: string
      categoryId: string
    }>
  ) {
    const nextRange = overrides.range ?? filters.range
    const nextMonth = overrides.month ?? data.selectedMonth
    const nextStatus = overrides.status ?? filters.selectedStatus
    const nextAssignedToId =
      overrides.assignedToId ?? filters.selectedAssignedToId
    const nextCategoryId = overrides.categoryId ?? filters.selectedCategoryId

    const params = new URLSearchParams()
    params.set("range", nextRange)
    if (nextRange === "month" && nextMonth) params.set("month", nextMonth)
    if (nextStatus) params.set("status", nextStatus)
    if (nextAssignedToId) params.set("assignedToId", nextAssignedToId)
    if (nextCategoryId) params.set("categoryId", nextCategoryId)

    return `/admin/dashboard?${params.toString()}`
  }

  function handleRangeChange(range: string) {
    router.push(buildQuery({ range }))
  }

  function handleMonthChange(month: string) {
    if (!month) return
    router.push(buildQuery({ range: "month", month }))
  }

  function handleStatusChange(status: string) {
    router.push(buildQuery({ status: status === "all" ? "" : status }))
  }

  function handleAdminChange(assignedToId: string) {
    router.push(
      buildQuery({ assignedToId: assignedToId === "all" ? "" : assignedToId })
    )
  }

  function handleCategoryChange(categoryId: string) {
    router.push(
      buildQuery({ categoryId: categoryId === "all" ? "" : categoryId })
    )
  }

  function resetToCurrentMonth() {
    router.push("/admin/dashboard?range=month")
  }

  function clearFilters() {
    router.push(buildQuery({ status: "", assignedToId: "", categoryId: "" }))
  }

  const hasActiveFilters =
    !!filters.selectedStatus ||
    !!filters.selectedAssignedToId ||
    !!filters.selectedCategoryId

  const trendHeading = data.trendGranularity === "hour" ? "Hourly" : "Daily"

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col gap-4 border-b px-4 pt-4 pb-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{data.role.replace("_", " ")}</Badge>
              <Badge className="gap-1" variant="secondary">
                <ArrowUpRight className="h-3 w-3" />
                {data.stats.conversionRate}% conversion
              </Badge>
              <Badge className="gap-1" variant="secondary">
                <CalendarDays className="h-3 w-3" />
                {data.selectedRangeLabel}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              LMS Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Lead pipeline, conversion, team load, and service demand for the
              selected period.
            </p>
          </div>
        </div>

        {/* Date range presets — always visible, no click required to reveal */}
        <div className="flex flex-wrap items-center gap-2">
          {RANGE_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              type="button"
              size="sm"
              variant={filters.range === preset.value ? "default" : "outline"}
              onClick={() => handleRangeChange(preset.value)}
            >
              {preset.label}
            </Button>
          ))}

          {filters.range === "month" && (
            <div className="ml-2 flex items-center gap-2">
              <Input
                id="dashboard-month"
                type="month"
                value={data.selectedMonth}
                onChange={(event) => handleMonthChange(event.target.value)}
                className="h-9 w-40"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetToCurrentMonth}
              >
                Current Month
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/20 p-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select
              value={filters.selectedStatus || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="h-9 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {filters.statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Assigned Admin
            </Label>
            <Select
              value={filters.selectedAssignedToId || "all"}
              onValueChange={handleAdminChange}
            >
              <SelectTrigger className="h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admins</SelectItem>
                {filters.admins.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select
              value={filters.selectedCategoryId || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-9 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {filters.categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-8 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={String(data.stats.totalLeads)}
          subtitle={`${data.stats.openLeads} open leads`}
          icon={ClipboardList}
        />
        <StatCard
          title="Converted"
          value={String(data.stats.convertedLeads)}
          subtitle={`${data.stats.conversionRate}% conversion rate`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Expected Budget"
          value={formatCurrency(data.stats.totalValue)}
          subtitle="Total reward value"
          icon={BadgeDollarSign}
        />
        <StatCard
          title="Admins"
          value={
            data.stats.totalAdmins == null
              ? "Limited"
              : `${data.stats.activeAdmins}/${data.stats.totalAdmins}`
          }
          subtitle="Active admin accounts"
          icon={ShieldCheck}
        />
      </div>

      <div className="grid gap-6 px-4 lg:px-8 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              {trendHeading} Lead Trend
            </CardTitle>
            <CardDescription>
              {trendHeading} lead creation for {data.selectedRangeLabel}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <TrendBars points={data.trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Status Mix
            </CardTitle>
            <CardDescription>
              Lead statuses for {data.selectedRangeLabel}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarList points={data.statusDistribution} colors />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 px-4 lg:px-8 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>
              Most requested services for {data.selectedRangeLabel}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarList points={data.topServices} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Assigned Load
            </CardTitle>
            <CardDescription>
              Lead count by assigned admin for {data.selectedRangeLabel}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarList points={data.adminPerformance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Leads</CardTitle>
            <CardDescription>
              Newest visible leads in this period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.latestLeads.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No leads for this period.
              </div>
            ) : (
              data.latestLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.service}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {lead.status.replace("_", " ")}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {data.isTeamWideActivity ? "Team Activity" : "Your Activity"}
            </CardTitle>
            <CardDescription>
              Actions logged, leads touched, and assignments made for{" "}
              {data.selectedRangeLabel}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.teamActivity.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No activity logged for this period.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead className="text-right">Actions Taken</TableHead>
                    <TableHead className="text-right">Leads Handled</TableHead>
                    <TableHead className="text-right">
                      Assignments Made
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.teamActivity.map((row) => (
                    <TableRow key={row.adminId}>
                      <TableCell className="font-medium">
                        {row.adminName}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.actionsCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.leadsHandled}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.assignmentsCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
