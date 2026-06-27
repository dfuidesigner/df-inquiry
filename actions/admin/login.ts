"use server"

import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

import { prisma } from "@/lib/prisma"
import { signAdminJWT } from "@/lib/admin/jwt"
import { AdminLoginInput, AdminLoginSchema } from "@/lib/validations/admin"
import { ADMIN_COOKIE } from "@/lib/admin/auth"

export async function adminLogin(data: AdminLoginInput) {
  try {
    const validated = AdminLoginSchema.safeParse(data)

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid input.",
      }
    }

    const { email, password } = validated.data

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    })

    if (!admin) {
      return {
        success: false,
        message: "Invalid email or password.",
      }
    }

    if (!admin.password) {
      return {
        success: false,
        message: "Invalid email or password.",
      }
    }

    const valid = await bcrypt.compare(password, admin.password)

    if (!valid) {
      return {
        success: false,
        message: "Invalid email or password.",
      }
    }

    const token = await signAdminJWT({
      id: admin.id,
      role: admin.role,
    })

    const cookieStore = await cookies()

    cookieStore.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      message: "Login successful.",
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: "Something went wrong.",
    }
  }
}
