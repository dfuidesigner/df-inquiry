"use server"

import { prisma } from "@/lib/prisma"
import { requireAdminWithPermissions } from "@/lib/admin/permissions"

export type NotificationRow = {
  id: string
  type: string
  title: string
  message: string
  leadId: string | null
  leadName: string | null
  isRead: boolean
  createdAt: string
}

export async function getMyNotificationsAction(): Promise<{
  notifications: NotificationRow[]
  unreadCount: number
}> {
  const admin = await requireAdminWithPermissions()

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { adminId: admin.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { lead: { select: { id: true, name: true } } },
    }),
    prisma.notification.count({ where: { adminId: admin.id, isRead: false } }),
  ])

  return {
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      leadId: n.leadId,
      leadName: n.lead?.name ?? null,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    })),
    unreadCount,
  }
}

export async function markNotificationsReadAction(
  ids: string[]
): Promise<{ success: boolean }> {
  const admin = await requireAdminWithPermissions()
  if (ids.length === 0) return { success: true }

  await prisma.notification.updateMany({
    where: { id: { in: ids }, adminId: admin.id },
    data: { isRead: true },
  })

  return { success: true }
}

export async function markAllNotificationsReadAction(): Promise<{
  success: boolean
}> {
  const admin = await requireAdminWithPermissions()

  await prisma.notification.updateMany({
    where: { adminId: admin.id, isRead: false },
    data: { isRead: true },
  })

  return { success: true }
}
