"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { m as motion, AnimatePresence } from "framer-motion"
import {
  X,
  LayoutDashboard,
  BarChart,
  Activity,
  Coins,
  Eye,
  TrendingUp,
  LayoutGrid,
  Building,
  Users,
  Download,
  UserPlus,
  Clock,
  Target,
  MessageSquare,
  LineChart,
  Database,
  Server,
  FileSpreadsheet,
  Copy,
  ShieldCheck,
  HardDrive,
  Key,
  History,
  FileText,
  FileSignature,
  PlusCircle,
  Bell,
  CheckSquare,
  UploadCloud,
  Smartphone,
  Building2,
  MapPin,
  BookOpen,
  Calendar,
  Briefcase,
  Info,
  Settings,
  Megaphone,
  Mail,
  Zap,
  CalendarDays,
  Share2,
  BarChart2,
  Search,
  Shield,
  Lock,
  UserCog,
  KeyRound,
  FileDigit,
  ShieldAlert,
  CheckCircle,
  Monitor,
  DatabaseZap,
  GraduationCap,
  Grid,
  CreditCard,
  CalendarClock,
  Map,
  PlusSquare,
  SlidersHorizontal,
  LayoutTemplate,
  MessageCircle,
  FileBadge,
  MailPlus,
  Palette,
  Settings2,
  Cog,
  BellRing,
  Wallet,
  Link,
  ArrowRight,
} from "lucide-react"
const educationFaqs = [
  {
    value: "item-1",
    question: "What is the Education ERP & CRM Platform?",
    answer:
      "Our platform is an all-in-one solution designed for Universities, Colleges, Schools, and Educational Institutions to manage admissions, enrollments, student journeys, communication, and academic operations efficiently.",
  },
  {
    value: "item-2",
    question: "Who can use this platform?",
    answer:
      "The platform is ideal for: Universities, Colleges, Schools, Coaching Institutes, Training Centers, EdTech Organizations.",
  },
  {
    value: "item-3",
    question: "Does the platform support online admissions?",
    answer:
      "Yes. The platform provides a complete online admission management system including inquiry handling, application forms, document uploads, verification, and enrollment tracking.",
  },
  {
    value: "item-4",
    question: "Can we manage student inquiries and leads?",
    answer:
      "Absolutely. The CRM module helps manage leads, inquiries, follow-ups, counselor activities, and admission conversion tracking from one centralized dashboard.",
  },
  {
    value: "item-5",
    question: "Does the platform include LMS features?",
    answer:
      "Yes. The platform includes LMS capabilities such as: Online classes, Course management, Assignments & assessments, Learning progress tracking, Study material uploads.",
  },
  {
    value: "item-6",
    question: "Is the platform customizable for our institution?",
    answer:
      "Yes. The solution is fully customizable based on your institution’s workflows, departments, admission process, and reporting requirements.",
  },
  {
    value: "item-7",
    question: "Can multiple campuses or branches be managed?",
    answer:
      "Yes. The platform supports multi-campus and multi-branch management with centralized administration and reporting.",
  },
  {
    value: "item-8",
    question: "Is the platform cloud-based?",
    answer:
      "Yes. Our platform is secure, cloud-based, and accessible anytime from desktop, tablet, or mobile devices.",
  },
  {
    value: "item-9",
    question: "Does the system provide reports and analytics?",
    answer:
      "Yes. The platform offers detailed reports and real-time analytics for admissions, lead conversions, student performance, attendance, fee collection, and more.",
  },
  {
    value: "item-10",
    question: "How can we request a demo?",
    answer:
      "You can easily book a free demo by contacting our team. 📞 +91 7838 152 753",
  },
]

import ConsultationSection from "../components/consultation.section"
import ChatbotWrapper from "../components/chatbot-wrapper"

// Dynamic imports for your existing components
const AboutSection = dynamic(() => import("../components/about-section"))
const PortfolioSection = dynamic(
  () => import("../components/portfolio-section")
)
const DeliverySection = dynamic(() => import("../components/delivery-section"))
// const TechStackSection = dynamic(
//   () => import("../components/teach-stack-section")
// )
const TestimonialCarousel = dynamic(() => import("../components/testimonial"))
const FAQSection = dynamic(() => import("../components/faq-section"))
const ContactSection = dynamic(() => import("../components/contact-section"))

// --- EXACT CONTENT DATA PROVIDED (Mapped for the Interactive Layout) ---
const keyFeatures = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { name: "Real-Time Admission Overview", icon: LayoutDashboard },
      { name: "Inquiry & Enrollment Analytics", icon: BarChart },
      { name: "Application Status Tracking", icon: Activity },
      { name: "Revenue & Fee Collection Snapshot", icon: Coins },
      { name: "Student Activity Monitoring", icon: Eye },
      { name: "Performance Insights & Reports", icon: TrendingUp },
      { name: "Customizable Widgets & KPIs", icon: LayoutGrid },
      { name: "Multi-Campus Overview Dashboard", icon: Building },
    ],
  },
  {
    title: "Leads Manager",
    icon: Users,
    items: [
      { name: "Centralized Lead Management", icon: Users },
      { name: "Lead Capture from Multiple Sources", icon: Download },
      { name: "Lead Assignment & Distribution", icon: UserPlus },
      { name: "Automated Follow-Ups & Reminders", icon: Clock },
      { name: "Lead Status Tracking", icon: Target },
      { name: "Counselor Activity Monitoring", icon: Eye },
      { name: "Communication History Management", icon: MessageSquare },
      { name: "Lead Conversion Analytics", icon: LineChart },
    ],
  },
  {
    title: "Raw Data",
    icon: Database,
    items: [
      { name: "Bulk Data Import & Export", icon: Database },
      { name: "Student & Lead Data Repository", icon: Server },
      { name: "CSV / Excel Upload Support", icon: FileSpreadsheet },
      { name: "Duplicate Data Detection", icon: Copy },
      { name: "Data Validation & Cleansing", icon: ShieldCheck },
      { name: "Centralized Data Storage", icon: HardDrive },
      { name: "Secure Data Access Management", icon: Key },
      { name: "Historical Data Records", icon: History },
    ],
  },
  {
    title: "FormDesk",
    icon: FileText,
    items: [
      { name: "Dynamic Admission Form Builder", icon: FileText },
      { name: "Online Application Forms", icon: FileSignature },
      { name: "Custom Field Creation", icon: PlusCircle },
      { name: "Auto Response & Notifications", icon: Bell },
      { name: "Form Submission Tracking", icon: CheckSquare },
      { name: "Document Upload Support", icon: UploadCloud },
      { name: "Mobile Responsive Forms", icon: Smartphone },
    ],
  },
  {
    title: "Institute Manager",
    icon: Building2,
    items: [
      { name: "Multi-Institute Management", icon: Building2 },
      { name: "Campus & Branch Administration", icon: MapPin },
      { name: "Course & Department Management", icon: BookOpen },
      { name: "Academic Session Management", icon: Calendar },
      { name: "Faculty & Staff Management", icon: Users },
      { name: "Program Allocation Management", icon: Briefcase },
      { name: "Institution Profile Management", icon: Info },
      { name: "Centralized Operational Control", icon: Settings },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    items: [
      { name: "Campaign Management", icon: Megaphone },
      { name: "Email & SMS Marketing", icon: Mail },
      { name: "Lead Nurturing Automation", icon: Zap },
      { name: "Event & Webinar Promotions", icon: CalendarDays },
      { name: "Social Media Campaign Tracking", icon: Share2 },
      { name: "Marketing Performance Analytic", icon: BarChart2 },
      { name: "Inquiry Source Tracking", icon: Search },
    ],
  },
  {
    title: "User Access Control",
    icon: ShieldCheck,
    items: [
      { name: "Role-Based User Permissions", icon: Shield },
      { name: "Department-Wise Access Control", icon: Lock },
      { name: "Admin & Sub-Admin Management", icon: UserCog },
      { name: "Secure Login Authentication", icon: KeyRound },
      { name: "Activity & Audit Logs", icon: FileDigit },
      { name: "Password & Security Policies", icon: ShieldAlert },
      { name: "Multi-Level Approval Workflow", icon: CheckCircle },
      { name: "User Session Monitoring", icon: Monitor },
    ],
  },
  {
    title: "Master Data",
    icon: HardDrive,
    items: [
      { name: "Centralized Data Configuration", icon: DatabaseZap },
      { name: "Course & Program Setup", icon: GraduationCap },
      { name: "Category & Department Masters", icon: Grid },
      { name: "Fee Structure Configuration", icon: CreditCard },
      { name: "Academic Year & Session Setup", icon: CalendarClock },
      { name: "Location & Branch Management", icon: Map },
      { name: "Custom Field Management", icon: PlusSquare },
      { name: "Data Standardization Controls", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Template Manager",
    icon: LayoutTemplate,
    items: [
      { name: "Email Template Management", icon: LayoutTemplate },
      { name: "SMS & WhatsApp Templates", icon: MessageCircle },
      { name: "Admission Letter Templates", icon: FileBadge },
      { name: "Automated Communication Templates", icon: MailPlus },
      { name: "Branding & Design Customization", icon: Palette },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { name: "Platform Configuration Management", icon: Settings2 },
      { name: "Workflow Automation Settings", icon: Cog },
      { name: "Notification Preferences", icon: BellRing },
      { name: "Payment Gateway Integration", icon: Wallet },
      { name: "API & Third-Party Integrations", icon: Link },
    ],
  },
]

const galleryImages = [
  "/images/crm/1.jfif",
  "/images/crm/2.jfif",
  "/images/crm/3.jfif",
  "/images/crm/4.jfif",
  "/images/crm/5.jfif",
  "/images/crm/6.jfif",
  "/images/crm/7.jfif",
  "/images/crm/8.jfif",
  "/images/crm/9.jfif",
]

const educationProjects = [
  {
    id: 1,
    title: "Modern Collage",
    type: "(College Management System)",
    tags: ["Education", "ERP", "College"],
    image: "/images/OnlineProject/FullLargeSizeProject/modern-collage.png",
  },
  {
    id: 2,
    title: "ADTU",
    type: "(University ERP System)",
    tags: ["Education", "ERP", "University"],
    image: "/images/OnlineProject/FullLargeSizeProject/adtu.png",
  },
  {
    id: 3,
    title: "OPA",
    type: "(Online Proctoring & Assessment)",
    tags: ["EdTech", "Assessment", "SaaS"],
    image: "/images/OnlineProject/FullLargeSizeProject/opa-new.png",
  },
  {
    id: 4,
    title: "Bhartiya School Nigeria",
    type: "(School Management System)",
    tags: ["Education", "ERP", "School"],
    image: "/images/OnlineProject/FullLargeSizeProject/bhartiaschool.png",
  },
]

export default function EducationERPPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedImage])

  return (
    <main className="bg-white selection:bg-[#0091DA]/20">
      {/* 1. HERO SECTION */}
      <ConsultationSection
        title={
          <>
            Digitize Admissions, Automate Enrollments & Transform{" "}
            <span className="text-[#3b82f6]">Student Management</span>
          </>
        }
        descriptions={[
          "Streamline admissions, automate enrollments, manage student journeys, and improve institutional efficiency — all from one centralized platform built for Universities, Colleges & Schools.",
        ]}
        defeaultService="Education-ERP-CRM"
      />

      {/* 3. NEW SECTION: KEY FEATURES (Interactive Left-Right + Multiple Icons) */}
      <section className="border-y border-zinc-100 bg-zinc-50 py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-mono text-3xl tracking-tight text-[#111] sm:text-4xl md:text-5xl">
              Key Features /{" "}
              <span className="text-[#0091DA]">LMS Features</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
            {/* LEFT SIDE: Feature Navigation List */}
            <div className="sticky top-24 flex w-full flex-col gap-2 lg:w-1/3">
              {keyFeatures.map((feature, idx) => {
                const isActive = activeTab === idx
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`group flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? "bg-[#143DA7] text-white shadow-lg"
                        : "border border-gray-100 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <feature.icon
                        className={`h-5 w-5 ${isActive ? "text-white" : "text-[#143DA7]"}`}
                      />
                      <span className="text-[15px] font-semibold">
                        {feature.title}
                      </span>
                    </div>
                    {isActive && (
                      <ArrowRight className="h-4 w-4 text-white opacity-80" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* RIGHT SIDE: Active Feature's Multiple Icon Grid */}
            <div className="w-full lg:w-2/3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[500px] rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
                >
                  <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="rounded-xl bg-blue-50 p-4 text-[#143DA7]">
                      {React.createElement(keyFeatures[activeTab].icon, {
                        className: "w-8 h-8",
                      })}
                    </div>
                    <h3 className="font-gra text-3xl font-bold text-gray-900">
                      {keyFeatures[activeTab].title} Modules
                    </h3>
                  </div>

                  {/* The Awesome Multiple Icon Grid */}
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                    {keyFeatures[activeTab].items.map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex flex-col items-center rounded-xl border border-gray-100 bg-zinc-50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                      >
                        <div className="mb-4 rounded-full bg-white p-4 text-[#143DA7] shadow-sm transition-colors duration-300 group-hover:bg-[#143DA7] group-hover:text-white">
                          <item.icon className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        <span className="text-[13px] leading-snug font-semibold text-gray-700">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#080C5E] py-24 text-white">
        <div className="absolute inset-0 z-0 bg-[url('/images/bg1.avif')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-mono text-3xl tracking-tight sm:text-4xl md:text-5xl">
              A Glimpse Into the Platform
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Click on any interface below to see how our unified software
              transforms the admission experience.
            </p>
          </div>

          {/* Masonry-style Grid for 9 Images */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {galleryImages.map((src, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedImage(src)}
                className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg"
              >
                <Image
                  src={src}
                  alt={`Platform UI ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-opacity group-hover:opacity-80"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#080C5E] shadow-xl">
                    View Fullscreen
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. LONG DESCRIPTION & WHY CHOOSE US */}
      <AboutSection
        badgeText="Why Choose Our Platform"
        title={
          <>
            Transform Education{" "}
            <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">
              Management
            </span>
          </>
        }
        descriptions={[
          "Managing admissions, student enrollments, inquiries, communication, and academic operations manually can slow down institutional growth and create operational challenges.",
          "Our Education ERP & CRM platform is designed specifically for the education sector to simplify the complete student lifecycle — from lead generation and admissions to enrollment, engagement, and student success.",
          "With powerful automation, centralized data management, and real-time tracking, institutions can improve admissions conversion, enhance communication, reduce manual work, and deliver a seamless experience for students, parents, and administrators.",
          "Whether you are a University, College, School, Coaching Institute, or Training Center, our platform helps you digitize and automate your academic and operational workflows efficiently.",
        ]}
        pointers={[
          "Centralized ERP + CRM + LMS Solution",
          "Built for Universities, Colleges & Schools",
          "Improves Admission Conversion Rate",
          "Reduces Manual Administrative Work",
          "Easy to Use & Scalable Platform",
          "Secure, Reliable & Customizable",
        ]}
      />

      {/* 5. FANCYBOX LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking the image
              className="relative aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-lg shadow-2xl"
            >
              <Image
                src={selectedImage}
                alt="Fullscreen UI"
                fill
                className="bg-black object-contain"
                sizes="100vw"
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeliverySection />
      <PortfolioSection projects={educationProjects} />
      {/* <TechStackSection /> */}
      <TestimonialCarousel />
      <FAQSection faqs={educationFaqs} />
      <ContactSection defeaultService="Education-ERP-CRM" />
      <ChatbotWrapper />
    </main>
  )
}
