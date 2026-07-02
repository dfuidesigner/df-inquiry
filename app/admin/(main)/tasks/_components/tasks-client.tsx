"use client"

import { useState } from "react"
import {
  BriefcaseBusiness,
  Clock,
  ListChecks,
  Plus,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AdminRole, AdminTaskStatus, AdminTaskType } from "@/generated/prisma/client"
import type { AdminUser } from "@/types/admin"
import { TaskFormDialog } from "./task-form-dialog"
import { TasksTable } from "./tasks-table"

export type TaskRowData = {
  id: string
  adminId: string
  adminName: string
  adminEmail: string
  taskType: AdminTaskType | string
  status: AdminTaskStatus | string
  title: string
  clientName: string
  clientPhone: string
  clientEmail: string
  description: string
  outcome: string
  durationMinutes: number
  leadId: string
  leadName: string
  leadService: string
  taskDate: string
  createdAt: string
  updatedAt: string
}

export type LeadOption = {
  id: string
  name: string
  service: string
  phone: string
  email: string
}

type TasksClientProps = {
  tasks: TaskRowData[]
  leads: LeadOption[]
  currentAdmin: AdminUser & { role: AdminRole | string }
  stats: {
    totalTasks: number
    completedTasks: number
    totalMinutes: number
    totalHours: number
  }
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

export function TasksClient({
  tasks,
  leads,
  currentAdmin,
  stats,
}: TasksClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskRowData | null>(null)
  const isSuperAdmin = currentAdmin.role === "SUPER_ADMIN"

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pt-4 pb-6 sm:flex-row sm:items-center lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Task Log
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSuperAdmin
                ? "Review what each admin completed and how long it took."
                : "Add the calls, meetings, follow-ups, and work you completed."}
            </p>
          </div>
        </div>

        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-2 xl:grid-cols-4 lg:px-8">
        <StatCard
          title="Total Tasks"
          value={String(stats.totalTasks)}
          subtitle={isSuperAdmin ? "Visible admin tasks" : "Your task entries"}
          icon={ListChecks}
        />
        <StatCard
          title="Completed"
          value={String(stats.completedTasks)}
          subtitle="Marked as done"
          icon={Trophy}
        />
        <StatCard
          title="Time Logged"
          value={`${stats.totalHours}h`}
          subtitle={`${stats.totalMinutes} minutes total`}
          icon={Clock}
        />
        <StatCard
          title="Avg Time"
          value={
            stats.totalTasks === 0
              ? "0m"
              : `${Math.round(stats.totalMinutes / stats.totalTasks)}m`
          }
          subtitle="Average per task"
          icon={BriefcaseBusiness}
        />
      </div>

      <div className="px-4 lg:px-8">
        <TasksTable
          tasks={tasks}
          currentAdminId={currentAdmin.id}
          isSuperAdmin={isSuperAdmin}
          onEdit={setEditingTask}
        />
      </div>

      <TaskFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        leads={leads}
      />

      <TaskFormDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        mode="edit"
        task={editingTask}
        leads={leads}
      />
    </div>
  )
}
