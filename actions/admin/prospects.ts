"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { hasPermission, requirePermission } from "@/lib/admin/permissions"
import {
  ConvertProspectSchema,
  ImportProspectRowSchema,
  type ConvertProspectInput,
  type ImportProspectRow,
} from "@/lib/validations/admin-prospect"
import { notifyLeadAssigned } from "@/lib/admin/notifications"
import { Prisma } from "@/generated/prisma/client"

type ActionResult = { success: boolean; message: string }

export type ImportProspectsResult = {
  success: boolean
  message: string
  created: number
  skipped: Array<{ row: number; reason: string }>
}

export async function importProspectsAction(
  rows: Record<string, unknown>[],
  options: { categoryId?: string | null } = {}
): Promise<ImportProspectsResult> {
  try {
    const admin = await requirePermission("MANAGE_PROSPECTS")

    if (rows.length === 0) {
      return {
        success: false,
        message: "No rows to import.",
        created: 0,
        skipped: [],
      }
    }
    if (rows.length > 500) {
      return {
        success: false,
        message:
          "Import is limited to 500 rows at a time. Please split your file.",
        created: 0,
        skipped: [],
      }
    }

    // Validate the chosen category up front rather than per-row — the
    // whole batch gets the same category now.
    let categoryId: string | null = null
    if (options.categoryId) {
      const category = await prisma.leadCategory.findUnique({
        where: { id: options.categoryId },
      })
      if (!category) {
        return {
          success: false,
          message: "Selected category no longer exists.",
          created: 0,
          skipped: [],
        }
      }
      categoryId = category.id
    }

    const skipped: Array<{ row: number; reason: string }> = []
    const validRows: ImportProspectRow[] = []

    for (let i = 0; i < rows.length; i++) {
      const parsed = ImportProspectRowSchema.safeParse(rows[i])
      if (!parsed.success) {
        skipped.push({
          row: i + 2,
          reason: parsed.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", "),
        })
        continue
      }
      validRows.push(parsed.data)
    }

    let created = 0
    await prisma.$transaction(async (tx) => {
      for (const row of validRows) {
        await tx.prospect.create({
          data: {
            name: row.name,
            email: row.email,
            phone: row.phone,
            note: row.note,
            categoryId,
            source: "Import",
            importedById: admin.id,
          },
        })
        created++
      }
    })

    revalidatePath("/admin/prospects")

    return {
      success: true,
      message: `Imported ${created} prospect${created === 1 ? "" : "s"}${skipped.length ? `, skipped ${skipped.length}` : ""}.`,
      created,
      skipped,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to import prospects.",
      created: 0,
      skipped: [],
    }
  }
}

export async function convertProspectToLeadAction(
  id: string,
  data: ConvertProspectInput
): Promise<ActionResult & { leadId?: string }> {
  try {
    const admin = await requirePermission("MANAGE_PROSPECTS")

    const validated = ConvertProspectSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid conversion data." }
    }

    const prospect = await prisma.prospect.findUnique({ where: { id } })
    if (!prospect) return { success: false, message: "Prospect not found." }
    if (prospect.convertedLeadId) {
      return {
        success: false,
        message: "This prospect has already been converted to a lead.",
      }
    }

    const finalAssignedToId = hasPermission(admin, "ASSIGN_LEAD")
      ? validated.data.assignedToId || admin.id
      : admin.id

    const lead = await prisma.$transaction(async (tx) => {
      const createdLead = await tx.inquiry.create({
        data: {
          name: prospect.name,
          email: prospect.email,
          phone: prospect.phone,
          service: validated.data.service,
          message: validated.data.message || prospect.note,
          status: validated.data.status || "NEW",
          rewardValue: validated.data.rewardValue
            ? parseFloat(validated.data.rewardValue)
            : null,
          source: prospect.source || "Prospect Conversion",
          assignedToId: finalAssignedToId,
        },
      })

      await tx.leadAction.create({
        data: {
          inquiryId: createdLead.id,
          adminId: admin.id,
          actionType: "LEAD_CREATED",
          outcome: validated.data.status || "NEW",
          note: `Converted from an industry prospect by ${admin.name}.`,
        },
      })

      await tx.prospect.update({
        where: { id },
        data: {
          convertedLeadId: createdLead.id,
          convertedAt: new Date(),
          convertedById: admin.id,
        },
      })

      return createdLead
    })

    if (finalAssignedToId) {
      await notifyLeadAssigned({
        leadId: lead.id,
        leadName: lead.name,
        assignedToId: finalAssignedToId,
        assignedById: admin.id,
        assignedByName: admin.name,
      })
    }

    revalidatePath("/admin/prospects")
    revalidatePath("/admin/leads")
    revalidatePath("/admin/dashboard")

    return {
      success: true,
      message: "Converted to a lead successfully.",
      leadId: lead.id,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to convert prospect.",
    }
  }
}

export async function deleteProspectAction(id: string): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_PROSPECTS")
    await prisma.prospect.delete({ where: { id } })

    revalidatePath("/admin/prospects")
    return { success: true, message: "Prospect deleted successfully." }
  } catch (error) {
    console.error(error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, message: "Prospect not found." }
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete prospect.",
    }
  }
}

export async function deleteManyProspectsAction(
  ids: string[]
): Promise<ActionResult & { deletedCount: number }> {
  try {
    await requirePermission("MANAGE_PROSPECTS")
    if (ids.length === 0)
      return {
        success: false,
        message: "No prospects selected.",
        deletedCount: 0,
      }

    const result = await prisma.prospect.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/prospects")

    if (result.count === 0) {
      return {
        success: false,
        message: "None of the selected prospects could be deleted.",
        deletedCount: 0,
      }
    }

    return {
      success: true,
      message: `Deleted ${result.count} prospect${result.count === 1 ? "" : "s"}.`,
      deletedCount: result.count,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete prospects.",
      deletedCount: 0,
    }
  }
}

export async function assignProspectCategoryAction(
  id: string,
  categoryId: string | null
): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_PROSPECTS")
    await prisma.prospect.update({ where: { id }, data: { categoryId } })

    revalidatePath("/admin/prospects")
    return { success: true, message: "Prospect category updated." }
  } catch (error) {
    console.error(error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { success: false, message: "Selected category no longer exists." }
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update category.",
    }
  }
}
