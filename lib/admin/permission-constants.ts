import type { PermissionKey } from "@/generated/prisma/client"

export const ALL_PERMISSIONS: PermissionKey[] = [
  "VIEW_ALL_LEADS",
  "VIEW_ASSIGNED_LEADS",
  "CREATE_LEAD",
  "EDIT_LEAD",
  "DELETE_LEAD",
  "ASSIGN_LEAD",
  "MANAGE_LEAD_CATEGORIES",
  "CREATE_ADMIN",
  "EDIT_ADMIN",
  "DELETE_ADMIN",
  "VIEW_REPORTS",
  "EXPORT_LEADS",
]

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  VIEW_ALL_LEADS: "View all leads",
  VIEW_ASSIGNED_LEADS: "View assigned leads",
  CREATE_LEAD: "Create leads",
  EDIT_LEAD: "Edit leads",
  DELETE_LEAD: "Delete leads",
  ASSIGN_LEAD: "Assign leads",
  CREATE_ADMIN: "Create admins",
  MANAGE_LEAD_CATEGORIES: "Manage lead categories",
  EDIT_ADMIN: "Edit admins",
  DELETE_ADMIN: "Delete admins",
  VIEW_REPORTS: "View reports",
  EXPORT_LEADS: "Export leads",
}
