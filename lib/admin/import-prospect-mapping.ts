const HEADER_ALIASES: Record<string, string> = {
  name: "name",
  "full name": "name",
  email: "email",
  "email address": "email",
  phone: "phone",
  "phone number": "phone",
  mobile: "phone",
  category: "category",
  industry: "category",
  "industry type": "category",
  type: "category",
  note: "note",
  notes: "note",
  comment: "note",
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
