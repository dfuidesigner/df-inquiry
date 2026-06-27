import { NextRequest, NextResponse } from "next/server"

import { verifyAdminJWT } from "@/lib/admin/jwt"
import { ADMIN_COOKIE } from "@/lib/admin/auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get(ADMIN_COOKIE)?.value

  // ===========================
  // Admin Login Route
  // ===========================
  if (pathname === "/admin/login") {
    if (!token) {
      return NextResponse.next()
    }

    try {
      await verifyAdminJWT(token)

      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } catch {
      const response = NextResponse.next()

      response.cookies.delete(ADMIN_COOKIE)

      return response
    }
  }

  // ===========================
  // Protected Admin Routes
  // ===========================
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      await verifyAdminJWT(token)

      return NextResponse.next()
    } catch {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      )

      response.cookies.delete(ADMIN_COOKIE)

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
