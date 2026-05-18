import dynamic from "next/dynamic"
import ConsultationSection from "../components/consultation.section"
import StackCards from "../components/stack-card"
import ChatbotWrapper from "../components/chatbot-wrapper"

const AboutSection = dynamic(() => import("../components/about-section"))
const PortfolioSection = dynamic(
  () => import("../components/portfolio-section")
)
const DeliverySection = dynamic(() => import("../components/delivery-section"))
const TechStackSection = dynamic(
  () => import("../components/teach-stack-section")
)
const TestimonialCarousel = dynamic(() => import("../components/testimonial"))
const FAQSection = dynamic(() => import("../components/faq-section"))
const ContactSection = dynamic(() => import("../components/contact-section"))

export const metadata = {
  title: "Mobile App Development Services Delhi | Digital Fueled",
  description:
    "Performance marketing & lead generation experts helping businesses grow online.",
}

const DigitalMarketingPage = () => {
  return (
    <main>
      <ConsultationSection
        title={
          <>
            Custom Mobile App Development Company in Delhi NCR -{" "}
            <span className="text-[#3b82f6]">
              Android, iOS & Cross-Platform Apps
            </span>
          </>
        }
        descriptions={[
          "We build high-performance, scalable, and user-friendly mobile applications for startups, businesses, and enterprises. From idea validation and UI/UX design to development, testing, deployment, and post-launch support, our team delivers secure and feature-rich Android, iOS, and cross-platform mobile apps tailored to your business goals.",
        ]}
      />

      <StackCards priorityId={4} />

      <AboutSection
        badgeText="Marketing Specialists"
        title={
          <>
            Innovative Mobile Apps &{" "}
            <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">
              Scalable Digital Solutions
            </span>
          </>
        }
        descriptions={[
          "Delivering innovative mobile app development services with modern technology, seamless user experience, and business-focused solutions across healthcare, education, ecommerce, travel, fintech, and enterprise industries.",
        ]}
        pointers={[
          "Android & iOS App Development",
          "Flutter & React Native App Solutions",
          "Custom UI/UX Design for Mobile Apps",
          "Startup MVP & Enterprise App Development",
          "API Integration & Admin Panel Development",
          "Secure, Fast & Scalable Mobile Applications",
          "App Store & Play Store Deployment Support",
          "Real-Time Tracking, Chat & Payment Gateway Integration",
          "Ongoing Technical Support & Maintenance",
          "SEO-Friendly App Landing Pages & ASO Support",
        ]}
      />

      <PortfolioSection />
      <DeliverySection />
      <TechStackSection />
      <TestimonialCarousel />
      <FAQSection />
      <ContactSection />
      <ChatbotWrapper />
    </main>
  )
}

export default DigitalMarketingPage
