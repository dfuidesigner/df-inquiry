import crypto from "crypto"

// Meta signs every webhook POST with your App Secret, sent in
// X-Hub-Signature-256. Skipping this check means anyone who finds your
// webhook URL could POST fake leads straight into your CRM.
export function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null
) {
  const appSecret = process.env.META_APP_SECRET
  if (!appSecret || !signatureHeader) return false

  const [algo, signature] = signatureHeader.split("=")
  if (algo !== "sha256" || !signature) return false

  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex")

  console.log("Expected:", expected)
  console.log("Provided:", signature)

  const expectedBuffer = Buffer.from(expected, "hex")
  const providedBuffer = Buffer.from(signature, "hex")
  if (expectedBuffer.length !== providedBuffer.length) return false

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}
