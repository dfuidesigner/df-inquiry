"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import {
  canViewLead,
  hasPermission,
  requireAdminWithPermissions,
  requirePermission,
} from "@/lib/admin/permissions"
import {
  AssignLeadSchema,
  CreateLeadSchema,
  LeadActionSchema,
  UpdateLeadSchema,
  UpdateLeadStatusSchema,
  type AssignLeadInput,
  type CreateLeadInput,
  type LeadActionInput,
  type UpdateLeadInput,
  type UpdateLeadStatusInput,
} from "@/lib/validations/admin-lead"
import { Prisma } from "@/generated/prisma/client"

type ActionResult = {
  success: boolean
  message: string
}

async function assertLeadAccess(id: string) {
  const admin = await requireAdminWithPermissions()

  const lead = await prisma.inquiry.findUnique({
    where: { id },
    select: { id: true, assignedToId: true },
  })

  if (!lead) {
    throw new Error("Lead not found.")
  }

  if (!canViewLead(admin, lead)) {
    throw new Error("You do not have access to this lead.")
  }

  return { admin, lead }
}

function normalizeAssignedAdminId(assignedToId?: string | null) {
  return assignedToId && assignedToId.trim().length > 0 ? assignedToId : null
}

export async function createLeadAction(
  data: CreateLeadInput
): Promise<ActionResult> {
  try {
    const admin = await requirePermission("CREATE_LEAD")

    const validated = CreateLeadSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid lead data." }
    }

    const { assignedToId, rewardValue, ...lead } = validated.data
    const finalAssignedToId = hasPermission(admin, "ASSIGN_LEAD")
      ? normalizeAssignedAdminId(assignedToId)
      : admin.id

    await prisma.$transaction(async (tx) => {
      const createdLead = await tx.inquiry.create({
        data: {
          ...lead,
          rewardValue: rewardValue ? parseFloat(rewardValue) : null,
          assignedToId: finalAssignedToId,
        },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: createdLead.id,
          actionType: "LEAD_CREATED",
          outcome: lead.status ?? "NEW",
          note: finalAssignedToId
            ? `Lead created by ${admin.name} and assigned.`
            : `Lead created by ${admin.name}.`,
        },
      })
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")
    return { success: true, message: "Lead created successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create lead.",
    }
  }
}

export async function updateLeadAction(
  id: string,
  data: UpdateLeadInput
): Promise<ActionResult> {
  try {
    const admin = await requirePermission("EDIT_LEAD")
    await assertLeadAccess(id)

    const validated = UpdateLeadSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid lead data." }
    }

    const { assignedToId, rewardValue, ...lead } = validated.data

    await prisma.$transaction(async (tx) => {
      await tx.inquiry.update({
        where: { id },
        data: {
          ...lead,
          ...(rewardValue === undefined
            ? {}
            : { rewardValue: rewardValue ? parseFloat(rewardValue) : null }),
          ...(assignedToId === undefined || !hasPermission(admin, "ASSIGN_LEAD")
            ? {}
            : { assignedToId: normalizeAssignedAdminId(assignedToId) }),
        },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: id,
          actionType: "LEAD_UPDATED",
          outcome: "UPDATED",
          note: `Lead details updated by ${admin.name}.`,
        },
      })
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")
    return { success: true, message: "Lead updated successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update lead.",
    }
  }
}

export async function updateLeadStatusAction(
  id: string,
  data: UpdateLeadStatusInput
): Promise<ActionResult> {
  try {
    const admin = await requirePermission("EDIT_LEAD")
    await assertLeadAccess(id)

    const validated = UpdateLeadStatusSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid status data." }
    }

    const currentLead = await prisma.inquiry.findUnique({
      where: { id },
      select: { status: true },
    })

    await prisma.$transaction(async (tx) => {
      await tx.inquiry.update({
        where: { id },
        data: { status: validated.data.status },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: id,
          actionType: "STATUS_UPDATE",
          outcome: `${currentLead?.status ?? "UNKNOWN"} -> ${validated.data.status}`,
          note:
            validated.data.note ||
            `Status changed by ${admin.name} to ${validated.data.status}.`,
        },
      })
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")
    return { success: true, message: "Lead status updated successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update lead status.",
    }
  }
}

export async function assignLeadAction(
  id: string,
  data: AssignLeadInput
): Promise<ActionResult> {
  try {
    const admin = await requirePermission("ASSIGN_LEAD")
    await assertLeadAccess(id)

    const validated = AssignLeadSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid assignment data." }
    }

    const assignedToId = normalizeAssignedAdminId(validated.data.assignedToId)
    let assigneeName = ""

    if (assignedToId) {
      const assignee = await prisma.admin.findUnique({
        where: { id: assignedToId },
        select: { id: true, name: true, isActive: true },
      })

      if (!assignee || !assignee.isActive) {
        return { success: false, message: "Selected admin is not active." }
      }

      assigneeName = assignee.name
    }

    await prisma.$transaction(async (tx) => {
      await tx.inquiry.update({
        where: { id },
        data: { assignedToId },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: id,
          actionType: "ASSIGNMENT",
          outcome: assignedToId ? "ASSIGNED" : "UNASSIGNED",
          note: assignedToId
            ? `Assigned to ${assigneeName} by ${admin.name}.`
            : `Unassigned by ${admin.name}.`,
        },
      })
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")
    return { success: true, message: "Lead assignment updated successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to assign lead.",
    }
  }
}

export async function addLeadActionLogAction(
  id: string,
  data: LeadActionInput
): Promise<ActionResult> {
  try {
    const admin = await requirePermission("EDIT_LEAD")
    await assertLeadAccess(id)

    const validated = LeadActionSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid action data." }
    }

    await prisma.leadAction.create({
      data: {
        inquiryId: id,
        actionType: validated.data.actionType,
        outcome: validated.data.outcome,
        note: validated.data.note
          ? `${validated.data.note}\n\nAdded by ${admin.name}.`
          : `Added by ${admin.name}.`,
      },
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")
    return { success: true, message: "Lead note added successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add lead note.",
    }
  }
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  try {
    await requirePermission("DELETE_LEAD")
    await assertLeadAccess(id)

    await prisma.inquiry.delete({ where: { id } })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")
    return { success: true, message: "Lead deleted successfully." }
  } catch (error) {
    console.error(error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, message: "Lead not found." }
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete lead.",
    }
  }
}

export async function exportLeadsAllowedAction(): Promise<ActionResult> {
  try {
    const admin = await requireAdminWithPermissions()
    if (!hasPermission(admin, "EXPORT_LEADS")) {
      return { success: false, message: "You do not have export permission." }
    }

    return { success: true, message: "Export allowed." }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Export check failed." }
  }
}
