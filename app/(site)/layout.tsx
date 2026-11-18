import { Navbar } from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { SourceTracker } from "@/components/source-tracker"
import { Toaster } from "sonner"
import { MotionProvider } from "@/components/provider/MotionProvider"
import { GoogleAdsTag } from "@/components/seo/DelayedGAd"
import { MetaPixel } from "@/components/seo/MetaPixel"
import { EnquiryProvider } from "@/contexts/EnquiryContext"
import { EnquiryModal } from "@/components/common/EnquiryModal"
import Script from "next/script"
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
          <MetaPixel />
          <EnquiryModal />
        </EnquiryProvider>
      </MotionProvider>

      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "zfjqx6siyw");
            `}
      </Script>
    </div>
  )
}
