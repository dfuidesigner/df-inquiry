import { Shield, UserCog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  permissionList,
  requireAdminWithPermissions,
} from "@/lib/admin/permissions"
import { PERMISSION_LABELS } from "@/lib/admin/permission-constants"
import { SettingsClient } from "./_components/settings-client"

export default async function SettingsPage() {
  const admin = await requireAdminWithPermissions()
  const permissions = permissionList(admin)

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b px-4 pt-4 pb-6 sm:flex-row sm:items-center lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your admin profile, password, and access overview.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-4 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your current admin login details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Name
              </p>
              <p className="font-medium">{admin.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Email
              </p>
              <p className="font-medium">{admin.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Role
              </p>
              <Badge>{admin.role.replace("_", " ")}</Badge>
            </div>
          </CardContent>
        </Card>

        <SettingsClient />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>
              Super admins have full access. Other admins see only assigned
              permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {admin.role === "SUPER_ADMIN" ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                You have full super admin access.
              </div>
            ) : permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {PERMISSION_LABELS[permission]}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No permissions are assigned yet. Ask a super admin to grant
                access.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
