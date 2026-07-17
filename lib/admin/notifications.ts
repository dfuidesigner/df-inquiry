import { prisma } from "@/lib/prisma"

type NotifyLeadAssignedInput = {
  leadId: string
  leadName: string
  assignedToId: string
  assignedById: string
  assignedByName: string
}

export async function notifyLeadAssigned({
  leadId,
  leadName,
  assignedToId,
  assignedById,
  assignedByName,
}: NotifyLeadAssignedInput) {
  if (assignedToId === assignedById) return

  await prisma.notification.create({
    data: {
      adminId: assignedToId,
      leadId,
      type: "LEAD_ASSIGNED",
      title: "New lead assigned to you",
      message: `${assignedByName} assigned "${leadName}" to you.`,
    },
  })
}
