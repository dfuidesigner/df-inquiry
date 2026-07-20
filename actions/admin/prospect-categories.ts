"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/admin/permissions"
import {
  CreateProspectCategorySchema,
  UpdateProspectCategorySchema,
  type CreateProspectCategoryInput,
  type UpdateProspectCategoryInput,
} from "@/lib/validations/admin-prospect"
import { Prisma } from "@/generated/prisma/client"

type ActionResult = { success: boolean; message: string }

export async function createProspectCategoryAction(
  data: CreateProspectCategoryInput
): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_PROSPECTS")

    const validated = CreateProspectCategorySchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid category data." }
    }

    await prisma.prospectCategory.create({
      data: { name: validated.data.name.trim(), color: validated.data.color },
    })

    revalidatePath("/admin/prospects")
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

export async function updateProspectCategoryAction(
  id: string,
  data: UpdateProspectCategoryInput
): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_PROSPECTS")

    const validated = UpdateProspectCategorySchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid category data." }
    }

    await prisma.prospectCategory.update({
      where: { id },
      data: {
        ...(validated.data.name ? { name: validated.data.name.trim() } : {}),
        ...(validated.data.color !== undefined
          ? { color: validated.data.color }
          : {}),
      },
    })

    revalidatePath("/admin/prospects")
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

export async function deleteProspectCategoryAction(
  id: string
): Promise<ActionResult> {
  try {
    await requirePermission("MANAGE_PROSPECTS")
    await prisma.prospectCategory.delete({ where: { id } })

    revalidatePath("/admin/prospects")
    return {
      success: true,
      message: "Category deleted. Its prospects are now uncategorized.",
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
