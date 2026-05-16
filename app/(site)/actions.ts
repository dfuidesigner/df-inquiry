"use server"

import { db } from "@/lib/db"
import { contactSchema, ContactFormValues } from "@/lib/validations"
import nodemailer from "nodemailer"

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

    // Honeypot check
    if (formData.website && formData.website.length > 0) {
      console.log("Bot blocked by honeypot")
      return { success: true }
    }

    // Speed check
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

    // Save to Database
    await db.inquiry.create({
      data: {
        ...dbData,
        message: dbData.message || "",
      },
    })

    // --- LOCAL TESTING SETUP (Ethereal Email) ---
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    const mailOptions = {
      from: '"Website Form" <test@example.com>',
      to: "digitalfueled@gmail.com",
      subject: `[TEST] New ${dbData.service} Enquiry from ${dbData.name}`,

      // Plain text fallback (now includes Service)
      text: `
        New Enquiry Details:
        
        Name: ${dbData.name}
        Email: ${dbData.email}
        Phone: ${dbData.phone}
        Service Requested: ${dbData.service}
        
        Message:
        ${dbData.message || "No additional message provided."}
      `,

      // Highly Styled HTML version (now includes Service)
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f5; padding: 40px 20px; border-radius: 8px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border-top: 5px solid #2563eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">New Service Enquiry</h2>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 25px;">You have received a new lead from your website contact form.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; width: 35%; color: #4b5563;"><strong>Name</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${dbData.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;"><strong>Email</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${dbData.email}" style="color: #2563eb; text-decoration: none;">${dbData.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;"><strong>Phone</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${dbData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563;"><strong>Service</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">${dbData.service}</td>
              </tr>
            </table>

            <h3 style="color: #374151; margin-bottom: 10px; font-size: 16px;">Message</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; color: #4b5563; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">${dbData.message || "<i>No additional message provided.</i>"}</div>
            
          </div>
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was generated securely from your website.</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    // ---------------------------------------------

    return { success: true }
  } catch (error) {
    console.error("Database Error:", error)

    return {
      success: false,
      error: "Internal server error.",
    }
  }
}
