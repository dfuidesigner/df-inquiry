"use server"

import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireAdminWithPermissions } from "@/lib/admin/permissions"
import {
  UpdateOwnPasswordSchema,
  type UpdateOwnPasswordInput,
} from "@/lib/validations/admin-settings"

type ActionResult = {
  success: boolean
  message: string
}

export async function updateOwnPasswordAction(
  data: UpdateOwnPasswordInput
): Promise<ActionResult> {
  try {
    const currentAdmin = await requireAdminWithPermissions()

    const validated = UpdateOwnPasswordSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid password data." }
    }

    const admin = await prisma.admin.findUnique({
      where: { id: currentAdmin.id },
      select: { id: true, password: true },
    })

    if (!admin) {
      return { success: false, message: "Admin account not found." }
    }

    const passwordMatches = await bcrypt.compare(
      validated.data.currentPassword,
      admin.password
    )

    if (!passwordMatches) {
      return { success: false, message: "Current password is incorrect." }
    }

    const hashedPassword = await bcrypt.hash(validated.data.newPassword, 10)

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    })

    revalidatePath("/admin/settings")
    return { success: true, message: "Password updated successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update password.",
    }
  }
}

