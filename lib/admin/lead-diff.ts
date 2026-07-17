import { prisma } from "@/lib/prisma"

const LEAD_FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  service: "Service",
  message: "Message",
  status: "Status",
  rewardValue: "Lead Value",
  source: "Source",
  categoryId: "Category",
  assignedToId: "Assigned Admin",
}

export type FieldChange = {
  field: string
  label: string
  from: string | number | null
  to: string | number | null
}

export function diffLeadFields(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): FieldChange[] {
  const changes: FieldChange[] = []

  for (const key of Object.keys(LEAD_FIELD_LABELS)) {
    if (!(key in after)) continue
    const beforeValue = (before[key] ?? null) as string | number | null
    const afterValue = (after[key] ?? null) as string | number | null

    if (String(beforeValue ?? "") !== String(afterValue ?? "")) {
      changes.push({
        field: key,
        label: LEAD_FIELD_LABELS[key],
        from: beforeValue,
        to: afterValue,
      })
    }
  }

  return changes
}

// Replaces raw admin/category IDs in a diff with human-readable names, so
// the activity log shows "Assigned Admin: Priya -> Rahul" instead of cuids.
export async function resolveFriendlyChangeLabels(changes: FieldChange[]) {
  const assignedToChange = changes.find((c) => c.field === "assignedToId")
  const categoryChange = changes.find((c) => c.field === "categoryId")

  const [fromAdmin, toAdmin, fromCategory, toCategory] = await Promise.all([
    assignedToChange?.from
      ? prisma.admin.findUnique({
          where: { id: String(assignedToChange.from) },
          select: { name: true },
        })
      : null,
    assignedToChange?.to
      ? prisma.admin.findUnique({
          where: { id: String(assignedToChange.to) },
          select: { name: true },
        })
      : null,
    categoryChange?.from
      ? prisma.leadCategory.findUnique({
          where: { id: String(categoryChange.from) },
          select: { name: true },
        })
      : null,
    categoryChange?.to
      ? prisma.leadCategory.findUnique({
          where: { id: String(categoryChange.to) },
          select: { name: true },
        })
      : null,
  ])

  if (assignedToChange) {
    assignedToChange.from = fromAdmin?.name ?? "Unassigned"
    assignedToChange.to = toAdmin?.name ?? "Unassigned"
  }
  if (categoryChange) {
    categoryChange.from = fromCategory?.name ?? "Uncategorized"
    categoryChange.to = toCategory?.name ?? "Uncategorized"
  }

  return changes
}
