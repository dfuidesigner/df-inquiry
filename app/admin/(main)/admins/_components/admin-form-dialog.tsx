"use client"

import { useEffect, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import type { PermissionKey } from "@/generated/prisma/client"
import type { AdminUser } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
} from "@/lib/admin/permission-constants"
import {
  AdminFormSchema,
  type AdminFormValues,
  type CreateAdminInput,
  type UpdateAdminInput,
} from "@/lib/validations/admin-user"
import { createAdminAction, updateAdminAction } from "@/actions/admin/admin"
import type { AdminRowData } from "./admins-client"

type AdminFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  admin?: AdminRowData | null
  currentAdmin: AdminUser
}

export function AdminFormDialog({
  open,
  onOpenChange,
  mode,
  admin,
  currentAdmin,
}: AdminFormDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const grantablePermissions = useMemo(() => {
    if (currentAdmin.role === "SUPER_ADMIN") return ALL_PERMISSIONS
    return ALL_PERMISSIONS.filter((permission) =>
      currentAdmin.permissions?.includes(permission)
    )
  }, [currentAdmin])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(AdminFormSchema),
    defaultValues: {
      role: "SALES",
      isActive: true,
      permissions: [],
    },
  })

  const selectedPermissions = watch("permissions") ?? []

  useEffect(() => {
    if (!open) return

    reset({
      name: admin?.name ?? "",
      email: admin?.email ?? "",
      password: "",
      role:
        admin?.role === "SUPER_ADMIN"
          ? "SUPER_ADMIN"
          : admin?.role === "MANAGER"
            ? "MANAGER"
            : "SALES",
      isActive: admin?.isActive ?? true,
      permissions: admin?.permissions ?? [],
    })
  }, [admin, open, reset])

  function togglePermission(permission: PermissionKey, checked: boolean) {
    const next = checked
      ? Array.from(new Set([...selectedPermissions, permission]))
      : selectedPermissions.filter((item) => item !== permission)

    setValue("permissions", next, { shouldDirty: true })
  }

  function onSubmit(values: AdminFormValues) {
    const payload = {
      ...values,
      password: values.password?.trim() || undefined,
    }

    startTransition(async () => {
      const res =
        mode === "edit" && admin
          ? await updateAdminAction(admin.id, payload as UpdateAdminInput)
          : await createAdminAction(payload as CreateAdminInput)

      if (!res.success) {
        toast.error(res.message)
        return
      }

      toast.success(res.message)
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Admin" : "Create Admin"}
          </DialogTitle>
          <DialogDescription>
            Set login details and choose exactly what this admin is allowed to
            do.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Admin name" />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                {...register("password")}
                type="password"
                placeholder={
                  mode === "edit"
                    ? "Leave blank to keep current"
                    : "Minimum 8 characters"
                }
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={watch("role")}
                onValueChange={(value) =>
                  setValue("role", value as AdminFormValues["role"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mode === "edit" && currentAdmin.role === "SUPER_ADMIN" && (
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  )}
                  <SelectItem value="SALES">Sales</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Checkbox
              checked={watch("isActive")}
              onCheckedChange={(checked) =>
                setValue("isActive", checked === true, { shouldDirty: true })
              }
            />
            <div>
              <Label>Active account</Label>
              <p className="text-xs text-muted-foreground">
                Inactive admins cannot access the admin area.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Permissions</Label>
              <p className="text-xs text-muted-foreground">
                Super admins always have every permission. Other admins use
                these assigned permissions.
              </p>
            </div>

            <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
              {grantablePermissions.map((permission) => (
                <label
                  key={permission}
                  className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedPermissions.includes(permission)}
                    onCheckedChange={(checked) =>
                      togglePermission(permission, checked === true)
                    }
                  />
                  <span className="text-sm">
                    {PERMISSION_LABELS[permission]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {mode === "edit" ? "Save Changes" : "Create Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
