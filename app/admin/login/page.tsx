import { AdminLoginForm } from "./_components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="relative z-10 w-full max-w-md">
        <AdminLoginForm />
      </div>
    </main>
  )
}
