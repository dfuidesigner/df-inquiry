"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requirePermission } from "@/lib/admin/permissions"
import {
  UpdateCareerSubmissionSchema,
  type UpdateCareerSubmissionInput,
} from "@/lib/validations/career"

type ActionResult = {
  success: boolean
  message: string
}

export async function updateCareerSubmissionAction(
  id: string,
  data: UpdateCareerSubmissionInput
): Promise<ActionResult> {
  try {
    await requirePermission("VIEW_REPORTS")

    const validated = UpdateCareerSubmissionSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid career submission data." }
    }

    await prisma.careerSubmission.update({
      where: { id },
      data: {
        status: validated.data.status,
        adminNote: validated.data.adminNote || null,
      },
    })

    revalidatePath("/admin/careers")
    return { success: true, message: "Career submission updated." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update career submission.",
    }
  }
}
