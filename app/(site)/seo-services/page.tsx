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
  title: "Best SEO Services Company in Delhi NCR | Digital Fueled",
  description:
    "Grow your rankings, traffic, and leads with our result-driven SEO services.",
}

const SeoServicesPage = () => {
  return (
    <main>
      <ConsultationSection
        title={
          <>
            Best SEO Services Company in Delhi NCR –{" "}
            <span className="text-[#3b82f6]">
              Grow Your Rankings, Traffic & Leads
            </span>
          </>
        }
        descriptions={[
          "We provide result-driven SEO services to help businesses improve Google rankings, increase organic traffic, and generate quality leads. Our SEO experts create customized strategies including on-page SEO, technical optimization, content marketing, keyword targeting, and high-quality link building to deliver long-term growth and online visibility.",
        ]}
      />

      <StackCards priorityId={4} />

      <AboutSection
        badgeText="SEO Experts"
        title={
          <>
            Sustainable Organic Growth &{" "}
            <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">
              Data-Driven SEO
            </span>
          </>
        }
        descriptions={[
          "Helping startups, local businesses, and enterprises achieve higher search engine rankings with strategic SEO services, data-driven optimization, and sustainable organic growth solutions.",
        ]}
        pointers={[
          "Complete Website SEO Audit",
          "On-Page & Technical SEO Optimization",
          "Keyword Research & Competitor Analysis",
          "Local SEO & Google Business Profile Optimization",
          "Content Optimization & SEO Copywriting",
          "High-Quality Link Building Strategies",
          "Ecommerce SEO & Enterprise SEO Solutions",
          "Mobile SEO & Website Speed Optimization",
          "Monthly SEO Reports & Performance Tracking",
          "Lead Generation Focused SEO Campaigns",
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

export default SeoServicesPage
