"use client"

import * as React from "react"

import Link from "next/link"
import { Logo } from "@/components/logo"
// import { SidebarNotification } from "@/components/admin/sidebar-notification"
import { LayoutDashboard, Building2, CreditCard, Settings } from "lucide-react"

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
import { AdminUser } from "@/types/admin"

export const adminNavigation = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Workspaces",
        url: "/admin/workspaces",
        icon: Building2,
      },
      {
        title: "Subscription",
        url: "/admin/subscriptions",
        icon: Building2,
      },
      {
        title: "Plans",
        url: "/admin/plans",
        icon: CreditCard,
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
export function AdminSidebar({ admin, ...props }: AdminSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
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
        {adminNavigation.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* <SidebarNotification /> */}
        <NavUser admin={admin} />
      </SidebarFooter>
    </Sidebar>
  )
}
