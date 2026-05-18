import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"

async function loginAction(formData: FormData) {
  "use server"
  const password = formData.get("password")

  if (password === process.env.ADMIN_PASSWORD) {
    ;(await cookies()).set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })
    redirect("/admin")
  } else {
    redirect("/admin/login?error=invalid")
  }
}

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <form
        action={loginAction}
        className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
      >
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            width={160}
            height={45}
            alt="Digital Fueled"
            className="w-32 object-contain lg:w-40"
            priority
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 font-gra text-gray-500">
              Admin Access
            </span>
          </div>
        </div>

        <h1 className="text-center font-gra text-2xl font-bold text-gray-900">
          Secure Login
        </h1>

        <p className="-mt-2 text-center text-sm text-gray-600">
          Enter your credentials to access the admin dashboard
        </p>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter admin password"
            required
            autoFocus
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-gray-900 p-3 font-gra font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
        >
          Access Dashboard
        </button>

        <p className="text-center text-xs text-gray-500">
          Protected area • Authorized access only
        </p>
      </form>
    </div>
  )
}
