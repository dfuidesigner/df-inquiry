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
      <AboutSection />
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
