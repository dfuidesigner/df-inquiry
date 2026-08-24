"use client"

import * as React from "react"
import { m as motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { contactSchema, type ContactFormValues } from "@/lib/validations"
import { submitContactForm } from "@/app/(site)/actions"
import { useEnquiry } from "@/contexts/EnquiryContext"

export function EnquiryModal() {
  const { isEnquiryOpen, setIsEnquiryOpen, selectedService } = useEnquiry()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "other",
      message: "",
      website: "",
      formStart: "",
      source: "Enquiry Popup",
    },
  })

  React.useEffect(() => {
    if (isEnquiryOpen) {
      setValue("service", selectedService)
    }
  }, [isEnquiryOpen, selectedService, setValue])

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
        setIsEnquiryOpen(false)
        reset()
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
    <AnimatePresence>
      {isEnquiryOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEnquiryOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              onClick={() => setIsEnquiryOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                Quick Enquiry
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Leave your details and we&apos;ll get back to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                {...register("website")}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  {...register("name")}
                  className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors outline-none focus:border-black ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  {...register("email")}
                  className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors outline-none focus:border-black ${
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91"
                  {...register("phone")}
                  className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors outline-none focus:border-black ${
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Service of Interest
                </label>
                <select
                  {...register("service")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm transition-colors outline-none focus:border-black"
                >
                  <option value="other">General Enquiry</option>
                  <option value="Website Design and Development">
                    Website Design and Development
                  </option>
                  <option value="Mobile App Development">
                    Mobile App Development
                  </option>
                  <option value="Custom SaaS Development">
                    Custom SaaS Development
                  </option>
                  <option value="SEO">Search Engine Optimization (SEO)</option>
                  <option value="Digital Marketing & SEO">
                    Digital Marketing & SEO
                  </option>
                  <option value="Game Development">Game Development</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  How can we help?
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe your project..."
                  {...register("message")}
                  className={`w-full resize-none rounded-md border px-3 py-2.5 text-sm transition-colors outline-none focus:border-black ${
                    errors.message
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
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
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1e5bce] py-3 text-[14px] font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
