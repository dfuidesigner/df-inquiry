import { Inter, Cal_Sans, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotest",
})
const fontMono = Cal_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        fontMono.variable,
        spaceGrotesk.variable,
        inter.variable
      )}
    >
      <body>{children}</body>
    </html>
  )
}
