"use client"

import { useState } from "react"
import { m as motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { contactSchema, type ContactFormValues } from "@/lib/validations"
import { submitContactForm } from "../actions"

interface ContactSectionProps {
  defeaultService?: string
}

export default function ContactSection({
  defeaultService,
}: ContactSectionProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: defeaultService || "",
      message: "",
      website: "",
      formStart: "",
      source: "Contact Section Form",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)

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

      data.utm_source = parsedUtmData.utm_source || "Direct"
      data.utm_medium = parsedUtmData.utm_medium || ""
      data.utm_campaign = parsedUtmData.utm_campaign || ""
      data.utm_content = parsedUtmData.utm_content || ""
      data.utm_term = parsedUtmData.utm_term || ""

      const response = await submitContactForm(data)

      if (response.success) {
        router.push("/thank-you")
      } else {
        toast.error(
          response.error ||
            "Message sent successfully! We will be in touch soon."
        )
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to send message.")
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full bg-[#f6f7f9] py-16 text-[#111111]" id="contact">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div className="flex flex-col pt-4">
            <h2 className="mb-2 font-mono text-[44px] leading-tight tracking-tight sm:text-[56px]">
              Have a Project?
            </h2>
            <p className="mb-10 bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text font-mono text-[44px] leading-tight tracking-tight text-transparent sm:text-[56px]">
              Let&apos;s talk!
            </p>

            <ul className="mb-12 flex flex-col gap-3 font-gra">
              {[
                "NDA? Absolutely just ask.",
                "We'll respond in 24 hours fast & focused.",
                "Work with senior UX experts, not juniors.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-[15px] font-medium text-gray-800"
                >
                  <svg
                    className="h-5 w-5 shrink-0 text-[#333333]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm6.707 13.707L18.414 9.000l-1.414-1.414-6.293 6.293-3.293-3.293-1.414 1.414 4.707 4.707z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto font-gra">
              <p className="mb-4 text-[15px] font-medium text-gray-800">
                Schedule a call:
              </p>

              <div className="inline-flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 pr-6 shadow-sm">
                <Avatar className="h-14 w-14 rounded-md">
                  <AvatarImage
                    src="/mohan-profile.jpg"
                    alt="Mohan"
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md bg-gray-200 text-lg font-medium text-gray-700">
                    MO
                  </AvatarFallback>
                </Avatar>

                <div className="mr-6">
                  <h4 className="text-[17px] font-semibold">Mohan Sharma</h4>
                  <a
                    href="tel:+917838152753"
                    className="text-[14px] text-gray-500"
                  >
                    +91 7838 152 753
                  </a>{" "}
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4a3aff] text-white transition-transform hover:scale-105"
                  onClick={() => {
                    window.open(
                      "https://wa.me/917838152753?text=Hi%20Mohan,%20I%20would%20like%20to%20schedule%20a%20call.",
                      "_blank"
                    )
                  }}
                  aria-label="Schedule a call on WhatsApp"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative flex h-full w-full items-center justify-center lg:justify-end"
          >
            <div className="w-full rounded-[20px] border border-gray-100 bg-white p-8 font-gra shadow-sm sm:p-10">
              <div className="mb-8 text-center text-gray-900">
                <h3 className="text-xl font-bold">
                  Let&apos;s discuss{" "}
                  <span className="text-[#4a3aff]">your project.</span>
                </h3>
                <p className="mt-2 text-[14px] font-medium text-gray-600">
                  Share your details, and we’ll reply on WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Honeypot Field */}
                <input
                  type="text"
                  {...register("website")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-[12px] font-bold text-gray-800"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter Your Name"
                      {...register("name")}
                      className={`w-full rounded border bg-white px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 ${
                        errors.name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-[12px] font-bold text-gray-800"
                    >
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Your Email"
                      {...register("email")}
                      className={`w-full rounded border bg-white px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="text-[12px] font-bold text-gray-800"
                    >
                      Your Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter Phone Number"
                      {...register("phone")}
                      className={`w-full rounded border bg-white px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-500">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label
                      htmlFor="service"
                      className="text-[12px] font-bold text-gray-800"
                    >
                      What are you looking for?
                    </label>
                    <select
                      id="service"
                      {...register("service")}
                      className={`w-full rounded border bg-white px-3 py-2 text-[13px] text-gray-500 transition outline-none focus:border-blue-500 ${
                        errors.service
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <option value="">Select Service..</option>
                      <option value="website-design">
                        Website Design and Development
                      </option>
                      <option value="mobile-app">Mobile App Development</option>
                      {/* <option value="saas">Custom SaaS Development</option> */}
                                        <option value="SEO">Search Engine Optimization (SEO)</option>

                      <option value="digital-marketing">
                        Digital Marketing
                      </option>
                      <option value="game-development">Game Development</option>
                      <option value="Education-ERP-CRM">
                        Education ERP & CRM
                      </option>
                      <option value="other">Other</option>
                    </select>
                    {errors.service && (
                      <span className="text-[10px] text-red-500">
                        {errors.service.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-[12px] font-bold text-gray-800"
                  >
                    Project Brief
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Enter Your Message"
                    {...register("message")}
                    className="w-full resize-y rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500"
                  />
                  {errors.message && (
                    <span className="text-[10px] text-red-500">
                      {errors.message.message}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1e5bce] py-3 text-[14px] font-bold text-white transition-all hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1 text-[13px] text-gray-500">
                  <span>Prefer a direct message?</span>
                  <a
                    href="mailto:mohan@digitalfueled.com"
                    className="text-[#111111] underline decoration-gray-300 underline-offset-4 hover:decoration-gray-600"
                  >
                    mohan@digitalfueled.com
                  </a>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
