"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Phone, RefreshCw, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { submitContactForm } from "../actions"

const chatFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
  website: z.string().optional(),
  formStart: z.string().optional(),
  source: z.string().optional(),
})

type ChatFormValues = z.infer<typeof chatFormSchema>

type Option = {
  label: string
  action: string
}

type Message = {
  id: string
  text: string | React.ReactNode
  sender: "bot" | "user"
  options?: Option[]
  isForm?: boolean
  timestamp: string
}
const getCurrentTime = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

const generateId = () => {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 9)
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    text: "Hi there! 👋 I'm the Digital Fueled assistant. How can I help you today?",
    sender: "bot",
    timestamp: getCurrentTime(),
    options: [
      { label: "Explore Services", action: "EXPLORE_SERVICES" },
      { label: "Talk to Sales", action: "TALK_SALES" },
    ],
  },
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const restartChat = () => {
    setMessages([{ ...INITIAL_MESSAGES[0], timestamp: getCurrentTime() }])
  }

  const handleOptionClick = async (option: Option) => {
    addMessage({
      id: generateId(),
      text: option.label,
      sender: "user",
      timestamp: getCurrentTime(),
    })

    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender === "bot" ? { ...msg, options: undefined } : msg
      )
    )

    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsTyping(false)

    switch (option.action) {
      case "EXPLORE_SERVICES":
        addMessage({
          id: generateId(),
          text: "Awesome! What kind of digital product are you looking to build or grow?",
          sender: "bot",
          timestamp: getCurrentTime(),
          options: [
            { label: "Website / Web App", action: "SERVICE_WEB" },
            { label: "Mobile App", action: "SERVICE_MOBILE" },
            { label: "Custom SaaS", action: "SERVICE_SAAS" },
            { label: "Digital Marketing", action: "SERVICE_MARKETING" },
          ],
        })
        break

      case "SERVICE_WEB":
        addMessage({
          id: generateId(),
          text: "We build fast, scalable, and SEO-friendly websites and web applications tailored to your business goals. From engaging landing pages to complex e-commerce solutions, we've got you covered. Would you like to get a custom quote?",
          sender: "bot",
          timestamp: getCurrentTime(),
          options: [
            { label: "Get a Quote", action: "SHOW_FORM" },
            { label: "Talk to Sales", action: "TALK_SALES" },
            { label: "View other services", action: "EXPLORE_SERVICES" },
          ],
        })
        break

      case "SERVICE_MOBILE":
        addMessage({
          id: generateId(),
          text: "We develop high-performance native and cross-platform mobile apps for iOS and Android (using Flutter/React Native) to help you reach customers seamlessly on the go. Ready to discuss your app idea?",
          sender: "bot",
          timestamp: getCurrentTime(),
          options: [
            { label: "Get a Quote", action: "SHOW_FORM" },
            { label: "Talk to Sales", action: "TALK_SALES" },
            { label: "View other services", action: "EXPLORE_SERVICES" },
          ],
        })
        break

      case "SERVICE_SAAS":
        addMessage({
          id: generateId(),
          text: "We design and develop secure, cloud-based SaaS platforms built for scalability. We handle everything from multi-tenant architecture to complex API integrations. Shall we connect to discuss your SaaS vision?",
          sender: "bot",
          timestamp: getCurrentTime(),
          options: [
            { label: "Get a Quote", action: "SHOW_FORM" },
            { label: "Talk to Sales", action: "TALK_SALES" },
            { label: "View other services", action: "EXPLORE_SERVICES" },
          ],
        })
        break

      case "SERVICE_MARKETING":
        addMessage({
          id: generateId(),
          text: "Our data-driven marketing strategies (SEO, Google Ads, Social Media) are designed to attract the right audience, boost your ROI, and scale your revenue. Want to see how we can grow your brand?",
          sender: "bot",
          timestamp: getCurrentTime(),
          options: [
            { label: "Get a Quote", action: "SHOW_FORM" },
            { label: "Talk to Sales", action: "TALK_SALES" },
            { label: "View other services", action: "EXPLORE_SERVICES" },
          ],
        })
        break

      case "SHOW_FORM":
        addMessage({
          id: generateId(),
          text: "Great! Let's grab a few quick details so our experts can prepare a tailored quote and get in touch with you.",
          sender: "bot",
          timestamp: getCurrentTime(),
          isForm: true,
        })
        break

      case "TALK_SALES":
        addMessage({
          id: generateId(),
          text: "Sure! You can drop your details here, or reach out to us directly on WhatsApp for an immediate response.",
          sender: "bot",
          timestamp: getCurrentTime(),
          isForm: true,
        })
        break

      default:
        addMessage({
          id: generateId(),
          text: "I'm not sure how to handle that. Let's start over or connect with a human.",
          sender: "bot",
          timestamp: getCurrentTime(),
          options: [
            { label: "Start Over", action: "EXPLORE_SERVICES" },
            { label: "WhatsApp Us", action: "WHATSAPP" },
          ],
        })
    }
  }

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg])
  }

  const onFormSubmit = async (data: ChatFormValues) => {
    try {
      let parsedUtmData: Record<string, string> = {}

      if (typeof window !== "undefined") {
        try {
          const storedUtm = localStorage.getItem("digitalFueledSource")

          if (storedUtm) {
            parsedUtmData = JSON.parse(storedUtm)
          }
        } catch (error) {
          console.error("Failed to parse UTM data:", error)
        }
      }

      const submissionData = {
        ...data,
        utm_source: parsedUtmData.utm_source || "Direct",
        utm_medium: parsedUtmData.utm_medium || "",
        utm_campaign: parsedUtmData.utm_campaign || "",
        utm_content: parsedUtmData.utm_content || "",
        utm_term: parsedUtmData.utm_term || "",
      }

      const response = await submitContactForm(submissionData)

      if (response.success) {
        toast.success("Message sent successfully!")
        showSuccessMessage(data)
      } else {
        toast.error("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to send message.")
    }
  }

  const showSuccessMessage = async (data: ChatFormValues) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.isForm ? { ...msg, isForm: false } : msg))
    )

    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTyping(false)

    addMessage({
      id: generateId(),
      text: `Thanks, ${data.name}! Our team has received your brief for ${data.service.replace("-", " ")} and will reach out to you at ${data.email} shortly. Have a great day!`,
      sender: "bot",
      timestamp: getCurrentTime(),
      options: [{ label: "Ask something else", action: "EXPLORE_SERVICES" }],
    })
  }

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/917838152753?text=Hi!%20I%20am%20looking%20for%20digital%20services.",
      "_blank"
    )
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-4">
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.1 }}
              onClick={openWhatsApp}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition-all hover:scale-110 active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <span className="pointer-events-none absolute right-16 rounded-md bg-black px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                WhatsApp Us
              </span>
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
              </svg>
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1e5bce] shadow-2xl transition-transform hover:scale-110 active:scale-95"
              aria-label="Open Chat"
            >
              <MessageSquare className="h-8 w-8 text-white" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-6 z-50 flex h-150 max-h-[85vh] w-90 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between bg-linear-to-r from-[#0091DA] to-[#080C5E] p-4 text-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white/20 bg-white">
                  <AvatarImage
                    src="/images/logo.png"
                    alt="Digital Fueled"
                    className="object-contain p-1"
                  />
                  <AvatarFallback className="bg-white text-sm font-bold text-[#080C5E]">
                    DF
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-gra text-[15px] leading-tight font-bold">
                    Digital Fueled
                  </h3>
                  <p className="text-[11px] text-white/80">
                    Online | Ready to help
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={restartChat}
                  title="Restart Chat"
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-20">
              <div className="flex flex-col gap-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex w-full flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                          msg.sender === "user"
                            ? "rounded-tr-sm bg-[#1e5bce] text-white"
                            : "rounded-tl-sm border border-gray-100 bg-white text-gray-800"
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                      <span className="mt-1 px-1 text-[10px] font-medium text-gray-400">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.options && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 flex flex-wrap gap-2"
                      >
                        {msg.options.map((opt) => (
                          <button
                            key={opt.action}
                            onClick={() => {
                              if (opt.action === "WHATSAPP") openWhatsApp()
                              else handleOptionClick(opt)
                            }}
                            className="rounded-full border border-[#1e5bce] bg-white px-3 py-1.5 text-[13px] font-medium text-[#1e5bce] shadow-sm transition-colors hover:bg-[#1e5bce] hover:text-white"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {msg.isForm && (
                      <ChatForm
                        onSubmit={onFormSubmit}
                        onWhatsApp={openWhatsApp}
                      />
                    )}
                  </div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex max-w-[85%] items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm"
                  >
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "300ms" }}
                    />
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="absolute bottom-0 w-full border-t border-gray-100 bg-white p-3 text-center">
              <span className="text-[11px] font-medium text-gray-400">
                ⚡ Powered by Digital Fueled
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ChatForm({
  onSubmit,
  onWhatsApp,
}: {
  onSubmit: (data: ChatFormValues) => Promise<void>
  onWhatsApp: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
      website: "",
      formStart: "",
      source: "Chatbot Form",
    },
  })

  const handleInternalSubmit = async (data: ChatFormValues) => {
    setIsSubmitting(true)
    await onSubmit(data)
    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-2 w-full max-w-[90%] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-[12px] font-bold text-gray-700 uppercase">
          Project Details
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleInternalSubmit)}
        className="flex flex-col gap-2.5 p-4"
      >
        <input
          type="text"
          {...register("website")}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <input
            {...register("name")}
            placeholder="Your Name"
            className={`w-full rounded-md border bg-gray-50 px-3 py-2 text-[13px] transition-colors outline-none focus:border-[#1e5bce] focus:bg-white ${
              errors.name ? "border-red-500 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <span className="mt-1 block text-[10px] text-red-500">
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Your Email"
            className={`w-full rounded-md border bg-gray-50 px-3 py-2 text-[13px] transition-colors outline-none focus:border-[#1e5bce] focus:bg-white ${
              errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <span className="mt-1 block text-[10px] text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <input
            {...register("phone")}
            type="tel"
            placeholder="Phone Number"
            className={`w-full rounded-md border bg-gray-50 px-3 py-2 text-[13px] transition-colors outline-none focus:border-[#1e5bce] focus:bg-white ${
              errors.phone ? "border-red-500 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.phone && (
            <span className="mt-1 block text-[10px] text-red-500">
              {errors.phone.message}
            </span>
          )}
        </div>

        <div>
          <select
            {...register("service")}
            className={`w-full rounded-md border bg-gray-50 px-3 py-2 text-[13px] text-gray-500 transition-colors outline-none focus:border-[#1e5bce] focus:bg-white ${
              errors.service ? "border-red-500 bg-red-50" : "border-gray-200"
            }`}
          >
            <option value="">Select Service..</option>
            <option value="website-design">Website Design & Development</option>
            <option value="mobile-app">Mobile App Development</option>
            <option value="saas">Custom SaaS Development</option>
            <option value="digital-marketing">Digital Marketing</option>
            <option value="game-development">Game Development</option>
            <option value="other">Other</option>
          </select>
          {errors.service && (
            <span className="mt-1 block text-[10px] text-red-500">
              {errors.service.message}
            </span>
          )}
        </div>

        <div>
          <textarea
            {...register("message")}
            rows={2}
            placeholder="Project Brief (Optional)"
            className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] transition-colors outline-none focus:border-[#1e5bce] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-[#1e5bce] py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Send Details <Send className="h-3 w-3" />
            </>
          )}
        </button>

        <div className="relative mt-2 flex items-center justify-center py-1">
          <span className="absolute bg-white px-2 text-[10px] font-medium text-gray-400">
            OR
          </span>
          <div className="h-px w-full bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={onWhatsApp}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-green-500 bg-green-50 py-2.5 text-[13px] font-bold text-green-700 transition-colors hover:bg-green-500 hover:text-white active:scale-[0.98]"
        >
          <Phone className="h-3 w-3" /> Chat on WhatsApp
        </button>
      </form>
    </motion.div>
  )
}
