"use client"

import { type ColumnDef } from "@tanstack/react-table"
import {
  Edit,
  FileText,
  History,
  MoreHorizontal,
  PhoneCall,
  Trash2,
  UserRoundCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ReusableDataTable,
  type FilterConfig,
} from "@/components/data-table/data-table"
import { formatDate } from "@/lib/format"
import { LEAD_STATUSES, type LeadStatus } from "@/lib/validations/admin-lead"
import type {
  AdminOption,
  LeadCategoryOption,
  LeadRowData,
} from "./leads-client"

type LeadsTableProps = {
  leads: LeadRowData[]
  admins: AdminOption[]
  permissions: {
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canAssign: boolean
    canExport: boolean
  }
  disabled: boolean
  onEdit: (lead: LeadRowData) => void
  onDelete: (lead: LeadRowData) => void
  onStatus: (lead: LeadRowData) => void
  onAction: (lead: LeadRowData) => void
  onTimeline: (lead: LeadRowData) => void
  onAssign: (lead: LeadRowData, assignedToId: string) => void
  onQuickStatus: (lead: LeadRowData, status: LeadStatus) => void
  onReassign: (lead: LeadRowData) => void
  categories: LeadCategoryOption[]
  onCategoryChange: (lead: LeadRowData, categoryId: string) => void
}

const statusClassName: Record<string, string> = {
  NEW: "bg-sky-100 text-sky-700 border-sky-200",
  CONTACTED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  QUALIFIED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  FOLLOW_UP: "bg-amber-100 text-amber-800 border-amber-200",
  CONVERTED: "bg-green-100 text-green-700 border-green-200",
  LOST: "bg-rose-100 text-rose-700 border-rose-200",
}

export function LeadsTable({
  leads,
  admins,
  permissions,
  disabled,
  onEdit,
  onDelete,
  onStatus,
  onAction,
  onTimeline,
  onAssign,
  onQuickStatus,
  onReassign,
  categories,
  onCategoryChange,
}: LeadsTableProps) {
  const filters: FilterConfig[] = [
    {
      columnId: "status",
      label: "Status",
      options: LEAD_STATUSES.map((status) => ({
        label: status.replace("_", " "),
        value: status,
      })),
    },
    {
      columnId: "assignedToName",
      label: "Assigned To",
      options: Array.from(
        new Set(leads.map((lead) => lead.assignedToName))
      ).map((name) => ({
        label: name,
        value: name,
      })),
    },
    {
      columnId: "categoryName",
      label: "Category",
      options: Array.from(
        new Set(leads.map((l) => l.categoryName).filter(Boolean))
      ).map((name) => ({ label: name, value: name })),
    },
  ]

  const columns: ColumnDef<LeadRowData>[] = [
    {
      accessorKey: "name",
      header: "Lead",
      cell: ({ row }) => (
        <div className="flex min-w-52 flex-col gap-0.5">
          <span className="font-semibold text-foreground">
            {row.original.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.email}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.phone}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "service",
      header: "Service",
      cell: ({ row }) => (
        <div className="max-w-48 truncate font-medium">
          {row.original.service}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        permissions.canEdit ? (
          <Select
            disabled={disabled}
            value={row.original.status}
            onValueChange={(value) =>
              onQuickStatus(row.original, value as LeadStatus)
            }
          >
            <SelectTrigger className="h-8 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge
            className={statusClassName[row.original.status] ?? ""}
            variant="outline"
          >
            {row.original.status.replace("_", " ")}
          </Badge>
        ),
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) =>
        permissions.canEdit ? (
          <Select
            disabled={disabled}
            value={row.original.categoryId || "none"}
            onValueChange={(value) =>
              onCategoryChange(row.original, value === "none" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-36">
              <SelectValue placeholder="Uncategorized" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Uncategorized</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : row.original.categoryName ? (
          <Badge
            variant="outline"
            style={{ borderColor: row.original.categoryColor ?? undefined }}
          >
            {row.original.categoryName}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      accessorKey: "assignedToName",
      header: "Assigned",
      cell: ({ row }) =>
        permissions.canAssign ? (
          <Select
            disabled={disabled}
            value={row.original.assignedToId || "unassigned"}
            onValueChange={(value) =>
              onAssign(row.original, value === "unassigned" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {admins.map((admin) => (
                <SelectItem key={admin.id} value={admin.id}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm">{row.original.assignedToName}</span>
        ),
    },
    {
      accessorKey: "rewardValue",
      header: "Value",
      cell: ({ row }) =>
        row.original.rewardValue == null ? (
          <span className="text-muted-foreground">-</span>
        ) : (
          <span className="font-medium">
            ${row.original.rewardValue.toFixed(2)}
          </span>
        ),
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => row.original.source || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Lead Actions</DropdownMenuLabel>
            {permissions.canEdit && (
              <>
                <DropdownMenuItem onClick={() => onTimeline(row.original)}>
                  <History className="mr-2 h-4 w-4" />
                  View timeline
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatus(row.original)}>
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Update status
                </DropdownMenuItem>
                {permissions.canAssign && (
                  <DropdownMenuItem onClick={() => onReassign(row.original)}>
                    <UserRoundCheck className="mr-2 h-4 w-4" />
                    Reassign for recheck
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => onAction(row.original)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Add note
                </DropdownMenuItem>
              </>
            )}
            {!permissions.canEdit && (
              <DropdownMenuItem onClick={() => onTimeline(row.original)}>
                <History className="mr-2 h-4 w-4" />
                View timeline
              </DropdownMenuItem>
            )}
            {permissions.canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(row.original)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete lead
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="rounded-lg border bg-card">
      <ReusableDataTable
        data={leads}
        columns={columns}
        searchableColumns={["name", "email", "phone", "service", "source"]}
        searchPlaceholder="Search leads..."
        filterConfigs={filters}
        enableExport={permissions.canExport}
        exportFileName="leads.csv"
        emptyStateMessage="No leads found"
        emptyStateDescription="Create a lead or adjust the current filters."
      />
    </div>
  )
}
