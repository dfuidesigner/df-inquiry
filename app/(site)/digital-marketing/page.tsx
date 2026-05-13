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
  title: "Digital Marketing Company in Delhi NCR | Digital Fueled",
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
      <Chatbot />
    </main>
  )
}

export default DigitalMarketingPage
