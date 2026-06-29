"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOwnPasswordAction } from "@/actions/admin/settings"
import {
  UpdateOwnPasswordSchema,
  type UpdateOwnPasswordInput,
} from "@/lib/validations/admin-settings"

export function SettingsClient() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateOwnPasswordInput>({
    resolver: zodResolver(UpdateOwnPasswordSchema),
  })

  function onSubmit(data: UpdateOwnPasswordInput) {
    startTransition(async () => {
      const res = await updateOwnPasswordAction(data)
      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      reset()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Reset Password
        </CardTitle>
        <CardDescription>
          Update the password for your own admin account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              {...register("currentPassword")}
              type="password"
              autoComplete="current-password"
            />
            {errors.currentPassword && (
              <p className="text-xs text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                {...register("newPassword")}
                type="password"
                autoComplete="new-password"
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
