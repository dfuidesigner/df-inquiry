"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartData = {
  outcome: string
  count: number
}

export function ActivityChart({ data }: { data: ChartData[] }) {
  const chartConfig = {
    count: {
      label: "Actions Logged",
      color: "hsl(221.2 83.2% 53.3%)",
    },
  }

  return (
    <div className="h-87.5 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Activity Overview
          </h3>
          <p className="text-sm text-slate-500">Aggregated outcome metrics.</p>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-62.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="outcome"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: "#64748b" }}
              tickFormatter={(val) => val.replace("_", " ")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: "#64748b" }}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ fill: "#f1f5f9" }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
