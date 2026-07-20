"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowRightCircle, CheckCircle2, MoreHorizontal, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ReusableDataTable, type FilterConfig } from "@/components/data-table/data-table"
import { formatDate } from "@/lib/format"
import type { ProspectCategoryOption, ProspectRowData } from "./prospects-client"

type ProspectsTableProps = {
  prospects: ProspectRowData[]
  categories: ProspectCategoryOption[]
  canManage: boolean
  disabled: boolean
  onCategoryChange: (prospect: ProspectRowData, categoryId: string) => void
  onConvert: (prospect: ProspectRowData) => void
  onDelete: (prospect: ProspectRowData) => void
  onBulkDeleteRequest: (ids: string[], clearSelection: () => void) => void
}

export function ProspectsTable({
  prospects,
  categories,
  canManage,
  disabled,
  onCategoryChange,
  onConvert,
  onDelete,
  onBulkDeleteRequest,
}: ProspectsTableProps) {
  const filters: FilterConfig[] = [
    {
      columnId: "categoryName",
      label: "Category",
      options: Array.from(new Set(prospects.map((p) => p.categoryName).filter(Boolean))).map((name) => ({
        label: name,
        value: name,
      })),
    },
    {
      columnId: "conversionStatus",
      label: "Status",
      options: [
        { label: "Converted", value: "Converted" },
        { label: "Not converted", value: "Not converted" },
      ],
    },
  ]

  const columns: ColumnDef<ProspectRowData>[] = [
    {
      accessorKey: "name",
      header: "Prospect",
      cell: ({ row }) => (
        <div className="flex min-w-52 flex-col gap-0.5">
          <span className="font-semibold text-foreground">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
          <span className="text-xs text-muted-foreground">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) =>
        canManage ? (
          <Select
            disabled={disabled || row.original.isConverted}
            value={row.original.categoryId || "none"}
            onValueChange={(value) => onCategoryChange(row.original, value === "none" ? "" : value)}
          >
            <SelectTrigger className="h-8 w-40"><SelectValue placeholder="Uncategorized" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Uncategorized</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : row.original.categoryName ? (
          <Badge variant="outline" style={{ borderColor: row.original.categoryColor ?? undefined }}>
            {row.original.categoryName}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      id: "conversionStatus",
      header: "Status",
      accessorFn: (row) => (row.isConverted ? "Converted" : "Not converted"),
      cell: ({ row }) =>
        row.original.isConverted ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700" variant="outline">
                <CheckCircle2 className="h-3 w-3" /> Converted
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Converted to lead &quot;{row.original.convertedLeadName}&quot; by {row.original.convertedByName}
              {row.original.convertedAt && ` on ${formatDate(row.original.convertedAt)}`}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Badge variant="outline">Not converted</Badge>
        ),
    },
    {
      id: "note",
      header: "Note",
      cell: ({ row }) => {
        const note = row.original.note
        if (!note) return <span className="text-muted-foreground">-</span>
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-56 cursor-default truncate text-sm text-muted-foreground">{note}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-80 whitespace-pre-line">{note}</TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Imported",
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span>{formatDate(row.original.createdAt)}</span>
          {row.original.importedByName && (
            <span className="text-xs text-muted-foreground">by {row.original.importedByName}</span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) =>
        canManage ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Prospect Actions</DropdownMenuLabel>
              {!row.original.isConverted && (
                <DropdownMenuItem onClick={() => onConvert(row.original)}>
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  Convert to Lead
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(row.original)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null,
    },
  ]

  return (
    <div className="rounded-lg border bg-card">
      <ReusableDataTable
        data={prospects}
        columns={columns}
        searchableColumns={["name", "email", "phone"]}
        searchPlaceholder="Search prospects..."
        filterConfigs={filters}
        emptyStateMessage="No prospects yet"
        emptyStateDescription="Import a CSV or Excel file to get started."
        bulkActions={
          canManage
            ? (selectedRows, clearSelection) => (
                <>
                  <span className="text-sm font-medium">{selectedRows.length} selected</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => onBulkDeleteRequest(selectedRows.map((r) => r.id), clearSelection)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>Clear selection</Button>
                </>
              )
            : undefined
        }
      />
    </div>
  )
}