"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Edit, Timer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ReusableDataTable,
  type FilterConfig,
} from "@/components/data-table/data-table"
import type { TaskRowData } from "./tasks-client"

type TasksTableProps = {
  tasks: TaskRowData[]
  currentAdminId: string
  isSuperAdmin: boolean
  onEdit: (task: TaskRowData) => void
}

function typeLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function statusTone(status: string) {
  if (status === "DONE")
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (status === "IN_PROGRESS")
    return "border-blue-200 bg-blue-50 text-blue-700"
  return "border-amber-200 bg-amber-50 text-amber-700"
}

export function TasksTable({
  tasks,
  currentAdminId,
  isSuperAdmin,
  onEdit,
}: TasksTableProps) {
  const filters: FilterConfig[] = [
    {
      columnId: "taskType",
      label: "Task Type",
      options: Array.from(
        new Set(tasks.map((task) => String(task.taskType)))
      ).map((type) => ({ label: typeLabel(type), value: type })),
    },
    {
      columnId: "status",
      label: "Status",
      options: Array.from(
        new Set(tasks.map((task) => String(task.status)))
      ).map((status) => ({ label: typeLabel(status), value: status })),
    },
    ...(isSuperAdmin
      ? [
          {
            columnId: "adminName",
            label: "Admin",
            options: Array.from(
              new Set(tasks.map((task) => task.adminName))
            ).map((name) => ({ label: name, value: name })),
          } satisfies FilterConfig,
        ]
      : []),
  ]

  const columns: ColumnDef<TaskRowData>[] = [
    {
      accessorKey: "taskType",
      id: "taskType",
      header: "Task",
      cell: ({ row }) => (
        <div className="flex min-w-72 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">
              {row.original.title}
            </span>
            <Badge variant="outline">
              {typeLabel(String(row.original.taskType))}
            </Badge>
          </div>
          <span className="line-clamp-2 text-xs text-muted-foreground">
            {row.original.description || "No extra details added"}
          </span>
          {row.original.outcome && (
            <span className="line-clamp-1 text-xs text-muted-foreground">
              Outcome: {row.original.outcome}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex min-w-44 flex-col gap-0.5">
          <span className="text-sm font-medium">
            {row.original.clientName || row.original.leadName || "No client"}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.clientPhone ||
              row.original.clientEmail ||
              row.original.leadService ||
              "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "adminName",
      header: "Admin",
      cell: ({ row }) => (
        <div className="flex min-w-40 flex-col gap-0.5">
          <span className="text-sm font-medium">{row.original.adminName}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.adminEmail}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={statusTone(String(row.original.status))}
          variant="outline"
        >
          {typeLabel(String(row.original.status))}
        </Badge>
      ),
    },
    {
      accessorKey: "durationMinutes",
      header: "Time",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <Timer className="h-4 w-4 text-muted-foreground" />
          {row.original.durationMinutes}m
        </div>
      ),
    },
    {
      accessorKey: "taskDate",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.taskDate),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) =>
        row.original.adminId === currentAdminId ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">View only</span>
        ),
    },
  ]

  return (
    <div className="rounded-lg border bg-card">
      <ReusableDataTable
        data={tasks}
        columns={columns}
        searchableColumns={[
          "title",
          "clientName",
          "clientPhone",
          "clientEmail",
          "description",
          "outcome",
          "adminName",
        ]}
        filterConfigs={filters}
        searchPlaceholder="Search tasks, clients, outcomes..."
        enableExport={isSuperAdmin}
        exportFileName="admin-tasks.csv"
        emptyStateMessage="No tasks found"
        emptyStateDescription="Add a task after completing a call, meeting, follow-up, or internal work."
      />
    </div>
  )
}
