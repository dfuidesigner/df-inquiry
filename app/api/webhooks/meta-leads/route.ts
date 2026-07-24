import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"
import { verifyMetaSignature } from "@/lib/meta/verify-signature"
import { fetchMetaLeadDetails } from "@/lib/meta/graph"
import { mapMetaLeadFields } from "@/lib/meta/map-lead"
import { ensureMetaAdsCategoryId } from "@/lib/meta/ensure-meta-category"

// 1. Webhook verification — Meta calls this once when you configure the URL.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN

  if (mode === "subscribe" && token && verifyToken && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse("Forbidden", { status: 403 })
}

// 2. Receive lead notifications.
export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get("x-hub-signature-256")

  if (!verifyMetaSignature(rawBody, signature)) {
    console.error("Meta webhook: invalid signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let body: MetaWebhookPayload
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (body.object !== "page") {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  const leadChanges =
    body.entry?.flatMap((entry) =>
      (entry.changes ?? []).filter((change) => change.field === "leadgen")
    ) ?? []

  // Process each lead independently so one failure doesn't fail the batch —
  // Meta can send multiple leads in a single webhook call.
  for (const change of leadChanges) {
    try {
      await processLeadgenChange(change.value)
    } catch (error) {
      console.error(
        "Meta webhook: failed to process lead",
        change.value?.leadgen_id,
        error
      )
    }
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

type MetaWebhookPayload = {
  object: string
  entry?: Array<{
    changes?: Array<{
      field: string
      value: {
        leadgen_id: string
        form_id?: string
        ad_id?: string
        page_id?: string
      }
    }>
  }>
}

async function processLeadgenChange(value: {
  leadgen_id: string
  form_id?: string
  ad_id?: string
  page_id?: string
}) {
  const leadgenId = value?.leadgen_id
  if (!leadgenId) return

  // Idempotency: skip if we've already stored this lead (Meta retries deliveries).
  const existing = await prisma.inquiry.findUnique({
    where: { metaLeadgenId: leadgenId },
    select: { id: true },
  })
  if (existing) return

  const details = await fetchMetaLeadDetails(leadgenId)
  const mapped = mapMetaLeadFields(details)

  if (!mapped.email && !mapped.phone) {
    console.error(
      "Meta webhook: lead has neither email nor phone, skipping",
      leadgenId
    )
    return
  }

  const categoryId = await ensureMetaAdsCategoryId()

  try {
    const lead = await prisma.inquiry.create({
      data: {
        name: mapped.name,
        email: mapped.email || "not-provided@meta-lead.local",
        phone: mapped.phone || "0000000000",
        service: "Facebook Lead Ad",
        message: mapped.message || null,
        status: "NEW",
        source: "Meta Lead Ads",
        utm_source: "facebook",
        utm_medium: "lead_ad",
        categoryId,
        metaLeadgenId: leadgenId,
        metaFormId: value.form_id ?? details.form_id ?? null,
        metaAdId: value.ad_id ?? details.ad_id ?? null,
        metaPageId: value.page_id ?? null,
      },
    })

    await prisma.leadAction.create({
      data: {
        inquiryId: lead.id,
        adminId: null,
        actionType: "LEAD_CREATED",
        outcome: "NEW",
        note: "Lead created automatically from a Meta (Facebook/Instagram) Lead Ad.",
      },
    })
  } catch (error) {
    // Race condition guard: two webhook deliveries processed concurrently.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return
    }
    throw error
  }
}
