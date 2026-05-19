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
    case "HOT":
      return (
        <Badge className="border-orange-200 bg-orange-100 text-orange-800 shadow-none hover:bg-orange-200">
          Hot 🔥
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
    case "WASTED":
      return (
        <Badge className="border-slate-300 bg-slate-200 text-slate-700 shadow-none hover:bg-slate-300">
          Wasted
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
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-6 xl:flex-row xl:items-center xl:justify-between">
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
                  <th className="px-6 py-5">Source</th>
                  <th className="px-6 py-5">Service & Message</th>
                  <th className="px-6 py-5">Latest Activity</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => {
                  const latestAction = inq.actions[0]
                  const cleanPhone = inq.phone.replace(/\D/g, "")

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

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium tracking-wide text-slate-700 uppercase">
                            {inq.utm_source || inq.source || "DIRECT"}
                          </span>
                          {inq.utm_campaign && (
                            <span
                              className="max-w-[120px] truncate text-xs text-slate-400"
                              title={inq.utm_campaign}
                            >
                              {inq.utm_campaign}
                            </span>
                          )}
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
                              {formatDistanceToNow(
                                new Date(latestAction.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">
                            No actions logged
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:${cleanPhone}`}
                            title="Call"
                            className="flex items-center justify-center rounded-md border border-slate-200 bg-white p-3 text-lg transition-colors hover:bg-slate-50"
                          >
                            📞
                          </a>
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                            className="flex items-center justify-center rounded-md border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-lg transition-colors hover:bg-[#25D366]/20"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              viewBox="0 0 32 32"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
                                fill="#BFC8D0"
                              />
                              <path
                                d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
                                fill="url(#paint0_linear_87_7264)"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
                                fill="white"
                              />
                              <path
                                d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
                                fill="white"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_87_7264"
                                  x1="26.5"
                                  y1="7"
                                  x2="4"
                                  y2="28"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stop-color="#5BD066" />
                                  <stop offset="1" stop-color="#27B43E" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </a>
                          <LeadSheet lead={inq} />
                        </div>
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
