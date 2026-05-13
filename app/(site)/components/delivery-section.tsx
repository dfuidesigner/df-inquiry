"use client"

import { AnimatedButton } from "@/components/common/AnimatedButton"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const benefits = [
  "Scalable architecture for business growth",
  "Secure backend and API development",
  "Performance-optimized web apps",
  "Modern frameworks and clean UI/UX",
  "Dedicated support after launch",
  "Seamless integrations with SaaS & CRMs",
]

export default function WhyChooseUsSection() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-top bg-no-repeat px-4 py-16 font-sans text-white sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('/images/bg.avif')`,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-3xl font-mono text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl"
        >
          We build for the future —
          <span className="text-[#0091DA]"> reliable, scalable, and fast.</span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Side: Points & Description - Compacted padding */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8 lg:col-span-7">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-3 font-gra text-xl font-medium tracking-wide text-white sm:text-2xl"
            >
              Why Choose Digital Fueled
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 text-sm leading-relaxed text-gray-400 sm:text-base"
            >
              We build scalable, secure web platforms designed for long-term
              growth and high performance.
            </motion.p>

            {/* Tightened list spacing */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm font-medium text-gray-300">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Testimonial & CTA - Aligned and tightened */}
          <div className="flex flex-col justify-center lg:col-span-5 lg:pl-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-6 text-lg leading-snug font-medium text-gray-200 italic md:text-xl">
                &quot;Digital Fueled is a fantastic design team, with a healthy
                blend of UI and UX skills. Highly recommended.&quot;
              </p>

              <div className="inline-block">
                <AnimatedButton variant="light">Book a call</AnimatedButton>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
