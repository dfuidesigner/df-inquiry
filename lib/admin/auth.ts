import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { verifyAdminJWT } from "./jwt"

export const ADMIN_COOKIE = "admin-token"
export async function getCurrentAdmin() {
  const cookieStore = await cookies()

  const token = cookieStore.get(ADMIN_COOKIE)?.value

  if (!token) {
    return null
  }

  try {
    const payload = await verifyAdminJWT(token)

    const admin = await prisma.admin.findUnique({
      where: {
        id: payload.id as string,
      },
    })

    return admin
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  return admin
}
