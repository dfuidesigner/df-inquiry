"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { CalendarRange, Eye, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ReusableDataTable,
  type FilterConfig,
} from "@/components/data-table/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDateTime } from "@/lib/format"

export type ActivityRow = {
  id: string
  actionType: string
  outcome: string
  note: string
  metadata: {
    changes?: Array<{
      field: string
      label: string
      from: unknown
      to: unknown
    }>
  } | null
  createdAt: string
  adminId: string
  adminName: string
  leadId: string
  leadName: string
  leadEmail: string
  leadPhone: string
}

type ActivityClientProps = {
  rows: ActivityRow[]
  admins: Array<{ id: string; name: string }>
  from: string
  to: string
}

const ACTION_LABELS: Record<string, string> = {
  LEAD_CREATED: "Lead Created",
  LEAD_UPDATED: "Lead Updated",
  STATUS_UPDATE: "Status Updated",
  ASSIGNMENT: "Assignment",
  CATEGORY_UPDATE: "Category Updated",
}

const ACTION_TONES: Record<string, string> = {
  LEAD_CREATED: "border-slate-200 bg-slate-50 text-slate-700",
  LEAD_UPDATED: "border-amber-200 bg-amber-50 text-amber-700",
  STATUS_UPDATE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ASSIGNMENT: "border-blue-200 bg-blue-50 text-blue-700",
  CATEGORY_UPDATE: "border-violet-200 bg-violet-50 text-violet-700",
}

export function ActivityClient({
  rows,
  admins,
  from,
  to,
}: ActivityClientProps) {
  const router = useRouter()
  const [detailRow, setDetailRow] = useState<ActivityRow | null>(null)

  function applyRange(nextFrom: string, nextTo: string) {
    router.push(`/admin/activity?from=${nextFrom}&to=${nextTo}`)
  }

  const filters: FilterConfig[] = [
    {
      columnId: "actionType",
      label: "Action",
      options: Object.entries(ACTION_LABELS).map(([value, label]) => ({
        label,
        value,
      })),
    },
    {
      columnId: "adminName",
      label: "Admin",
      options: admins.map((a) => ({ label: a.name, value: a.name })),
    },
  ]

  const columns: ColumnDef<ActivityRow>[] = [
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "adminName",
      header: "Admin",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.adminName}</span>
      ),
    },
    {
      accessorKey: "actionType",
      header: "Action",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={ACTION_TONES[row.original.actionType] ?? ""}
        >
          {ACTION_LABELS[row.original.actionType] ??
            row.original.actionType.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "leadName",
      header: "Lead",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.leadName}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.leadEmail}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "outcome",
      header: "Outcome",
      cell: ({ row }) => row.original.outcome.replace(/_/g, " "),
    },
    {
      id: "note",
      header: "Note",
      cell: ({ row }) => (
        <span
          className="block max-w-72 truncate text-sm text-muted-foreground"
          title={row.original.note}
        >
          {row.original.note}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDetailRow(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pt-4 pb-6 sm:flex-row sm:items-center lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Activity Log
            </h1>
            <p className="text-sm text-muted-foreground">
              Every action taken by every admin on every lead, fully auditable.
            </p>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              defaultValue={from}
              onChange={(e) => applyRange(e.target.value, to)}
              className="w-40"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              defaultValue={to}
              onChange={(e) => applyRange(from, e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <div className="rounded-lg border bg-card">
          <ReusableDataTable
            data={rows}
            columns={columns}
            searchableColumns={[
              "leadName",
              "leadEmail",
              "leadPhone",
              "adminName",
              "note",
            ]}
            searchPlaceholder="Search activity..."
            filterConfigs={filters}
            defaultPageSize={20}
            emptyStateMessage="No activity in this range"
            emptyStateDescription="Try widening the date range or clearing filters."
          />
        </div>
      </div>

      <Dialog
        open={!!detailRow}
        onOpenChange={(open) => !open && setDetailRow(null)}
      >
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Activity Detail
            </DialogTitle>
            <DialogDescription>
              {detailRow &&
                `${detailRow.adminName} · ${formatDateTime(detailRow.createdAt)}`}
            </DialogDescription>
          </DialogHeader>

          {detailRow && (
            <div className="space-y-4">
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{detailRow.leadName}</p>
                <p className="text-muted-foreground">
                  {detailRow.leadEmail} · {detailRow.leadPhone}
                </p>
              </div>

              <p className="text-sm whitespace-pre-line">{detailRow.note}</p>

              {detailRow.metadata?.changes &&
                detailRow.metadata.changes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Field changes
                    </p>
                    <div className="space-y-1.5">
                      {detailRow.metadata.changes.map((change) => (
                        <div
                          key={change.field}
                          className="rounded-md border p-2 text-sm"
                        >
                          <span className="font-medium">{change.label}: </span>
                          <span className="text-muted-foreground line-through">
                            {String(change.from ?? "—")}
                          </span>
                          {" → "}
                          <span>{String(change.to ?? "—")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
