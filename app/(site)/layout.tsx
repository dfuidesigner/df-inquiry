import { Navbar } from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SourceTracker } from "@/components/source-tracker"
import { Toaster } from "sonner"
export const metadata = {
  title: "Digital Fueled",
  description: "Digital Fueled",
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-clip antialiased">
      <Navbar />
      {children}
      <Footer />
      <SourceTracker />
      <Toaster />
    </div>
  )
}
