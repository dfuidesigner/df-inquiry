import { ReactNode } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"

async function logoutAction() {
  "use server"
  ;(await cookies()).delete("admin_session")
  redirect("/admin/login")
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-gra text-slate-900">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            width={160}
            height={45}
            alt="Admin Logo"
            className="w-32 object-contain"
            priority
          />
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            Log out
          </button>
        </form>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
