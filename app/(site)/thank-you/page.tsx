"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, MailSearch, PhoneCall, Rocket } from "lucide-react"

const steps = [
  {
    icon: MailSearch,
    title: "1. We Review",
    description: "Our experts analyze your project brief and requirements.",
  },
  {
    icon: PhoneCall,
    title: "2. We Connect",
    description: "We'll reach out within 24 hours to discuss the details.",
  },
  {
    icon: Rocket,
    title: "3. We Build",
    description: "We prepare a tailored strategy to fuel your digital growth.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  } as const,
}

export default function ThankYouPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a1329] px-4 py-20 font-sans text-white">
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-125 w-125 rounded-full bg-[#d5f04b]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-900/30 ring-1 ring-blue-500/50"
        >
          <svg
            className="h-12 w-12 text-[#3b82f6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-4 font-mono text-4xl tracking-tight sm:text-5xl md:text-6xl"
        >
          Request{" "}
          <span className="bg-linear-to-r from-[#0091DA] to-[#3b82f6] bg-clip-text text-transparent">
            Received.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-lg text-gray-400"
        >
          Thank you for reaching out to Digital Fueled. Your details have been
          securely transmitted to our team.
        </motion.p>

        {/* What Happens Next - Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md transition-colors hover:bg-white/10"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-[#3b82f6]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-gra text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-gra text-[15px] font-bold text-black transition-all hover:scale-105 hover:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to Homepage
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
