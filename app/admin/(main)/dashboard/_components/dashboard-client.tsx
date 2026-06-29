"use client"

import {
  ArrowUpRight,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardList,
  LineChart,
  ShieldCheck,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type ChartPoint = {
  label: string
  value: number
}

export type DashboardData = {
  role: string
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
  weeklyTrend: ChartPoint[]
  topServices: ChartPoint[]
  adminPerformance: ChartPoint[]
  latestLeads: Array<{
    id: string
    name: string
    service: string
    status: string
    value: number | null
    createdAt: string
  }>
}

type DashboardClientProps = {
  data: DashboardData
}

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
    currency: "USD",
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
      {points.map((point) => (
        <div key={point.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium">
              {point.label.replace("_", " ")}
            </span>
            <span className="text-muted-foreground">{point.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${colors ? (statusTones[point.label] ?? "bg-primary") : "bg-primary"}`}
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

  return (
    <div className="flex h-56 items-end gap-3 rounded-lg border bg-muted/20 p-4">
      {points.map((point) => (
        <div
          key={point.label}
          className="flex h-full flex-1 flex-col justify-end gap-2"
        >
          <div
            className="min-h-2 rounded-t-md bg-primary transition-all"
            style={{ height: `${Math.max(6, (point.value / max) * 100)}%` }}
          />
          <div className="text-center text-[11px] text-muted-foreground">
            {point.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardClient({ data }: DashboardClientProps) {
  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pt-4 pb-6 sm:flex-row sm:items-center lg:px-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">{data.role.replace("_", " ")}</Badge>
            <Badge className="gap-1" variant="secondary">
              <ArrowUpRight className="h-3 w-3" />
              {data.stats.conversionRate}% conversion
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            LMS Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Lead pipeline, conversion, team load, and service demand.
          </p>
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
          title="Pipeline Value"
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Lead Trend
            </CardTitle>
            <CardDescription>
              Weekly lead creation across the visible pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendBars points={data.weeklyTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Status Mix
            </CardTitle>
            <CardDescription>
              Where leads currently sit in the pipeline.
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
              Most requested services from visible leads.
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
            <CardDescription>Lead count by assigned admin.</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList points={data.adminPerformance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Leads</CardTitle>
            <CardDescription>
              Newest visible leads in the pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.latestLeads.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No leads yet.
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
    </div>
  )
}
