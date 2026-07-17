"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import {
  canViewLead,
  hasPermission,
  leadAccessSelect,
  requireAdminWithPermissions,
  requirePermission,
  toLeadAccessInput,
} from "@/lib/admin/permissions"
import {
  AssignLeadSchema,
  CreateLeadSchema,
  ImportLeadRowSchema,
  LeadActionSchema,
  ReassignLeadSchema,
  UpdateLeadSchema,
  UpdateLeadStatusSchema,
  type AssignLeadInput,
  type CreateLeadInput,
  type ImportLeadRow,
  type LeadActionInput,
  type ReassignLeadInput,
  type UpdateLeadInput,
  type UpdateLeadStatusInput,
} from "@/lib/validations/admin-lead"
import {
  diffLeadFields,
  resolveFriendlyChangeLabels,
} from "@/lib/admin/lead-diff"
import { notifyLeadAssigned } from "@/lib/admin/notifications"
import { Prisma } from "@/generated/prisma/client"

type ActionResult = {
  success: boolean
  message: string
}

function normalizeAssignedAdminId(assignedToId?: string | null) {
  return assignedToId && assignedToId.trim().length > 0 ? assignedToId : null
}

function normalizeCategoryId(categoryId?: string | null) {
  return categoryId && categoryId.trim().length > 0 ? categoryId : null
}

async function assertLeadAccess(id: string) {
  const admin = await requireAdminWithPermissions()

  const lead = await prisma.inquiry.findUnique({
    where: { id },
    select: leadAccessSelect,
  })

  if (!lead) {
    throw new Error("Lead not found.")
  }

  if (!canViewLead(admin, toLeadAccessInput(lead))) {
    throw new Error("You do not have access to this lead.")
  }

  return { admin, lead }
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

    const { assignedToId, rewardValue, categoryId, ...lead } = validated.data
    const finalAssignedToId = hasPermission(admin, "ASSIGN_LEAD")
      ? normalizeAssignedAdminId(assignedToId)
      : admin.id

    const createdLead = await prisma.$transaction(async (tx) => {
      const created = await tx.inquiry.create({
        data: {
          ...lead,
          rewardValue: rewardValue ? parseFloat(rewardValue) : null,
          assignedToId: finalAssignedToId,
          categoryId: normalizeCategoryId(categoryId),
        },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: created.id,
          adminId: admin.id,
          actionType: "LEAD_CREATED",
          outcome: lead.status ?? "NEW",
          note: finalAssignedToId
            ? `Lead created by ${admin.name} and assigned.`
            : `Lead created by ${admin.name}.`,
        },
      })

      return created
    })

    if (finalAssignedToId) {
      await notifyLeadAssigned({
        leadId: createdLead.id,
        leadName: createdLead.name,
        assignedToId: finalAssignedToId,
        assignedById: admin.id,
        assignedByName: admin.name,
      })
    }

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

    const previousLead = await prisma.inquiry.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        phone: true,
        service: true,
        message: true,
        status: true,
        rewardValue: true,
        source: true,
        categoryId: true,
        assignedToId: true,
      },
    })
    if (!previousLead) {
      return { success: false, message: "Lead not found." }
    }

    const { assignedToId, rewardValue, categoryId, ...lead } = validated.data

    const nextAssignedToId =
      assignedToId === undefined || !hasPermission(admin, "ASSIGN_LEAD")
        ? previousLead.assignedToId
        : normalizeAssignedAdminId(assignedToId)
    const nextCategoryId =
      categoryId === undefined
        ? previousLead.categoryId
        : normalizeCategoryId(categoryId)
    const nextRewardValue =
      rewardValue === undefined
        ? previousLead.rewardValue
        : rewardValue
          ? parseFloat(rewardValue)
          : null

    const changes = diffLeadFields(previousLead, {
      ...lead,
      rewardValue: nextRewardValue,
      categoryId: nextCategoryId,
      assignedToId: nextAssignedToId,
    })
    if (changes.length > 0) {
      await resolveFriendlyChangeLabels(changes)
    }

    await prisma.$transaction(async (tx) => {
      await tx.inquiry.update({
        where: { id },
        data: {
          ...lead,
          ...(rewardValue === undefined
            ? {}
            : { rewardValue: nextRewardValue }),
          ...(assignedToId === undefined || !hasPermission(admin, "ASSIGN_LEAD")
            ? {}
            : { assignedToId: nextAssignedToId }),
          ...(categoryId === undefined ? {} : { categoryId: nextCategoryId }),
        },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: id,
          adminId: admin.id,
          actionType: "LEAD_UPDATED",
          outcome: "UPDATED",
          note:
            changes.length > 0
              ? `Lead updated by ${admin.name}: ${changes.map((c) => c.label).join(", ")}.`
              : `Lead details updated by ${admin.name}.`,
          metadata: changes.length > 0 ? { changes } : undefined,
        },
      })
    })

    if (nextAssignedToId && nextAssignedToId !== previousLead.assignedToId) {
      await notifyLeadAssigned({
        leadId: id,
        leadName: previousLead.name,
        assignedToId: nextAssignedToId,
        assignedById: admin.id,
        assignedByName: admin.name,
      })
    }

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
          adminId: admin.id,
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

    const lead = await prisma.$transaction(async (tx) => {
      const updated = await tx.inquiry.update({
        where: { id },
        data: { assignedToId },
        select: { id: true, name: true },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: id,
          adminId: admin.id,
          actionType: "ASSIGNMENT",
          outcome: assignedToId ? "ASSIGNED" : "UNASSIGNED",
          note: assignedToId
            ? `Assigned to ${assigneeName} by ${admin.name}.`
            : `Unassigned by ${admin.name}.`,
        },
      })

      return updated
    })

    if (assignedToId) {
      await notifyLeadAssigned({
        leadId: id,
        leadName: lead.name,
        assignedToId,
        assignedById: admin.id,
        assignedByName: admin.name,
      })
    }

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

export async function reassignLeadForRecheckAction(
  id: string,
  data: ReassignLeadInput
): Promise<ActionResult> {
  try {
    const admin = await requirePermission("ASSIGN_LEAD")
    await assertLeadAccess(id)

    const validated = ReassignLeadSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid reassignment data." }
    }

    const lead = await prisma.inquiry.findUnique({
      where: { id },
      select: {
        name: true,
        status: true,
        assignedToId: true,
        assignedTo: { select: { name: true } },
      },
    })
    if (!lead) return { success: false, message: "Lead not found." }

    const newAssignee = await prisma.admin.findUnique({
      where: { id: validated.data.assignedToId },
      select: { id: true, name: true, isActive: true },
    })
    if (!newAssignee || !newAssignee.isActive) {
      return { success: false, message: "Selected admin is not active." }
    }
    if (newAssignee.id === lead.assignedToId) {
      return {
        success: false,
        message: "Lead is already assigned to this admin.",
      }
    }

    const previousAssigneeName = lead.assignedTo?.name ?? "Unassigned"
    const previousStatus = lead.status ?? "NEW"
    const shouldResetStatus = validated.data.resetStatus ?? false

    await prisma.$transaction(async (tx) => {
      await tx.inquiry.update({
        where: { id },
        data: {
          assignedToId: newAssignee.id,
          ...(shouldResetStatus ? { status: "FOLLOW_UP" } : {}),
        },
      })

      await tx.leadReassignment.create({
        data: {
          inquiryId: id,
          fromAdminId: lead.assignedToId,
          toAdminId: newAssignee.id,
          reassignedById: admin.id,
          previousStatus,
          note: validated.data.note || null,
        },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: id,
          adminId: admin.id,
          actionType: "ASSIGNMENT",
          outcome: "REASSIGNED_FOR_RECHECK",
          note: [
            `Reassigned by ${admin.name} from ${previousAssigneeName} to ${newAssignee.name} for a second opinion.`,
            `Previous status was "${previousStatus}".`,
            shouldResetStatus
              ? `Status reset to "FOLLOW_UP" for recheck.`
              : `Status left unchanged.`,
            validated.data.note ? `Note: ${validated.data.note}` : null,
          ]
            .filter(Boolean)
            .join(" "),
        },
      })
    })

    await notifyLeadAssigned({
      leadId: id,
      leadName: lead.name,
      assignedToId: newAssignee.id,
      assignedById: admin.id,
      assignedByName: admin.name,
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")
    return {
      success: true,
      message: `Lead reassigned to ${newAssignee.name}. ${previousAssigneeName} keeps visibility into this lead.`,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reassign lead.",
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
        adminId: admin.id,
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

export type ImportLeadsResult = {
  success: boolean
  message: string
  created: number
  skipped: Array<{ row: number; reason: string }>
  createdCategories: string[]
}

export async function importLeadsAction(
  rows: Record<string, unknown>[],
  options: { autoCreateCategories?: boolean } = {}
): Promise<ImportLeadsResult> {
  try {
    const admin = await requirePermission("CREATE_LEAD")

    if (rows.length === 0) {
      return {
        success: false,
        message: "No rows to import.",
        created: 0,
        skipped: [],
        createdCategories: [],
      }
    }
    if (rows.length > 500) {
      return {
        success: false,
        message:
          "Import is limited to 500 rows at a time. Please split your file.",
        created: 0,
        skipped: [],
        createdCategories: [],
      }
    }

    const canAssign = hasPermission(admin, "ASSIGN_LEAD")
    const autoCreateCategories = options.autoCreateCategories ?? true

    const existingCategories = await prisma.leadCategory.findMany({
      select: { id: true, name: true },
    })
    const categoryByName = new Map(
      existingCategories.map((c) => [c.name.toLowerCase(), c.id])
    )
    const createdCategoryNames = new Set<string>()

    const assigneeCache = new Map<string, string | null>()
    async function resolveAssigneeId(email?: string) {
      if (!email) return null
      const key = email.trim().toLowerCase()
      if (!key) return null
      if (assigneeCache.has(key)) return assigneeCache.get(key) ?? null
      const found = await prisma.admin.findFirst({
        where: { email: key },
        select: { id: true, isActive: true },
      })
      const resolvedId = found?.isActive ? found.id : null
      assigneeCache.set(key, resolvedId)
      return resolvedId
    }

    const skipped: Array<{ row: number; reason: string }> = []
    const validRows: Array<{
      data: ImportLeadRow
      categoryId: string | null
      assignedToId: string | null
    }> = []

    for (let i = 0; i < rows.length; i++) {
      const parsed = ImportLeadRowSchema.safeParse(rows[i])
      if (!parsed.success) {
        skipped.push({
          row: i + 2,
          reason: parsed.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", "),
        })
        continue
      }

      let categoryId: string | null = null
      const categoryName = parsed.data.category?.trim()
      if (categoryName) {
        const key = categoryName.toLowerCase()
        if (categoryByName.has(key)) {
          categoryId = categoryByName.get(key) ?? null
        } else if (autoCreateCategories) {
          const created = await prisma.leadCategory.create({
            data: { name: categoryName },
          })
          categoryByName.set(key, created.id)
          categoryId = created.id
          createdCategoryNames.add(categoryName)
        }
      }

      const assignedToId = canAssign
        ? await resolveAssigneeId(parsed.data.assignedToEmail)
        : admin.id
      validRows.push({ data: parsed.data, categoryId, assignedToId })
    }

    let created = 0
    const notifyTargets: Array<{
      leadId: string
      leadName: string
      assignedToId: string
    }> = []

    await prisma.$transaction(async (tx) => {
      for (const row of validRows) {
        const lead = await tx.inquiry.create({
          data: {
            name: row.data.name,
            email: row.data.email,
            phone: row.data.phone,
            service: row.data.service,
            message: row.data.message,
            status: row.data.status || "NEW",
            rewardValue: row.data.rewardValue
              ? Number(row.data.rewardValue)
              : null,
            source: row.data.source || "Import",
            utm_source: row.data.utm_source,
            utm_medium: row.data.utm_medium,
            utm_campaign: row.data.utm_campaign,
            utm_content: row.data.utm_content,
            utm_term: row.data.utm_term,
            categoryId: row.categoryId,
            assignedToId: row.assignedToId,
          },
        })

        await tx.leadAction.create({
          data: {
            inquiryId: lead.id,
            adminId: admin.id,
            actionType: "LEAD_CREATED",
            outcome: row.data.status || "NEW",
            note: row.data.comment
              ? `Imported by ${admin.name}. Comment: ${row.data.comment}`
              : `Imported by ${admin.name}.`,
          },
        })

        if (row.assignedToId && row.assignedToId !== admin.id) {
          notifyTargets.push({
            leadId: lead.id,
            leadName: lead.name,
            assignedToId: row.assignedToId,
          })
        }

        created++
      }
    })

    for (const target of notifyTargets) {
      await notifyLeadAssigned({
        leadId: target.leadId,
        leadName: target.leadName,
        assignedToId: target.assignedToId,
        assignedById: admin.id,
        assignedByName: admin.name,
      })
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/leads")

    return {
      success: true,
      message: `Imported ${created} lead${created === 1 ? "" : "s"}${skipped.length ? `, skipped ${skipped.length}` : ""}.`,
      created,
      skipped,
      createdCategories: Array.from(createdCategoryNames),
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to import leads.",
      created: 0,
      skipped: [],
      createdCategories: [],
    }
  }
}
