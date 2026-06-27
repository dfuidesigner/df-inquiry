"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export interface FilterConfig {
  columnId: string
  label: string
  options: Array<{ label: string; value: string }>
  type?: "select" | "boolean" | "month"
}

export interface DataTableConfig<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  searchPlaceholder?: string
  searchableColumns?: (keyof TData)[]
  filterConfigs?: FilterConfig[]
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableExport?: boolean
  exportFileName?: string
  defaultPageSize?: number
  pageSizeOptions?: number[]
  toolbarActions?: React.ReactNode
  initialSorting?: SortingState
  emptyStateMessage?: string
  emptyStateDescription?: string
}

export function ReusableDataTable<TData extends Record<string, unknown>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchableColumns = [],
  filterConfigs = [],
  enableRowSelection = true,
  enableColumnVisibility = true,
  enableExport = false,
  exportFileName = "export.csv",
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  toolbarActions,
  initialSorting = [],
  emptyStateMessage = "No results found",
  emptyStateDescription = "Try adjusting your search or filters",
}: DataTableConfig<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const tableColumns: ColumnDef<TData>[] = enableRowSelection
    ? [
        {
          id: "select",
          header: ({ table }) => (
            <div className="px-1">
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
                className="border-gray-300"
              />
            </div>
          ),
          cell: ({ row }) => (
            <div className="px-1">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="border-gray-300"
              />
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
          size: 50,
        },
        ...columns,
      ]
    : columns

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase()
      return searchableColumns.some((column) => {
        const value = row.original[column]
        return value != null && String(value).toLowerCase().includes(search)
      })
    },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  })

  const clearAllFilters = () => {
    setGlobalFilter("")
    filterConfigs.forEach((config) => {
      table.getColumn(config.columnId)?.setFilterValue("")
    })
  }

  const hasActiveFilters =
    globalFilter !== "" ||
    filterConfigs.some(
      (config) =>
        table.getColumn(config.columnId)?.getFilterValue() !== undefined
    )

  const handleExportCSV = () => {
    const rowsToExport =
      table.getFilteredSelectedRowModel().rows.length > 0
        ? table.getFilteredSelectedRowModel().rows
        : table.getFilteredRowModel().rows

    if (rowsToExport.length === 0) return

    const firstRowData = rowsToExport[0].original
    const headers = Object.keys(firstRowData) as Array<keyof TData>

    const csvRows = rowsToExport.map((row) => {
      return headers
        .map((header) => {
          const value = row.original[header]
          const stringValue = String(value ?? "").replace(/"/g, '""')
          return `"${stringValue}"`
        })
        .join(",")
    })

    const csvContent = [headers.join(","), ...csvRows].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", exportFileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="border-gray-300 pl-9 focus:border-primary"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="border-gray-300"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">{toolbarActions}</div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4">
        {filterConfigs.map((filterConfig) => (
          <div key={filterConfig.columnId} className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-600">
              {filterConfig.label}
            </Label>

            {filterConfig.type === "month" ? (
              <Input
                type="month"
                className="h-9 w-45 border-gray-300"
                value={
                  (table
                    .getColumn(filterConfig.columnId)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(e) => {
                  table
                    .getColumn(filterConfig.columnId)
                    ?.setFilterValue(e.target.value || "")
                }}
              />
            ) : (
              <Select
                value={
                  (table
                    .getColumn(filterConfig.columnId)
                    ?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) => {
                  const column = table.getColumn(filterConfig.columnId)
                  if (filterConfig.type === "boolean") {
                    column?.setFilterValue(
                      value === "all" ? "" : value === "true"
                    )
                  } else {
                    column?.setFilterValue(value === "all" ? "" : value)
                  }
                }}
              >
                <SelectTrigger className="h-9 w-45 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filterConfig.label}</SelectItem>
                  {filterConfig.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
        <div className="mt-5 flex items-end gap-2">
          {/* Column Visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-300">
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2">
                  <p className="mb-2 text-sm font-medium">Customize Columns</p>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {enableExport && (
            <Button
              variant="outline"
              className="border-gray-300"
              onClick={handleExportCSV}
              disabled={table.getFilteredRowModel().rows.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {table.getFilteredRowModel().rows.length}{" "}
          {table.getFilteredRowModel().rows.length === 1 ? "result" : "results"}{" "}
          found
        </div>
        {enableRowSelection &&
          table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="text-sm font-medium text-primary">
              {table.getFilteredSelectedRowModel().rows.length} selected
            </div>
          )}
      </div>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <p className="text-sm font-medium">{emptyStateMessage}</p>
                    <p className="text-xs">{emptyStateDescription}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-600">Rows per page</Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-25 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="text-sm text-gray-600">
            Showing{" "}
            {table.getFilteredRowModel().rows.length === 0
              ? 0
              : table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">
              Page{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of <span className="font-medium">{table.getPageCount()}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="cursor-pointer border-gray-300"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="cursor-pointer border-gray-300"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
