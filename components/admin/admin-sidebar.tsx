"use client"

import * as React from "react"
import Link from "next/link"
import {
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
  Settings,
  ShieldCheck,
} from "lucide-react"
import type { PermissionKey } from "@/generated/prisma/client"
import { Logo } from "@/components/logo"
import { NavMain } from "@/components/admin/nav-main"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { AdminUser } from "@/types/admin"

type NavigationItem = {
  title: string
  url: string
  icon: LucideIcon
  permissions?: PermissionKey[]
}

const adminNavigation: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Leads",
        url: "/admin/leads",
        icon: ClipboardList,
        permissions: ["VIEW_ALL_LEADS", "VIEW_ASSIGNED_LEADS"],
      },
      {
        title: "Admins",
        url: "/admin/admins",
        icon: ShieldCheck,
        permissions: ["CREATE_ADMIN", "EDIT_ADMIN", "DELETE_ADMIN"],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

type AdminSidebarProps = React.ComponentProps<typeof Sidebar> & {
  admin: AdminUser
}

function canSeeItem(admin: AdminUser, item: NavigationItem) {
  if (admin.role === "SUPER_ADMIN") return true
  if (!item.permissions) return true
  return item.permissions.some((permission) =>
    admin.permissions?.includes(permission)
  )
}

export function AdminSidebar({ admin, ...props }: AdminSidebarProps) {
  const visibleNavigation = adminNavigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canSeeItem(admin, item)),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">DF</span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {visibleNavigation.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser admin={admin} />
      </SidebarFooter>
    </Sidebar>
  )
}
