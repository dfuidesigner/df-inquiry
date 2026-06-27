"use client"

import React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminFooter } from "@/components/admin/admin-footer"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import { AdminUser } from "@/types/admin"
type AdminShellProps = {
  children: React.ReactNode
  admin: AdminUser
}
export function AdminShell({ children, admin }: AdminShellProps) {
  const { config } = useSidebarConfig()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
      className={config.collapsible === "none" ? "sidebar-none-mode" : ""}
    >
      {config.side === "left" ? (
        <>
          <AdminSidebar
            admin={admin}
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />

          <SidebarInset>
            <AdminHeader />

            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>

            <AdminFooter />
          </SidebarInset>
        </>
      ) : (
        <>
          <SidebarInset>
            <AdminHeader />

            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>

            <AdminFooter />
          </SidebarInset>

          <AdminSidebar
            admin={admin}
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
        </>
      )}
    </SidebarProvider>
  )
}
