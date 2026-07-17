"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import {
  canViewLead,
  leadAccessSelect,
  requireAdminWithPermissions,
  requirePermission,
} from "@/lib/admin/permissions"
import {
  CreateLeadCategorySchema,
  UpdateLeadCategorySchema,
  type CreateLeadCategoryInput,
  type UpdateLeadCategoryInput,
} from "@/lib/validations/admin-lead"
import { Prisma } from "@/generated/prisma/client"

type ActionResult = { success: boolean; message: string }

export async function createLeadCategoryAction(
  data: CreateLeadCategoryInput
): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_LEAD_CATEGORIES")

    const validated = CreateLeadCategorySchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid category data." }
    }

    await prisma.leadCategory.create({
      data: { name: validated.data.name.trim(), color: validated.data.color },
    })

    revalidatePath("/admin/leads")
    return { success: true, message: "Category created successfully." }
  } catch (error) {
    console.error(error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "A category with this name already exists.",
      }
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create category.",
    }
  }
}

export async function updateLeadCategoryAction(
  id: string,
  data: UpdateLeadCategoryInput
): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_LEAD_CATEGORIES")

    const validated = UpdateLeadCategorySchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid category data." }
    }

    await prisma.leadCategory.update({
      where: { id },
      data: {
        ...(validated.data.name ? { name: validated.data.name.trim() } : {}),
        ...(validated.data.color !== undefined
          ? { color: validated.data.color }
          : {}),
      },
    })

    revalidatePath("/admin/leads")
    return { success: true, message: "Category updated successfully." }
  } catch (error) {
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        return {
          success: false,
          message: "A category with this name already exists.",
        }
      if (error.code === "P2025")
        return { success: false, message: "Category not found." }
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update category.",
    }
  }
}

export async function deleteLeadCategoryAction(
  id: string
): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_LEAD_CATEGORIES")
    await prisma.leadCategory.delete({ where: { id } })

    revalidatePath("/admin/leads")
    return {
      success: true,
      message: "Category deleted. Its leads are now uncategorized.",
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete category.",
    }
  }
}

export async function assignLeadCategoryAction(
  id: string,
  categoryId: string | null
): Promise<ActionResult> {
  try {
    const admin = await requirePermission("EDIT_LEAD")

    const lead = await prisma.inquiry.findUnique({
      where: { id },
      // select: { id: true, assignedToId: true },
      select: leadAccessSelect,
    })
    if (!lead) return { success: false, message: "Lead not found." }
    if (!canViewLead(admin, lead)) {
      return { success: false, message: "You do not have access to this lead." }
    }

    await prisma.$transaction(async (tx) => {
      await tx.inquiry.update({ where: { id }, data: { categoryId } })
      await tx.leadAction.create({
        data: {
          inquiryId: id,
          adminId: admin.id,
          actionType: "CATEGORY_UPDATE",
          outcome: categoryId ? "CATEGORIZED" : "UNCATEGORIZED",
          note: `Category updated by ${admin.name}.`,
        },
      })
    })

    revalidatePath("/admin/leads")
    return { success: true, message: "Lead category updated." }
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

export async function listLeadCategoriesAction() {
  await requireAdminWithPermissions()
  return prisma.leadCategory.findMany({ orderBy: { name: "asc" } })
}
