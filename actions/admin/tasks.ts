"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdminWithPermissions } from "@/lib/admin/permissions"
import {
  CreateAdminTaskSchema,
  UpdateAdminTaskSchema,
  type CreateAdminTaskInput,
  type UpdateAdminTaskInput,
} from "@/lib/validations/admin-task"
import { Prisma } from "@/generated/prisma/client"

type ActionResult = {
  success: boolean
  message: string
}

function normalizeOptionalId(value?: string | null) {
  return value && value.trim().length > 0 ? value : null
}

function toTaskDate(value?: string) {
  if (!value) return new Date()
  return new Date(`${value}T00:00:00`)
}

export async function createAdminTaskAction(
  data: CreateAdminTaskInput
): Promise<ActionResult> {
  try {
    const admin = await requireAdminWithPermissions()

    const validated = CreateAdminTaskSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid task data." }
    }

    const task = validated.data

    await prisma.adminTask.create({
      data: {
        adminId: admin.id,
        taskType: task.taskType,
        status: task.status,
        title: task.title,
        clientName: task.clientName || null,
        clientPhone: task.clientPhone || null,
        clientEmail: task.clientEmail || null,
        description: task.description || null,
        outcome: task.outcome || null,
        durationMinutes: task.durationMinutes,
        taskDate: toTaskDate(task.taskDate),
        leadId: normalizeOptionalId(task.leadId),
      },
    })

    revalidatePath("/admin/tasks")
    revalidatePath("/admin/dashboard")
    return { success: true, message: "Task added successfully." }
  } catch (error) {
    console.error(error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { success: false, message: "Selected lead was not found." }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add task.",
    }
  }
}

export async function updateAdminTaskAction(
  id: string,
  data: UpdateAdminTaskInput
): Promise<ActionResult> {
  try {
    const admin = await requireAdminWithPermissions()

    const existingTask = await prisma.adminTask.findUnique({
      where: { id },
      select: { id: true, adminId: true },
    })

    if (!existingTask) {
      return { success: false, message: "Task not found." }
    }

    if (existingTask.adminId !== admin.id) {
      return { success: false, message: "You can edit only your own tasks." }
    }

    const validated = UpdateAdminTaskSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid task data." }
    }

    const task = validated.data

    await prisma.adminTask.update({
      where: { id },
      data: {
        taskType: task.taskType,
        status: task.status,
        title: task.title,
        clientName: task.clientName,
        clientPhone: task.clientPhone,
        clientEmail: task.clientEmail,
        description: task.description,
        outcome: task.outcome,
        durationMinutes: task.durationMinutes,
        taskDate: task.taskDate ? toTaskDate(task.taskDate) : undefined,
        leadId:
          task.leadId === undefined
            ? undefined
            : normalizeOptionalId(task.leadId),
      },
    })

    revalidatePath("/admin/tasks")
    revalidatePath("/admin/dashboard")
    return { success: true, message: "Task updated successfully." }
  } catch (error) {
    console.error(error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { success: false, message: "Selected lead was not found." }
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update task.",
    }
  }
}
