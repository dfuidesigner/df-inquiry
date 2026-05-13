"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { contactSchema, type ContactFormValues } from "@/lib/validations"
import { submitContactForm } from "../actions"
import { toast } from "sonner"

export default function ConsultationSection() {
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
      service: "",
      message: "",
      website: "",
      formStart: "",
      source: "Consultation Form",
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
        toast.success("Message sent successfully! We will be in touch soon.")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to send message.")
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-24 font-sans text-white sm:py-15">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(/images/bg1.avif)`,
        }}
      />
      <div className="pointer-events-none absolute top-0 left-[-10%] h-125 w-125 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="relative z-10 container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-7 lg:gap-10">
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start justify-end gap-6 lg:col-span-4"
          >
            <div className="space-y-4">
              <div className="mb-2 flex items-center gap-4 text-[10px] font-bold tracking-widest text-[#3b82f6] uppercase">
                <span className="h-px w-8 bg-[#3b82f6]"></span>
                Digital Fueled IT Pvt Ltd
                <span className="h-px w-8 bg-[#3b82f6]"></span>
              </div>

              <h1 className="font-gra text-[40px] leading-[1.1] font-bold tracking-tight text-white md:text-[45px]">
                Website Designing & Digital Marketing{" "}
                <span className="text-[#3b82f6]">Company in Delhi</span>
              </h1>

              <div className="mt-4 space-y-4 leading-relaxed text-gray-300">
                <p className="text-[16px]">
                  Since 2019, Digital Fueled IT Pvt Ltd has been helping
                  businesses build a powerful online presence through creative
                  website designing and performance-driven digital marketing
                  solutions.
                </p>
                <p className="text-[14px]">
                  We develop fast, SEO-friendly, and mobile-responsive websites
                  that not only look professional but also generate leads,
                  sales, and long-term business growth. From{" "}
                  <strong>
                    website development and e-commerce solutions to SEO, Google
                    Ads, and complete digital marketing services
                  </strong>{" "}
                  — we help brands attract the right audience and convert
                  visitors into loyal customers.
                </p>
              </div>
            </div>

            <div className="grid w-full max-w-112.5 grid-cols-4 gap-6 font-gra">
              {[
                { number: "5+", label: "Years Experience" },
                { number: "200+", label: "Clients Served" },
                { number: "50+", label: "Recognitions" },
                { number: "750", label: "Stories Told" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-[#3b82f6]">
                    {stat.number}
                  </span>
                  <p className="text-[11px] text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1e5bce] px-6 py-3 font-gra text-[13px] font-semibold text-white shadow-xl transition-all hover:bg-blue-700">
              Request A Quote <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative flex h-full w-full items-center justify-center lg:col-span-3 lg:justify-end"
          >
            <div className="w-full max-w-150 rounded-xl bg-white p-4 font-gra shadow-[0_0_80px_10px_rgba(255,255,255,0.2)] lg:p-10">
              <div className="mb-8 text-center text-gray-900">
                <h3 className="text-xl font-bold">
                  Let&apos;s discuss{" "}
                  <span className="text-[#1e5bce]">your project.</span>
                </h3>
                <p className="mt-2 text-[14px] font-medium text-gray-600">
                  Share your details, and we’ll book a call at your preferred
                  time.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      <option value="saas">Custom SaaS Development</option>
                      <option value="digital-marketing">
                        Digital Marketing
                      </option>
                      <option value="game-development">Game Development</option>
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
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
