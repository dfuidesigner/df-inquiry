"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Bell, ClipboardList } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getMyNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationsReadAction,
  type NotificationRow,
} from "@/actions/admin/notifications"
import { formatDateTime } from "@/lib/format"

const POLL_INTERVAL_MS = 20000

export function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Separate transitions: one for user-initiated actions (so their
  // pending state can disable buttons), one for the background poll
  // (so a poll in flight never affects button state).
  const [isPending, startTransition] = useTransition()
  const [, startBackgroundTransition] = useTransition()

  const knownIds = useRef<Set<string>>(new Set())
  const isFirstLoad = useRef(true)

  useEffect(() => {
    // Guards against setting state from a fetch that resolves after this
    // effect has already been cleaned up (unmount, or a newer poll
    // superseding an in-flight one).
    let ignore = false

    async function loadNotifications() {
      try {
        const res = await getMyNotificationsAction()
        if (ignore) return

        // Toast anything we haven't seen yet — skipped on the very first
        // load so the whole inbox doesn't dump toasts on every page refresh.
        if (!isFirstLoad.current) {
          for (const notification of res.notifications) {
            if (!knownIds.current.has(notification.id)) {
              toast(notification.title, {
                description: `${notification.message} · ${formatDateTime(notification.createdAt)}`,
                action: notification.leadId
                  ? {
                      label: "View lead",
                      onClick: () => router.push("/admin/leads"),
                    }
                  : undefined,
              })
            }
          }
        }

        knownIds.current = new Set(res.notifications.map((n) => n.id))
        isFirstLoad.current = false

        // This update is triggered by a background poll, not a user
        // action — marking it a transition tells React it's OK to
        // batch/interrupt it instead of applying it synchronously,
        // which is what the effect warning was flagging.
        startBackgroundTransition(() => {
          setNotifications(res.notifications)
          setUnreadCount(res.unreadCount)
        })
      } catch (error) {
        console.error("Failed to load notifications", error)
      }
    }

    loadNotifications()
    const interval = setInterval(loadNotifications, POLL_INTERVAL_MS)

    return () => {
      ignore = true
      clearInterval(interval)
    }
  }, [router, startBackgroundTransition])

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    })
  }

  function handleNotificationClick(notification: NotificationRow) {
    if (!notification.isRead) {
      startTransition(async () => {
        await markNotificationsReadAction([notification.id])
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        )
        setUnreadCount((count) => Math.max(0, count - 1))
      })
    }
    if (notification.leadId) {
      router.push("/admin/leads")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isPending}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center text-sm text-muted-foreground">
              <ClipboardList className="h-6 w-6" />
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex cursor-pointer flex-col items-start gap-1 py-2 whitespace-normal"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full items-center gap-2">
                  {!notification.isRead && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                  <span className="text-sm font-medium">
                    {notification.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {notification.message}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatDateTime(notification.createdAt)}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
