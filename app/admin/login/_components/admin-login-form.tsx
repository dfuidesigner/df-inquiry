"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" // Update: Import Image component
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Loader2 } from "lucide-react"
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
    <Card className="w-full overflow-hidden rounded-2xl border-blue-100 shadow-xl">
      <CardHeader className="space-y-4 px-8 pt-8 pb-6 text-center sm:px-10 sm:pt-10">
        <div className="mx-auto flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Digital Fueled Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight text-blue-950">
            Super Admin Login
          </CardTitle>
          <CardDescription className="text-sm text-blue-700">
            Sign in to access the Admin Panel.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8 sm:px-10 sm:pb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="text-xs font-bold tracking-wider text-blue-900 uppercase"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@digitalfueled.com"
              className="h-11 border-blue-200 bg-white transition-colors focus-visible:border-blue-500 focus-visible:ring-blue-500"
              autoComplete="email"
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="text-xs font-bold tracking-wider text-blue-900 uppercase"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11 border-blue-200 bg-white transition-colors focus-visible:border-blue-500 focus-visible:ring-blue-500" // Update: Theme colors
              autoComplete="current-password"
              disabled={isPending}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs font-medium text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="h-11 w-full bg-blue-700 text-base font-medium text-white hover:bg-blue-800"
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
