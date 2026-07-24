"use client"

import { type ColumnDef } from "@tanstack/react-table"
import {
  Edit,
  FileText,
  History,
  MoreHorizontal,
  PhoneCall,
  Repeat,
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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  onBulkDeleteRequest: (ids: string[], clearSelection: () => void) => void
  filterableStatuses: string[]
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
  filterableStatuses,
  onReassign,
  categories,
  onCategoryChange,
  onBulkDeleteRequest,
}: LeadsTableProps) {
  const filters: FilterConfig[] = [
    ...(filterableStatuses.length > 0
      ? [
          {
            columnId: "status",
            label: "Status",
            options: filterableStatuses.map((status) => ({
              label: status.replace("_", " "),
              value: status,
            })),
          },
        ]
      : []),
    {
      columnId: "duplicateStatus",
      label: "Duplicates",
      options: [
        { label: "Duplicates only", value: "Duplicate" },
        { label: "Unique leads", value: "Unique" },
      ],
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
    {
      columnId: "reassignmentBucket",
      label: "Reassigned",
      options: [
        { label: "Not reassigned", value: "Not reassigned" },
        { label: "Reassigned once", value: "Reassigned once" },
        { label: "Reassigned 2+ times", value: "Reassigned 2+ times" },
      ],
    },
  ]

  const columns: ColumnDef<LeadRowData>[] = [
    {
      accessorKey: "name",
      header: "Lead",
      cell: ({ row }) => (
        <div className="flex min-w-52 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">
              {row.original.name}
            </span>
            {row.original.duplicateCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="destructive"
                    className="h-5 px-1.5 text-[10px]"
                  >
                    ×{row.original.duplicateCount + 1}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  This email or phone number appears on{" "}
                  {row.original.duplicateCount} other lead
                  {row.original.duplicateCount === 1 ? "" : "s"}.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
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
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      accessorKey: "duplicateStatus",
      header: "Duplicates",
      cell: ({ row }) => row.original.duplicateStatus,
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
      accessorKey: "reassignmentBucket",
      header: "Reassigned",
      cell: ({ row }) => {
        const {
          reassignmentCount,
          lastReassignedFromName,
          lastReassignedToName,
          lastReassignedAt,
        } = row.original

        if (reassignmentCount === 0) {
          return <span className="text-muted-foreground">-</span>
        }

        const content = (
          <div className="flex items-center gap-1.5 text-sm">
            <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="whitespace-nowrap">
              {lastReassignedFromName || "Unassigned"} → {lastReassignedToName}
            </span>
            {reassignmentCount > 1 && (
              <Badge variant="secondary" className="px-1.5 text-[10px]">
                ×{reassignmentCount}
              </Badge>
            )}
          </div>
        )

        if (!lastReassignedAt) return content

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-fit cursor-default">{content}</div>
            </TooltipTrigger>
            <TooltipContent>
              Last reassigned {formatDate(lastReassignedAt)}
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      id: "lastNote",
      header: "Last Note",
      cell: ({ row }) => {
        const note = row.original.lastNote
        if (!note) {
          return <span className="text-muted-foreground">-</span>
        }

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-56 cursor-default truncate text-sm text-muted-foreground">
                {note}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-80 whitespace-pre-line">
              {note}
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "rewardValue",
      header: "Expected Budget",
      cell: ({ row }) =>
        row.original.rewardValue == null ? (
          <span className="text-muted-foreground">-</span>
        ) : (
          <span className="font-medium">
            ₹{row.original.rewardValue.toFixed(2)}
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
        bulkActions={
          permissions.canDelete
            ? (selectedRows, clearSelection) => (
                <>
                  <span className="text-sm font-medium">
                    {selectedRows.length} lead(s) selected
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() =>
                      onBulkDeleteRequest(
                        selectedRows.map((row) => row.id),
                        clearSelection
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear selection
                  </Button>
                </>
              )
            : undefined
        }
      />
    </div>
  )
}
