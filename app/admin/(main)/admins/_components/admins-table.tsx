"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
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
  ReusableDataTable,
  type FilterConfig,
} from "@/components/data-table/data-table"
import { formatDate } from "@/lib/format"
import { PERMISSION_LABELS } from "@/lib/admin/permission-constants"
import type { AdminRowData } from "./admins-client"

type AdminsTableProps = {
  admins: AdminRowData[]
  currentAdminId: string
  permissions: {
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
  }
  disabled: boolean
  onEdit: (admin: AdminRowData) => void
  onDelete: (admin: AdminRowData) => void
}

export function AdminsTable({
  admins,
  currentAdminId,
  permissions,
  disabled,
  onEdit,
  onDelete,
}: AdminsTableProps) {
  const filters: FilterConfig[] = [
    {
      columnId: "role",
      label: "Role",
      options: [
        { label: "Super Admin", value: "SUPER_ADMIN" },
        { label: "Manager", value: "MANAGER" },
        { label: "Sales", value: "SALES" },
      ],
    },
    {
      columnId: "isActive",
      label: "Status",
      type: "boolean",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ]

  const columns: ColumnDef<AdminRowData>[] = [
    {
      accessorKey: "name",
      header: "Admin",
      cell: ({ row }) => (
        <div className="flex min-w-52 flex-col gap-0.5">
          <span className="font-semibold text-foreground">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={row.original.role === "SUPER_ADMIN" ? "default" : "outline"}>
          {String(row.original.role).replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "outline" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "assignedLeadCount",
      header: "Assigned Leads",
      cell: ({ row }) => row.original.assignedLeadCount,
    },
    {
      id: "permissionsText",
      header: "Permissions",
      accessorFn: (row) =>
        row.role === "SUPER_ADMIN"
          ? "All permissions"
          : row.permissions.map((permission) => PERMISSION_LABELS[permission]).join(", "),
      cell: ({ row }) => (
        <div className="max-w-80 truncate text-sm text-muted-foreground">
          {row.original.role === "SUPER_ADMIN"
            ? "All permissions"
            : row.original.permissions.length > 0
              ? row.original.permissions.map((permission) => PERMISSION_LABELS[permission]).join(", ")
              : "No permissions"}
        </div>
      ),
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
            <Button variant="ghost" size="icon" disabled={disabled}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
            {permissions.canEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit admin
              </DropdownMenuItem>
            )}
            {permissions.canDelete && row.original.id !== currentAdminId && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(row.original)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete admin
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
        data={admins}
        columns={columns}
        searchableColumns={["name", "email", "role"]}
        filterConfigs={filters}
        searchPlaceholder="Search admins..."
        emptyStateMessage="No admins found"
        emptyStateDescription="Create an admin to start delegating lead work."
      />
    </div>
  )
}
