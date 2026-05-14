"use client"

import { useState, useEffect } from "react"
import Script from "next/script"

export function DelayedGads() {
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    const handleInteraction = () => {
      setIsInteractive(true)

      window.removeEventListener("scroll", handleInteraction)
      window.removeEventListener("mousemove", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
    }

    window.addEventListener("scroll", handleInteraction, { passive: true })
    window.addEventListener("mousemove", handleInteraction, { passive: true })
    window.addEventListener("touchstart", handleInteraction, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleInteraction)
      window.removeEventListener("mousemove", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
    }
  }, [])

  if (!isInteractive) return null

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18024116278"
        strategy="afterInteractive"
      />

      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('js', new Date());
          gtag('config', 'AW-18024116278');
        `}
      </Script>
    </>
  )
}
