import { db } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ActivityChart } from "../components/ActivityChart"
import { LeadSheet } from "../components/LeadSheet"
import { LeadFilters } from "../components/LeadFilters"
import { Prisma } from "@/generated/prisma/client"

function getStatusBadge(status: string) {
  switch (status) {
    case "NEW":
      return (
        <Badge className="border-blue-200 bg-blue-100 text-blue-800 shadow-none hover:bg-blue-200">
          New
        </Badge>
      )
    case "CONTACTED":
      return (
        <Badge className="border-amber-200 bg-amber-100 text-amber-800 shadow-none hover:bg-amber-200">
          Contacted
        </Badge>
      )
    case "MEETING":
      return (
        <Badge className="border-purple-200 bg-purple-100 text-purple-800 shadow-none hover:bg-purple-200">
          Meeting Set
        </Badge>
      )
    case "WON":
      return (
        <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800 shadow-none hover:bg-emerald-200">
          Won
        </Badge>
      )
    case "LOST":
      return (
        <Badge className="border-rose-200 bg-rose-100 text-rose-800 shadow-none hover:bg-rose-200">
          Lost
        </Badge>
      )
    default:
      return (
        <Badge className="border-slate-200 bg-slate-100 text-slate-800 shadow-none hover:bg-slate-200">
          {status}
        </Badge>
      )
  }
}

const getInitials = (name: string) => {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "?"
  )
}

export default async function AdminDashboard(props: {
  searchParams?: Promise<{ query?: string; status?: string; sort?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const statusFilter = searchParams?.status || ""

  const sortOrder = searchParams?.sort === "asc" ? "asc" : "desc"

  const whereClause: Prisma.InquiryWhereInput = {}

  if (statusFilter && statusFilter !== "ALL") {
    whereClause.status = statusFilter
  }

  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { email: { contains: query } },
      { phone: { contains: query } },
    ]
  }

  const inquiries = await db.inquiry.findMany({
    where: whereClause,
    orderBy: { createdAt: sortOrder },
    include: {
      actions: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  const actionCounts = await db.leadAction.groupBy({
    by: ["outcome"],
    _count: { outcome: true },
  })

  const chartData = actionCounts.map((item) => ({
    outcome: item.outcome,
    count: item._count.outcome,
  }))

  return (
    <div className="flex animate-in flex-col gap-8 duration-500 fade-in slide-in-from-bottom-4">
      <section className="w-full">
        <ActivityChart data={chartData} />
      </section>

      <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-gra text-2xl font-bold text-slate-900">
              Lead Pipeline
              <span className="flex h-6 items-center justify-center rounded-full bg-slate-200 px-2.5 text-sm font-medium text-slate-600">
                {inquiries.length}
              </span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track your incoming leads.
            </p>
          </div>

          <LeadFilters />
        </div>

        <div className="block w-full overflow-x-auto">
          {inquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <span className="text-2xl text-slate-400">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                No leads found
              </h3>
              <p className="mt-1 text-slate-500">
                Try adjusting your filters or search query.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Lead Info</th>
                  <th className="px-6 py-5">Service & Message</th>
                  <th className="px-6 py-5">Value</th>
                  <th className="px-6 py-5">Latest Activity</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => {
                  const latestAction = inq.actions[0]

                  return (
                    <tr
                      key={inq.id}
                      className="group transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        {getStatusBadge(inq.status || "NEW")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                            {getInitials(inq.name)}
                          </div>
                          <div>
                            <div className="text-base font-semibold text-slate-900">
                              {inq.name}
                            </div>
                            <div className="text-slate-500">{inq.email}</div>
                            <div className="text-slate-500">{inq.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-xs px-6 py-4 whitespace-normal">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-800">
                            {inq.service}
                          </span>
                          {inq.message ? (
                            <span
                              className="line-clamp-2 text-sm text-slate-500"
                              title={inq.message}
                            >
                              {inq.message}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400 italic">
                              No message
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {inq.rewardValue ? (
                          `$${inq.rewardValue.toLocaleString()}`
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {latestAction ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {latestAction.actionType}:{" "}
                              <span className="font-normal text-slate-600">
                                {latestAction.outcome.replace("_", " ")}
                              </span>
                            </span>
                            <span className="mt-0.5 text-xs text-slate-400">
                              {formatDistanceToNow(latestAction.createdAt, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            No actions logged
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <LeadSheet lead={inq} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
