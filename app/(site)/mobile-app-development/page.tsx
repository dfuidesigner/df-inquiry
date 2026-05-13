import AboutSection from "../components/about-section"
import Chatbot from "../components/ChatbotWidget"
import ConsultationSection from "../components/consultation.section"
import ContactSection from "../components/contact-section"
import DeliverySection from "../components/delivery-section"
import FAQSection from "../components/faq-section"
import PortfolioSection from "../components/portfolio-section"
import StackCards from "../components/stack-card"
import TechStackSection from "../components/teach-stack-section"
import TestimonialCarousel from "../components/testimonial"

export const metadata = {
  title: "Custom Mobile App Development Company in Delhi NCR | Digital Fueled",
  description:
    "We build high-performance, scalable, and user-friendly mobile applications for startups, businesses, and enterprises.",
}

const MobileAppPage = () => {
  return (
    <main>
      <ConsultationSection
        title={
          <>
            Custom Mobile App Development Company in Delhi NCR –{" "}
            <span className="text-[#3b82f6]">
              Android, iOS & Cross-Platform Apps
            </span>
          </>
        }
        descriptions={[
          "We build high-performance, scalable, and user-friendly mobile applications for startups, businesses, and enterprises. From idea validation and UI/UX design to development, testing, deployment, and post-launch support, our team delivers secure and feature-rich Android, iOS, and cross-platform mobile apps tailored to your business goals.",
        ]}
      />

      <StackCards priorityId={2} />

      <AboutSection
        badgeText="Top App Developers"
        title={
          <>
            Driving Innovation with{" "}
            <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">
              Custom Mobile Solutions
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
      <Chatbot />
    </main>
  )
}

export default MobileAppPage
