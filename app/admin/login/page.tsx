import { AdminLoginForm } from "./_components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-blue-50/50 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0e7ff_1px,transparent_1px),linear-gradient(to_bottom,#e0e7ff_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="relative z-10 w-full max-w-md">
        <AdminLoginForm />
      </div>
    </main>
  )
}
