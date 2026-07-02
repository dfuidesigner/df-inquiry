import { prisma } from "@/lib/prisma"
import {
  leadAccessWhere,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import {
  TasksClient,
  type LeadOption,
  type TaskRowData,
} from "./_components/tasks-client"

function minutesToHours(minutes: number) {
  return Math.round((minutes / 60) * 10) / 10
}

export default async function TasksPage() {
  const admin = await requireAdminWithPermissions()
  const isSuperAdmin = admin.role === "SUPER_ADMIN"

  const rawTasks = await prisma.adminTask.findMany({
    where: isSuperAdmin ? {} : { adminId: admin.id },
    orderBy: [{ taskDate: "desc" }, { createdAt: "desc" }],
    include: {
      admin: {
        select: { id: true, name: true, email: true, role: true },
      },
      lead: {
        select: { id: true, name: true, service: true, phone: true, email: true },
      },
    },
  })

  const visibleLeads = await prisma.inquiry.findMany({
    where: leadAccessWhere(admin),
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      service: true,
      phone: true,
      email: true,
    },
  })

  const tasks: TaskRowData[] = rawTasks.map((task) => ({
    id: task.id,
    adminId: task.adminId,
    adminName: task.admin.name,
    adminEmail: task.admin.email,
    taskType: task.taskType,
    status: task.status,
    title: task.title,
    clientName: task.clientName ?? "",
    clientPhone: task.clientPhone ?? "",
    clientEmail: task.clientEmail ?? "",
    description: task.description ?? "",
    outcome: task.outcome ?? "",
    durationMinutes: task.durationMinutes,
    leadId: task.leadId ?? "",
    leadName: task.lead?.name ?? "",
    leadService: task.lead?.service ?? "",
    taskDate: task.taskDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }))

  const leads: LeadOption[] = visibleLeads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    service: lead.service,
    phone: lead.phone,
    email: lead.email,
  }))

  const totalMinutes = tasks.reduce((sum, task) => sum + task.durationMinutes, 0)
  const completedTasks = tasks.filter((task) => task.status === "DONE").length

  return (
    <TasksClient
      tasks={tasks}
      leads={leads}
      currentAdmin={{
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      }}
      stats={{
        totalTasks: tasks.length,
        completedTasks,
        totalMinutes,
        totalHours: minutesToHours(totalMinutes),
      }}
    />
  )
}

