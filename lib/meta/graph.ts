const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v21.0"

export type MetaLeadFieldData = { name: string; values: string[] }

export type MetaLeadDetails = {
  id: string
  created_time: string
  form_id?: string
  ad_id?: string
  field_data: MetaLeadFieldData[]
}

export async function fetchMetaLeadDetails(
  leadgenId: string
): Promise<MetaLeadDetails> {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error("META_PAGE_ACCESS_TOKEN is not configured.")
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${leadgenId}?fields=id,created_time,ad_id,form_id,field_data&access_token=${accessToken}`

  const res = await fetch(url)
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Meta Graph API error (${res.status}): ${errorBody}`)
  }

  return res.json()
}
