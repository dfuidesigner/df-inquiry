"use server"

import { db } from "@/lib/db"
import { contactSchema, ContactFormValues } from "@/lib/validations"

export async function submitContactForm(data: ContactFormValues) {
  try {
    const parsedData = contactSchema.safeParse(data)

    if (!parsedData.success) {
      return {
        success: false,
        error: "Invalid data. Please check your fields.",
      }
    }

    const formData = parsedData.data

    if (formData.website && formData.website.length > 0) {
      console.log("Bot blocked by honeypot")
      return { success: true }
    }

    if (formData.formStart) {
      const startTime = parseInt(formData.formStart)
      const now = Date.now()

      if (now - startTime < 3000) {
        console.log("Bot blocked by speed check")

        return {
          success: false,
          error: "Slow down! You're moving too fast.",
        }
      }
    }

    const { website, formStart, ...dbData } = formData

    const existingInquiry = await db.inquiry.findFirst({
      where: {
        OR: [{ email: dbData.email }, { phone: dbData.phone }],
      },
    })

    if (existingInquiry) {
      return {
        success: false,
        error: "An inquiry with this email or phone number already exists.",
      }
    }

    await db.inquiry.create({
      data: {
        ...dbData,
        message: dbData.message || "",
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Database Error:", error)

    return {
      success: false,
      error: "Internal server error.",
    }
  }
}
