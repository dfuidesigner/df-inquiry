import AboutSection from "./components/about-section"
import Chatbot from "./components/ChatbotWidget"
import ConsultationSection from "./components/consultation.section"
import ContactSection from "./components/contact-section"
import DeliverySection from "./components/delivery-section"
import FAQSection from "./components/faq-section"
import PortfolioSection from "./components/portfolio-section"
import StackCards from "./components/stack-card"
import TechStackSection from "./components/teach-stack-section"
import TestimonialCarousel from "./components/testimonial"

const HomePage = () => {
  return (
    <main>
      <ConsultationSection />
      <StackCards />

      <AboutSection
        badgeText="Available for new projects"
        title={
          <>
            Custom Software Development Company for{" "}
            <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">
              Web, Mobile, SaaS & AI Automation.
            </span>
          </>
        }
        descriptions={[
          "Digital Fueled IT Pvt Ltd delivers scalable, future-ready software solutions designed to accelerate business growth and digital transformation. Since 2019, we have been helping startups, brands, and enterprises build powerful web applications, high-performance mobile apps, SaaS platforms, and AI-driven automation systems.",
          "From custom software development and cloud-based platforms to intelligent business automation and enterprise solutions — we create secure, scalable, and user-focused digital products that improve efficiency, enhance customer experience, and drive long-term success.",
        ]}
        pointers={[
          "Since 2019, delivering powerful digital solutions for startups, SMEs, and enterprises",
          "Custom Web, Mobile App, SaaS & AI Automation Development",
          "SEO-Friendly, Fast & Scalable Technology Solutions",
          "Result-Driven Digital Marketing & Lead Generation Strategies",
          "Trusted Partner for Business Growth, Automation & Digital Transformation",
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

export default HomePage
