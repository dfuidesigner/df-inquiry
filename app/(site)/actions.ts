// "use server"

// import { db } from "@/lib/db"
// import { contactSchema, ContactFormValues } from "@/lib/validations"

// export async function submitContactForm(data: ContactFormValues) {
//   try {
//     const parsedData = contactSchema.safeParse(data)

//     if (!parsedData.success) {
//       return {
//         success: false,
//         error: "Invalid data. Please check your fields.",
//       }
//     }

//     const formData = parsedData.data

//     if (formData.website && formData.website.length > 0) {
//       console.log("Bot blocked by honeypot")
//       return { success: true }
//     }

//     if (formData.formStart) {
//       const startTime = parseInt(formData.formStart)
//       const now = Date.now()

//       if (now - startTime < 3000) {
//         console.log("Bot blocked by speed check")

//         return {
//           success: false,
//           error: "Slow down! You're moving too fast.",
//         }
//       }
//     }

//     const { website, formStart, ...dbData } = formData

//     // const existingInquiry = await db.inquiry.findFirst({
//     //   where: {
//     //     OR: [{ email: dbData.email }, { phone: dbData.phone }],
//     //   },
//     // })

//     // if (existingInquiry) {
//     //   return {
//     //     success: false,
//     //     error: "An inquiry with this email or phone number already exists.",
//     //   }
//     // }

//     await db.inquiry.create({
//       data: {
//         ...dbData,
//         message: dbData.message || "",
//       },
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Database Error:", error)

//     return {
//       success: false,
//       error: "Internal server error.",
//     }
//   }
// }

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

    // 1. Save to Database
    await db.inquiry.create({
      data: {
        ...dbData,
        message: dbData.message || "",
      },
    })

    // 2. Setup Brevo SMTP Transporter for Production
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // false for 587, true for 465
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })

    // 3. Define the Email Content (Text & HTML)
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: "digitalfueled@gmail.com",
      subject: `New Website Enquiry from ${dbData.name || "a Visitor"}`,

      // Plain text fallback
      text: `
        You have received a new inquiry from your website.
        
        Name: ${dbData.name || "N/A"}
        Email: ${dbData.email || "N/A"}
        Phone: ${dbData.phone || "N/A"}
        
        Message:
        ${dbData.message || "N/A"}
      `,

      // Rich HTML version
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #333;">New Website Enquiry</h2>
          <p><strong>Name:</strong> ${dbData.name || "N/A"}</p>
          <p><strong>Email:</strong> <a href="mailto:${dbData.email}">${dbData.email || "N/A"}</a></p>
          <p><strong>Phone:</strong> ${dbData.phone || "N/A"}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #555;">${dbData.message || "N/A"}</p>
        </div>
      `,
    }

    // 4. Send the Email
    await transporter.sendMail(mailOptions)

    return { success: true }
  } catch (error) {
    console.error("Server Error:", error)

    return {
      success: false,
      error: "Internal server error.",
    }
  }
}
