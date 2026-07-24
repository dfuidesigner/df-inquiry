import type { MetaLeadDetails } from "./graph"

const FIELD_ALIASES: Record<string, string> = {
  full_name: "name",
  name: "name",
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  phone_number: "phone",
  phone: "phone",
  city: "city",
  company_name: "company",
  job_title: "jobTitle",
}

export type MappedMetaLead = {
  name: string
  email: string
  phone: string
  message: string
}

function firstValue(values: string[] | undefined) {
  return values?.[0]?.trim() ?? ""
}

export function mapMetaLeadFields(details: MetaLeadDetails): MappedMetaLead {
  const values: Record<string, string> = {}
  const extra: Record<string, string> = {}

  for (const field of details.field_data ?? []) {
    const key = field.name.trim().toLowerCase()
    const mapped = FIELD_ALIASES[key]
    const value = firstValue(field.values)
    if (!value) continue

    if (mapped) {
      values[mapped] = value
    } else {
      // Custom form questions (e.g. "Which service are you interested in?")
      extra[field.name] = value
    }
  }

  const name =
    values.name ||
    [values.firstName, values.lastName].filter(Boolean).join(" ") ||
    "Facebook Lead"

  const messageLines = Object.entries(extra).map(
    ([question, answer]) => `${question}: ${answer}`
  )
  if (values.city) messageLines.push(`City: ${values.city}`)
  if (values.company) messageLines.push(`Company: ${values.company}`)
  if (values.jobTitle) messageLines.push(`Job title: ${values.jobTitle}`)

  return {
    name,
    email: values.email || "",
    phone: values.phone || "",
    message: messageLines.join("\n"),
  }
}
