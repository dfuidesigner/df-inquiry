const HEADER_ALIASES: Record<string, string> = {
  name: "name",
  "full name": "name",
  email: "email",
  "email address": "email",
  phone: "phone",
  "phone number": "phone",
  mobile: "phone",
  service: "service",
  message: "message",
  notes: "message",
  status: "status",
  rewardvalue: "rewardValue",
  "lead value": "rewardValue",
  value: "rewardValue",
  source: "source",
  category: "category",
  assignedtoemail: "assignedToEmail",
  "assigned to": "assignedToEmail",
  "assigned to email": "assignedToEmail",
  comment: "comment",
  "admin comment": "comment",
  "admin note": "comment",
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term",
}

export function normalizeImportHeader(header: string) {
  const key = header
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, " ")
    .trim()
  return HEADER_ALIASES[key] ?? null
}

export function normalizeImportRow(row: Record<string, unknown>) {
  const normalized: Record<string, unknown> = {}
  for (const [header, value] of Object.entries(row)) {
    const field = normalizeImportHeader(header)
    if (field && value !== undefined && value !== null && value !== "") {
      normalized[field] = typeof value === "string" ? value.trim() : value
    }
  }
  return normalized
}
