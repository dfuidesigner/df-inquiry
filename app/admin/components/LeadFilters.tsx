"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LeadFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "ALL") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:w-64">
        <Input
          placeholder="Search name, email, phone..."
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => updateFilter("query", e.target.value)}
          className="border-slate-200 bg-white pl-4 shadow-sm focus-visible:ring-indigo-500"
        />
      </div>

      <div className="w-full sm:w-44">
        <Select
          defaultValue={searchParams.get("status")?.toString() || "ALL"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="border-slate-200 bg-white shadow-sm focus:ring-indigo-500 w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="HOT">Hot Lead 🔥</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="MEETING">Meeting Set</SelectItem>
            <SelectItem value="WON">Won</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
            <SelectItem value="WASTED">Wasted / Invalid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-44">
        <Select
          defaultValue={searchParams.get("sort")?.toString() || "ALL"}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger className="border-slate-200 bg-white shadow-sm focus:ring-indigo-500 w-full">
            <SelectValue placeholder="Sort by Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Default Sort</SelectItem>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
