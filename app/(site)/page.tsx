import dynamic from "next/dynamic"

import ConsultationSection from "./components/consultation.section"
import StackCards from "./components/stack-card"

const AboutSection = dynamic(() => import("./components/about-section"))
const PortfolioSection = dynamic(() => import("./components/portfolio-section"))
const DeliverySection = dynamic(() => import("./components/delivery-section"))
const TechStackSection = dynamic(
  () => import("./components/teach-stack-section")
)
const TestimonialCarousel = dynamic(() => import("./components/testimonial"))
const FAQSection = dynamic(() => import("./components/faq-section"))
const ContactSection = dynamic(() => import("./components/contact-section"))
import ChatbotWrapper from "./components/chatbot-wrapper"

export const metadata = {
  title: "Website Designing & Digital Marketing Agency in Delhi",
}
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
      <ChatbotWrapper />
    </main>
  )
}

export default HomePage
