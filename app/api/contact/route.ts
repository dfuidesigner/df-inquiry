import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations"

const allowedOrigins = ["https://df-gold.vercel.app", "http://localhost:3000"]

function getCorsHeaders(origin: string | null) {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  })

  if (origin && allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin)
  }

  return headers
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req.headers.get("origin")),
  })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin")

  try {
    const body = await req.json()

    const parsedData = contactSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data. Please check your fields.",
          issues: parsedData.error.flatten(),
        },
        {
          status: 400,
          headers: getCorsHeaders(origin),
        }
      )
    }

    const formData = parsedData.data

    // Honeypot
    if (formData.website && formData.website.length > 0) {
      console.log("Bot blocked by honeypot")

      return NextResponse.json(
        { success: true },
        {
          headers: getCorsHeaders(origin),
        }
      )
    }

    // Speed check
    if (formData.formStart) {
      const startTime = parseInt(formData.formStart)
      const now = Date.now()

      if (now - startTime < 3000) {
        console.log("Bot blocked by speed check")

        return NextResponse.json(
          {
            success: false,
            error: "Slow down! You're moving too fast.",
          },
          {
            status: 429,
            headers: getCorsHeaders(origin),
          }
        )
      }
    }

    const { website, formStart, ...dbData } = formData

    await prisma.inquiry.create({
      data: {
        ...dbData,
        message: dbData.message || "",
      },
    })

    revalidatePath("/admin")

    try {
      const serviceText =
        dbData.service && dbData.service !== "Other"
          ? dbData.service
          : "Thanks for reaching out. We'll review your request and get back to you shortly."

      const cleanPhone = dbData.phone.replace(/\D/g, "")

      const payload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: "df_msg",
          language: {
            code: "en",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: dbData.name,
                },
                {
                  type: "text",
                  text: serviceText,
                },
              ],
            },
          ],
        },
      }

      const response = await fetch(
        `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        console.error("WhatsApp Error:", await response.text())
      }
    } catch (err) {
      console.error("WhatsApp API Error:", err)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully.",
      },
      {
        headers: getCorsHeaders(origin),
      }
    )
  } catch (error) {
    console.error("API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    )
  }
}
