"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { m as motion, AnimatePresence } from "framer-motion"
import { 
  X, LayoutDashboard, BarChart, Activity, Coins, Eye, TrendingUp, LayoutGrid, Building, 
  Users, Download, UserPlus, Clock, Target, MessageSquare, LineChart, Database, Server, 
  FileSpreadsheet, Copy, ShieldCheck, HardDrive, Key, History, FileText, FileSignature, 
  PlusCircle, Bell, CheckSquare, UploadCloud, Smartphone, Building2, MapPin, BookOpen, 
  Calendar, Briefcase, Info, Settings, Megaphone, Mail, Zap, CalendarDays, Share2, 
  BarChart2, Search, Shield, Lock, UserCog, KeyRound, FileDigit, ShieldAlert, CheckCircle, 
  Monitor, DatabaseZap, GraduationCap, Grid, CreditCard, CalendarClock, Map, PlusSquare, 
  SlidersHorizontal, LayoutTemplate, MessageCircle, FileBadge, MailPlus, Palette, 
  Settings2, Cog, BellRing, Wallet, Link, ArrowRight
} from "lucide-react"

import ConsultationSection from "../components/consultation.section"
import ChatbotWrapper from "../components/chatbot-wrapper"

// Dynamic imports for your existing components
const AboutSection = dynamic(() => import("../components/about-section"))
const PortfolioSection = dynamic(() => import("../components/portfolio-section"))
const DeliverySection = dynamic(() => import("../components/delivery-section"))
const TechStackSection = dynamic(() => import("../components/teach-stack-section"))
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
      { name: "Multi-Campus Overview Dashboard", icon: Building }
    ]
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
      { name: "Lead Conversion Analytics", icon: LineChart }
    ]
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
      { name: "Historical Data Records", icon: History }
    ]
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
      { name: "Mobile Responsive Forms", icon: Smartphone }
    ]
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
      { name: "Centralized Operational Control", icon: Settings }
    ]
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
      { name: "Inquiry Source Tracking", icon: Search }
    ]
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
      { name: "User Session Monitoring", icon: Monitor }
    ]
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
      { name: "Data Standardization Controls", icon: SlidersHorizontal }
    ]
  },
  {
    title: "Template Manager",
    icon: LayoutTemplate,
    items: [
      { name: "Email Template Management", icon: LayoutTemplate },
      { name: "SMS & WhatsApp Templates", icon: MessageCircle },
      { name: "Admission Letter Templates", icon: FileBadge },
      { name: "Automated Communication Templates", icon: MailPlus },
      { name: "Branding & Design Customization", icon: Palette }
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { name: "Platform Configuration Management", icon: Settings2 },
      { name: "Workflow Automation Settings", icon: Cog },
      { name: "Notification Preferences", icon: BellRing },
      { name: "Payment Gateway Integration", icon: Wallet },
      { name: "API & Third-Party Integrations", icon: Link }
    ]
  }
]

// --- DATA: Gallery Images (1-9.jfif) ---
const galleryImages = [
  "/images/crm/1.jfif", "/images/crm/2.jfif", "/images/crm/3.jfif",
  "/images/crm/4.jfif", "/images/crm/5.jfif", "/images/crm/6.jfif",
  "/images/crm/7.jfif", "/images/crm/8.jfif", "/images/crm/9.jfif"
]


export default function EducationERPPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Prevent background scrolling when Fancybox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => { document.body.style.overflow = "auto" }
  }, [selectedImage])

  return (
    <main className="bg-white selection:bg-[#0091DA]/20">
      {/* 1. HERO SECTION */}
      <ConsultationSection
        title={
          <>
            Transform Admissions Into Enrollments with One Powerful{" "}
            <span className="text-[#3b82f6]">Education ERP & CRM</span>
          </>
        }
        descriptions={[
          "Streamline admissions, automate enrollments, manage student journeys, and improve institutional efficiency — all from one centralized platform built for Universities, Colleges & Schools.",
          "✨ Book a Free Demo"
        ]}
      />

      {/* 2. LONG DESCRIPTION & WHY CHOOSE US */}
      <AboutSection
        badgeText="Why Choose Our Platform"
        title={
          <>
            Long <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">Description</span>
          </>
        }
        descriptions={[
          "Managing admissions, student enrollments, inquiries, communication, and academic operations manually can slow down institutional growth and create operational challenges.",
          "Our Education ERP & CRM platform is designed specifically for the education sector to simplify the complete student lifecycle — from lead generation and admissions to enrollment, engagement, and student success.",
          "With powerful automation, centralized data management, and real-time tracking, institutions can improve admissions conversion, enhance communication, reduce manual work, and deliver a seamless experience for students, parents, and administrators.",
          "Whether you are a University, College, School, Coaching Institute, or Training Center, our platform helps you digitize and automate your academic and operational workflows efficiently."
        ]}
        pointers={[
          "Centralized ERP + CRM + LMS Solution",
          "Built for Universities, Colleges & Schools",
          "Improves Admission Conversion Rate",
          "Reduces Manual Administrative Work",
          "Easy to Use & Scalable Platform",
          "Secure, Reliable & Customizable"
        ]}
      />

      {/* 3. NEW SECTION: KEY FEATURES (Interactive Left-Right + Multiple Icons) */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl tracking-tight text-[#111] sm:text-4xl md:text-5xl mb-4">
              Key Features / <span className="text-[#0091DA]">LMS Features</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* LEFT SIDE: Feature Navigation List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2 sticky top-24">
              {keyFeatures.map((feature, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group
                      ${isActive 
                        ? "bg-[#143DA7] text-white shadow-lg" 
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-100"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <feature.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#143DA7]"}`} />
                      <span className="font-semibold text-[15px]">{feature.title}</span>
                    </div>
                    {isActive && <ArrowRight className="w-4 h-4 text-white opacity-80" />}
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
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm min-h-[500px]"
                >
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="bg-blue-50 p-4 rounded-xl text-[#143DA7]">
                      {React.createElement(keyFeatures[activeTab].icon, { className: "w-8 h-8" })}
                    </div>
                    <h3 className="font-gra text-3xl font-bold text-gray-900">
                      {keyFeatures[activeTab].title} Modules
                    </h3>
                  </div>

                  {/* The Awesome Multiple Icon Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {keyFeatures[activeTab].items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="bg-white p-4 rounded-full text-[#143DA7] shadow-sm mb-4 group-hover:bg-[#143DA7] group-hover:text-white transition-colors duration-300">
                          <item.icon className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700 leading-snug">
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

      {/* 4. PLATFORM UI GALLERY (FANCYBOX) */}
      <section className="py-24 bg-[#080C5E] text-white overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('/images/bg1.avif')] bg-cover bg-center"></div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-mono text-3xl tracking-tight sm:text-4xl md:text-5xl mb-4">
              A Glimpse Into the Platform
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Click on any interface below to see how our unified software transforms the admission experience.
            </p>
          </div>

          {/* Masonry-style Grid for 9 Images */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((src, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedImage(src)}
                className="relative aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg group border border-white/10 bg-white/5"
              >
                <Image 
                  src={src} 
                  alt={`Platform UI ${idx + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-opacity group-hover:opacity-80" 
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white text-[#080C5E] px-4 py-2 rounded-full font-semibold text-sm shadow-xl">
                    View Fullscreen
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FANCYBOX LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-10"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking the image
              className="relative w-full max-w-6xl aspect-[16/9] rounded-lg overflow-hidden shadow-2xl"
            >
              <Image 
                src={selectedImage} 
                alt="Fullscreen UI" 
                fill 
                className="object-contain bg-black"
                sizes="100vw"
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. LOWER FUNNEL COMPONENTS */}
      <DeliverySection />
      <PortfolioSection />
      <TechStackSection />
      <TestimonialCarousel />
      <FAQSection />
      <ContactSection />
      <ChatbotWrapper />
    </main>
  )
}