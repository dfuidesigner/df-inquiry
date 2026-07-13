"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ExternalLink, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ReusableDataTable,
  type FilterConfig,
} from "@/components/data-table/data-table"
import type { CareerSubmissionRow } from "./careers-client"

type CareersTableProps = {
  submissions: CareerSubmissionRow[]
  onReview: (submission: CareerSubmissionRow) => void
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function statusTone(status: string) {
  if (status === "HIRED") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (["SHORTLISTED", "INTERVIEW"].includes(status)) {
    return "border-blue-200 bg-blue-50 text-blue-700"
  }
  if (status === "REJECTED") return "border-rose-200 bg-rose-50 text-rose-700"
  return "border-slate-200 bg-slate-50 text-slate-700"
}

export function CareersTable({ submissions, onReview }: CareersTableProps) {
  const filters: FilterConfig[] = [
    {
      columnId: "status",
      label: "Status",
      options: Array.from(new Set(submissions.map((item) => item.status))).map(
        (status) => ({ label: status.replace("_", " "), value: status })
      ),
    },
    {
      columnId: "position",
      label: "Position",
      options: Array.from(new Set(submissions.map((item) => item.position))).map(
        (position) => ({ label: position, value: position })
      ),
    },
  ]

  const columns: ColumnDef<CareerSubmissionRow>[] = [
    {
      accessorKey: "name",
      header: "Candidate",
      cell: ({ row }) => (
        <div className="flex min-w-56 flex-col gap-0.5">
          <span className="font-semibold text-foreground">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
          <span className="text-xs text-muted-foreground">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <div className="flex min-w-48 flex-col gap-0.5">
          <span className="font-medium">{row.original.position}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.experienceYears ?? 0} years experience
          </span>
        </div>
      ),
    },
    {
      accessorKey: "currentCompany",
      header: "Company",
      cell: ({ row }) => row.original.currentCompany || "-",
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.original.location || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={statusTone(row.original.status)} variant="outline">
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "links",
      header: "Files",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.resumeUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={row.original.resumeUrl} target="_blank" rel="noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </a>
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">No resume</span>
          )}
          {row.original.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a href={row.original.linkedin} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onReview(row.original)}>
          Review
        </Button>
      ),
    },
  ]

  return (
    <div className="rounded-lg border bg-card">
      <ReusableDataTable
        data={submissions}
        columns={columns}
        searchableColumns={[
          "name",
          "email",
          "phone",
          "position",
          "currentCompany",
          "location",
        ]}
        filterConfigs={filters}
        searchPlaceholder="Search candidates..."
        enableExport
        exportFileName="career-submissions.csv"
        emptyStateMessage="No career submissions"
        emptyStateDescription="Applications submitted through the career API will appear here."
      />
    </div>
  )
}

