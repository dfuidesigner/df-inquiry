"use server"

import { ADMIN_COOKIE } from "@/lib/admin/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function adminLogout() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete(ADMIN_COOKIE)
    redirect("/admin/login")
    // return {
    //   success: true,
    //   message: "Logged out successfully.",
    // }
  } catch (error) {
    console.error(error)
    // return {
    //   success: false,
    //   message: "Something went wrong.",
    // }
  }
}
