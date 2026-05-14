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
  title: "Best Digital Marketing and IT Services | Digital Fueled",
  description:
    "Performance marketing & lead generation experts helping businesses grow online.",
}

const DigitalMarketingPage = () => {
  return (
    <main>
      <ConsultationSection
        title={
          <>
            Digital Marketing Company in Delhi NCR –{" "}
            <span className="text-[#3b82f6]">
              Performance Marketing & Lead Generation Experts
            </span>
          </>
        }
        descriptions={[
          "We offer complete digital marketing services to help businesses grow online, generate quality leads, and increase brand visibility. Our team specializes in SEO, social media marketing, paid advertising, content marketing, and performance campaigns designed to deliver measurable business results and higher ROI.",
        ]}
      />

      <StackCards priorityId={4} />

      <AboutSection
        badgeText="Marketing Specialists"
        title={
          <>
            Targeted Advertising &{" "}
            <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">
              High-Converting Solutions
            </span>
          </>
        }
        descriptions={[
          "Driving business growth through data-driven digital marketing strategies, targeted advertising campaigns, and high-converting online marketing solutions for startups, SMEs, and enterprises across industries.",
        ]}
        pointers={[
          "Complete Digital Marketing Solutions",
          "Social Media Marketing & Management",
          "Google Ads & PPC Campaign Management",
          "Facebook & Instagram Advertising",
          "Lead Generation & Performance Marketing",
          "SEO & Organic Growth Strategies",
          "Content Marketing & Creative Campaigns",
          "Brand Awareness & Online Reputation Management",
          "Ecommerce & Conversion-Focused Marketing",
          "Monthly Reporting & Analytics Tracking",
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
