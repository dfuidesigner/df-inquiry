"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const logActionSchema = z.object({
  inquiryId: z.string(),
  actionType: z.enum(["CALL", "EMAIL", "NOTE"]),
  outcome: z.string().min(1, "Please select an outcome"),
  note: z.string().optional(),
  newStatus: z.string(),
})

export async function addLeadAction(_prevState: unknown, formData: FormData) {
  const parsed = logActionSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    actionType: formData.get("actionType"),
    outcome: formData.get("outcome"),
    note: formData.get("note"),
    newStatus: formData.get("newStatus"),
  })

  if (!parsed.success) {
    return {
      error: "Invalid data submitted.",
      fields: parsed.error.flatten().fieldErrors,
    }
  }

  const { inquiryId, actionType, outcome, note, newStatus } = parsed.data

  try {
    await db.$transaction(async (tx) => {
      await tx.leadAction.create({
        data: { inquiryId, actionType, outcome, note },
      })

      await tx.inquiry.update({
        where: { id: inquiryId },
        data: { status: newStatus },
      })
    })

    revalidatePath("/admin")
    return { success: true, timestamp: Date.now() }
  } catch (error) {
    console.error("Error logging action:", error)
    return { error: "Failed to log action." }
  }
}

const adminCreateLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  status: z.string().default("NEW"),
  message: z.string().optional(),
})

export async function createAdminLeadAction(
  _prevState: unknown,
  formData: FormData
) {
  const parsed = adminCreateLeadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    status: formData.get("status"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return {
      error: "Please correct the form errors.",
      fields: parsed.error.flatten().fieldErrors,
    }
  }

  const dbData = parsed.data

  try {
    await db.inquiry.create({
      data: {
        name: dbData.name,
        email: dbData.email,
        phone: dbData.phone,
        service: dbData.service,
        status: dbData.status,
        message: dbData.message || "Manually created via Admin Dashboard",
        source: "ADMIN_MANUAL",
      },
    })

    revalidatePath("/admin")
    return { success: true, timestamp: Date.now() }
  } catch (error) {
    console.error("Database Error creating manual lead:", error)
    return { error: "Failed to create new lead entry." }
  }
}
