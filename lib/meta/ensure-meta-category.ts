import { prisma } from "@/lib/prisma"

const META_CATEGORY_NAME = "Meta Ads"

// Finds (or creates once) the shared "Meta Ads" LeadCategory so every
// auto-imported Meta lead is tagged consistently. Safe to call concurrently
// — falls back to a lookup if two webhook deliveries race to create it.
export async function ensureMetaAdsCategoryId(): Promise<string> {
  const existing = await prisma.leadCategory.findUnique({
    where: { name: META_CATEGORY_NAME },
  })
  if (existing) return existing.id

  try {
    const created = await prisma.leadCategory.create({
      data: { name: META_CATEGORY_NAME },
    })
    return created.id
  } catch {
    const fallback = await prisma.leadCategory.findUnique({
      where: { name: META_CATEGORY_NAME },
    })
    if (fallback) return fallback.id
    throw new Error("Failed to resolve the Meta Ads category.")
  }
}
