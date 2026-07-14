"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import {
  Loader2,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { importLeadsAction } from "@/actions/admin/leads"
import { normalizeImportRow } from "@/lib/admin/import-lead-mapping"

type LeadImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ParsedState = { fileName: string; rows: Record<string, unknown>[] }
type ImportSummary = {
  created: number
  skipped: Array<{ row: number; reason: string }>
  createdCategories: string[]
}

const TEMPLATE_HEADERS = [
  "name",
  "email",
  "phone",
  "service",
  "message",
  "status",
  "rewardValue",
  "source",
  "category",
  "assignedToEmail",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
]
const TEMPLATE_EXAMPLE = [
  "Jane Doe",
  "jane@example.com",
  "9876543210",
  "Web Development",
  "Interested in a quote",
  "NEW",
  "5000",
  "Website",
  "Corporate",
  "sales@yourcompany.com",
  "google",
  "cpc",
  "summer_promo",
  "ad1",
  "web dev",
]

function downloadTemplate() {
  const csv = [
    TEMPLATE_HEADERS.join(","),
    TEMPLATE_EXAMPLE.map((v) => `"${v}"`).join(","),
  ].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "leads-import-template.csv"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function LeadImportDialog({
  open,
  onOpenChange,
}: LeadImportDialogProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [parseError, setParseError] = useState("")
  const [parsed, setParsed] = useState<ParsedState | null>(null)
  const [autoCreateCategories, setAutoCreateCategories] = useState(true)
  const [summary, setSummary] = useState<ImportSummary | null>(null)

  function resetState() {
    setParsed(null)
    setParseError("")
    setSummary(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleFile(file: File) {
    setParseError("")
    setSummary(null)
    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: "array" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
      })

      if (rawRows.length === 0) {
        setParseError("No rows found in this file.")
        return
      }
      setParsed({ fileName: file.name, rows: rawRows.map(normalizeImportRow) })
    } catch (error) {
      console.error(error)
      setParseError(
        "Could not read this file. Make sure it's a valid CSV or Excel file."
      )
    }
  }

  function onImport() {
    if (!parsed) return
    startTransition(async () => {
      const res = await importLeadsAction(parsed.rows, { autoCreateCategories })
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      setSummary({
        created: res.created,
        skipped: res.skipped,
        createdCategories: res.createdCategories,
      })
      router.refresh()
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetState()
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Leads
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2">
            <span>
              Upload a CSV or Excel file. Required columns: name, email, phone,
              service.
            </span>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1 text-primary underline"
            >
              <Download className="h-3 w-3" />
              Download template
            </button>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file) handleFile(file)
            }}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag a file here, or
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </div>

          {parseError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {parseError}
            </div>
          )}

          {parsed && !summary && (
            <div className="rounded-lg border p-4 text-sm">
              <p className="font-medium">{parsed.fileName}</p>
              <p className="text-muted-foreground">
                {parsed.rows.length} row{parsed.rows.length === 1 ? "" : "s"}{" "}
                detected and ready to import.
              </p>
            </div>
          )}

          {parsed && (
            <label className="flex items-start gap-3 rounded-md border p-3">
              <Checkbox
                checked={autoCreateCategories}
                onCheckedChange={(c) => setAutoCreateCategories(c === true)}
              />
              <span className="text-sm">
                Automatically create categories that don&apos;t exist yet
              </span>
            </label>
          )}

          {summary && (
            <div className="space-y-2 rounded-lg border p-4 text-sm">
              <p className="font-medium text-emerald-700">
                {summary.created} lead{summary.created === 1 ? "" : "s"}{" "}
                imported successfully.
              </p>
              {summary.createdCategories.length > 0 && (
                <p className="text-muted-foreground">
                  New categories created: {summary.createdCategories.join(", ")}
                </p>
              )}
              {summary.skipped.length > 0 && (
                <div>
                  <p className="font-medium text-destructive">
                    {summary.skipped.length} row
                    {summary.skipped.length === 1 ? "" : "s"} skipped:
                  </p>
                  <ul className="mt-1 max-h-32 list-disc space-y-0.5 overflow-y-auto pl-5 text-muted-foreground">
                    {summary.skipped.map((item) => (
                      <li key={item.row}>
                        Row {item.row}: {item.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {summary ? "Close" : "Cancel"}
          </Button>
          {!summary && (
            <Button
              onClick={onImport}
              disabled={!parsed || isPending}
              className="gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Import {parsed ? `${parsed.rows.length} Leads` : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
