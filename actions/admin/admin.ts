"use server"

import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import {
  hasPermission,
  permissionList,
  requireAdminWithPermissions,
  requirePermission,
} from "@/lib/admin/permissions"
import { ALL_PERMISSIONS } from "@/lib/admin/permission-constants"
import {
  CreateAdminSchema,
  UpdateAdminSchema,
  type CreateAdminInput,
  type UpdateAdminInput,
} from "@/lib/validations/admin-user"
import { Prisma, type PermissionKey } from "@/generated/prisma/client"

type ActionResult = {
  success: boolean
  message: string
}

function normalizedPermissions(permissions?: string[]) {
  const allowed = new Set<string>(ALL_PERMISSIONS)
  return Array.from(new Set(permissions ?? [])).filter((permission) =>
    allowed.has(permission)
  ) as PermissionKey[]
}

function canGrantPermissions(
  currentAdmin: Awaited<ReturnType<typeof requireAdminWithPermissions>>,
  permissions: PermissionKey[]
) {
  if (currentAdmin.role === "SUPER_ADMIN") return true

  const owned = new Set(permissionList(currentAdmin))
  return permissions.every((permission) => owned.has(permission))
}

export async function createAdminAction(
  data: CreateAdminInput
): Promise<ActionResult> {
  try {
    const currentAdmin = await requirePermission("CREATE_ADMIN")

    const validated = CreateAdminSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid admin data." }
    }

    const permissions = normalizedPermissions(validated.data.permissions)
    if (!canGrantPermissions(currentAdmin, permissions)) {
      return {
        success: false,
        message: "You can only grant permissions that you already have.",
      }
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10)

    await prisma.admin.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
        role: validated.data.role,
        isActive: validated.data.isActive,
        permissions: {
          create: permissions.map((permission) => ({ permission })),
        },
      },
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/admins")
    return { success: true, message: "Admin created successfully." }
  } catch (error) {
    console.error(error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, message: "Admin email is already registered." }
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create admin.",
    }
  }
}

export async function updateAdminAction(
  id: string,
  data: UpdateAdminInput
): Promise<ActionResult> {
  try {
    const currentAdmin = await requirePermission("EDIT_ADMIN")

    const validated = UpdateAdminSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: "Invalid admin data." }
    }

    if (id === currentAdmin.id && validated.data.isActive === false) {
      return {
        success: false,
        message: "You cannot deactivate your own account.",
      }
    }

    const targetAdmin = await prisma.admin.findUnique({
      where: { id },
      select: { role: true },
    })

    if (!targetAdmin) {
      return { success: false, message: "Admin not found." }
    }

    if (
      targetAdmin.role === "SUPER_ADMIN" &&
      currentAdmin.role !== "SUPER_ADMIN"
    ) {
      return {
        success: false,
        message: "Only a super admin can edit another super admin.",
      }
    }

    if (
      validated.data.role === "SUPER_ADMIN" &&
      currentAdmin.role !== "SUPER_ADMIN"
    ) {
      return {
        success: false,
        message: "Only a super admin can grant super admin role.",
      }
    }

    const permissions = normalizedPermissions(validated.data.permissions)
    if (
      validated.data.permissions &&
      !canGrantPermissions(currentAdmin, permissions)
    ) {
      return {
        success: false,
        message: "You can only grant permissions that you already have.",
      }
    }

    const passwordData = validated.data.password
      ? { password: await bcrypt.hash(validated.data.password, 10) }
      : {}

    await prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id },
        data: {
          name: validated.data.name,
          email: validated.data.email,
          role: validated.data.role,
          isActive: validated.data.isActive,
          ...passwordData,
        },
      })

      if (validated.data.permissions) {
        await tx.permission.deleteMany({ where: { adminId: id } })
        await tx.permission.createMany({
          data: permissions.map((permission) => ({ adminId: id, permission })),
          skipDuplicates: true,
        })
      }
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/admins")
    return { success: true, message: "Admin updated successfully." }
  } catch (error) {
    console.error(error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, message: "Admin email is already registered." }
      }

      if (error.code === "P2025") {
        return { success: false, message: "Admin not found." }
      }
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update admin.",
    }
  }
}

export async function deleteAdminAction(id: string): Promise<ActionResult> {
  try {
    const currentAdmin = await requirePermission("DELETE_ADMIN")

    if (id === currentAdmin.id) {
      return { success: false, message: "You cannot delete your own account." }
    }

    const targetAdmin = await prisma.admin.findUnique({
      where: { id },
      select: { role: true },
    })

    if (!targetAdmin) {
      return { success: false, message: "Admin not found." }
    }

    if (
      targetAdmin.role === "SUPER_ADMIN" &&
      currentAdmin.role !== "SUPER_ADMIN"
    ) {
      return {
        success: false,
        message: "Only a super admin can delete another super admin.",
      }
    }

    await prisma.admin.delete({ where: { id } })

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/admins")
    return { success: true, message: "Admin deleted successfully." }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete admin.",
    }
  }
}

export async function canManageAdmins() {
  const admin = await requireAdminWithPermissions()
  return {
    canCreate: hasPermission(admin, "CREATE_ADMIN"),
    canEdit: hasPermission(admin, "EDIT_ADMIN"),
    canDelete: hasPermission(admin, "DELETE_ADMIN"),
  }
}
