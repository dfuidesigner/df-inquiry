import { Navbar } from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SourceTracker } from "@/components/source-tracker"
import { Toaster } from "sonner"
import { MotionProvider } from "@/components/provider/MotionProvider"
import { GoogleAdsTag } from "@/components/seo/DelayedGAd"
import { EnquiryProvider } from "@/contexts/EnquiryContext"
import { EnquiryModal } from "@/components/common/EnquiryModal"
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
      <MotionProvider>
        <EnquiryProvider>
          <Navbar />
          {children}
          <Footer />
          <SourceTracker />
          <Toaster />
          <GoogleAdsTag />
          <EnquiryModal />
        </EnquiryProvider>
      </MotionProvider>
    </div>
  )
}
