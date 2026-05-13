// SourceTracker
"use client"

import { useEffect } from "react"

export function SourceTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]

    const currentSourceData = Object.fromEntries(
      utmKeys
        .map((key) => [key, params.get(key) || ""])
        .filter(([, value]) => value)
    )

    if (Object.keys(currentSourceData).length > 0) {
      localStorage.setItem(
        "digitalFueledSource",
        JSON.stringify(currentSourceData)
      )
    }
  }, [])

  return null
}
