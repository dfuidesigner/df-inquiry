"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react"
import { z } from "zod"

import { AdminLoginSchema } from "@/lib/validations/admin"
import { adminLogin } from "@/actions/admin/login"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type FormValues = z.infer<typeof AdminLoginSchema>

export function AdminLoginForm() {
  const router = useRouter()

  const [serverError, setServerError] = useState("")
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(AdminLoginSchema),
  })

  function onSubmit(values: FormValues) {
    setServerError("")

    startTransition(async () => {
      const result = await adminLogin(values)

      if (!result.success) {
        setServerError(result.message)
        return
      }

      router.push("/admin/dashboard")
      router.refresh()
    })
  }

  return (
    <Card className="w-full overflow-hidden rounded-2xl border-muted-foreground/20 shadow-xl">
      <CardHeader className="space-y-4 px-8 pt-8 pb-6 text-center sm:px-10 sm:pt-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Super Admin Login
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to access the Admin Panel.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8 sm:px-10 sm:pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@supportflow.com"
              className="h-11 bg-background transition-colors focus-visible:ring-primary/50"
              autoComplete="email"
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11 bg-background transition-colors focus-visible:ring-primary/50"
              autoComplete="current-password"
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="h-11 w-full text-base font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
