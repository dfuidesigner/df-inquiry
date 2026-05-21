"use client"

import { AnimatedButton } from "@/components/common/AnimatedButton"
import { m as motion, useInView } from "framer-motion"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import React, { useEffect, useRef } from "react"
import { useEnquiry } from "@/contexts/EnquiryContext"

function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
}: {
  from?: number
  to: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      const easeProgress = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeProgress * (to - from) + from)

      if (ref.current) {
        ref.current.textContent = currentCount.toString()
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [inView, from, to, duration])

  return <span ref={ref}>{from}</span>
}

interface AboutSectionProps {
  badgeText?: string
  title: React.ReactNode
  descriptions: string[]
  additionalLine?: string
  pointers: string[]
  showAdmissionClients?: boolean
}

const defaultsClients = [
  {
    id: 1,
    src: "/images/client/sehgalneohospital.jpg",
    alt: "Sehgal Hospital",
  },
  { id: 2, src: "/images/client/canon.jpg", alt: "Canon" },
  { id: 3, src: "/images/client/WWF.jpg", alt: "WWF" },
  { id: 4, src: "/images/client/Agarwal-packers.jpg", alt: "Agarwal Packers" },
  { id: 5, src: "/images/client/caho.jpg", alt: "CAHO" },
  { id: 6, src: "/images/client/ahpi.jpg", alt: "AHPI" },
  { id: 7, src: "/images/client/supervity.webp", alt: "Fashion TV" },
  { id: 8, src: "/images/client/Gaur-City-mall.jpg", alt: "Gaur Mall" },
  { id: 9, src: "/images/client/havells-logo.png", alt: "Havells" },
  { id: 10, src: "/images/client/PIndBaluchi.png", alt: "Pind Baluchi" },
  { id: 11, src: "/images/client/magik-logo.png", alt: "Magik" },
  { id: 12, src: "/images/client/paraslogo.png", alt: "Paras" },
  { id: 13, src: "/images/client/century-led.png", alt: "Century" },
  { id: 14, src: "/images/client/fabpiks.jpg", alt: "FabPiks" },
  { id: 15, src: "/images/client/venturaindia.jpg", alt: "Ventura" },
  { id: 16, src: "/images/client/mygleeo.jpg", alt: "Gleeo Health" },
  { id: 17, src: "/images/client/adtu.jpg", alt: "ADTU" },
  { id: 18, src: "/images/client/fhrai.png", alt: "FHRAI" },
  { id: 19, src: "/images/client/harmonia.png", alt: "Blue Bells" },
  { id: 20, src: "/images/client/dost.jpg", alt: "Dost" },
  {
    id: 21,
    src: "/images/client/scientificpathology-logo-hp.png",
    alt: "Scientific Pathology",
  },
  { id: 22, src: "/images/client/finedge-logo.png", alt: "Finedge" },
  { id: 23, src: "/images/client/indorama.svg", alt: "Indorama" },
  { id: 24, src: "/images/client/rg.jpg", alt: "Rate Gain" },
  { id: 25, src: "/images/client/BalajiTyping.jpg", alt: "BalajiTyping" },
  { id: 26, src: "/images/client/blue-bell.png", alt: "Blue Bells" },
  { id: 27, src: "/images/client/p4psi.jpg", alt: "p4psi" },
  { id: 28, src: "/images/client/prakash.svg", alt: "Prakash" },
  { id: 29, src: "/images/client/AGRI-PRO.jpg", alt: "AGRI-PRO" },
  { id: 30, src: "/images/client/century-led.png", alt: "century-led" },
  { id: 31, src: "/images/client/bschool.png", alt: "bhartiyaschoolnigeria" },
  { id: 32, src: "/images/client/moddern-collage.png", alt: "Moddern Collage" },
]

const AdmissionCrmClient = [
  { id: 31, src: "/images/client/bschool.png", alt: "bhartiyaschoolnigeria" },
  { id: 32, src: "/images/client/moddern-collage.png", alt: "Moddern Collage" },
  { id: 25, src: "/images/client/BalajiTyping.jpg", alt: "BalajiTyping" },
  { id: 26, src: "/images/client/blue-bell.png", alt: "Blue Bells" },

  { id: 3, src: "/images/client/WWF.jpg", alt: "WWF" },

  {
    id: 1,
    src: "/images/client/sehgalneohospital.jpg",
    alt: "Sehgal Hospital",
  },
  { id: 2, src: "/images/client/canon.jpg", alt: "Canon" },
  { id: 4, src: "/images/client/Agarwal-packers.jpg", alt: "Agarwal Packers" },
  { id: 5, src: "/images/client/caho.jpg", alt: "CAHO" },
  { id: 6, src: "/images/client/ahpi.jpg", alt: "AHPI" },
  { id: 7, src: "/images/client/supervity.webp", alt: "Fashion TV" },
  { id: 8, src: "/images/client/Gaur-City-mall.jpg", alt: "Gaur Mall" },
  { id: 9, src: "/images/client/havells-logo.png", alt: "Havells" },
  { id: 10, src: "/images/client/PIndBaluchi.png", alt: "Pind Baluchi" },
  { id: 11, src: "/images/client/magik-logo.png", alt: "Magik" },
  { id: 12, src: "/images/client/paraslogo.png", alt: "Paras" },
  { id: 13, src: "/images/client/century-led.png", alt: "Century" },
  // { id: 14, src: "/images/client/fabpiks.jpg", alt: "FabPiks" },
  { id: 15, src: "/images/client/venturaindia.jpg", alt: "Ventura" },
  { id: 16, src: "/images/client/mygleeo.jpg", alt: "Gleeo Health" },
  { id: 17, src: "/images/client/adtu.jpg", alt: "ADTU" },
  { id: 18, src: "/images/client/fhrai.png", alt: "FHRAI" },
  { id: 19, src: "/images/client/harmonia.png", alt: "Blue Bells" },
  // { id: 20, src: "/images/client/dost.jpg", alt: "Dost" },
  {
    id: 21,
    src: "/images/client/scientificpathology-logo-hp.png",
    alt: "Scientific Pathology",
  },
  { id: 22, src: "/images/client/finedge-logo.png", alt: "Finedge" },
  { id: 23, src: "/images/client/indorama.svg", alt: "Indorama" },
  { id: 24, src: "/images/client/rg.jpg", alt: "Rate Gain" },
  { id: 27, src: "/images/client/p4psi.jpg", alt: "p4psi" },
  { id: 28, src: "/images/client/prakash.svg", alt: "Prakash" },
  { id: 29, src: "/images/client/AGRI-PRO.jpg", alt: "AGRI-PRO" },
  { id: 30, src: "/images/client/century-led.png", alt: "century-led" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const,
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const logoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
}

const logoItemVariants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 24 } as const,
  },
}

export default function AboutSection({
  badgeText = "Available for new projects",
  title,
  descriptions,
  additionalLine,
  pointers,
  showAdmissionClients,
}: AboutSectionProps) {
  const { openEnquiry } = useEnquiry()
  const clients = showAdmissionClients ? AdmissionCrmClient : defaultsClients

  return (
    <div className="bg-white text-zinc-900 selection:bg-zinc-200">
      <section className="px-6 py-24 md:py-32 lg:px-8" id="about">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-16 lg:flex-row lg:gap-24">
            {/* LEFT COLUMN */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:w-[55%]"
            >
              <motion.div
                variants={fadeUp}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#080C5E] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#143DA7]"></span>
                </span>
                <span className="font-gra text-xs font-medium text-gray-700">
                  {badgeText}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mb-10 font-mono text-4xl leading-[1.1] text-[#111] md:text-5xl lg:text-[50px]"
              >
                {title}
              </motion.h1>

              <div className="space-y-6">
                {descriptions.map((desc, idx) => (
                  <motion.p
                    key={idx}
                    variants={fadeUp}
                    className="text-[16px] leading-relaxed text-gray-700"
                  >
                    {desc}
                  </motion.p>
                ))}

                {additionalLine && (
                  <motion.p
                    variants={fadeUp}
                    className="text-[16px] leading-relaxed font-medium text-gray-800"
                  >
                    {additionalLine}
                  </motion.p>
                )}
              </div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                {/* Updated AnimatedButton to trigger modal */}
                <AnimatedButton
                  as="button"
                  onClick={() => openEnquiry("other")}
                >
                  Book a call
                </AnimatedButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:w-[45%] lg:pt-24"
            >
              <div className="space-y-6">
                {pointers.map((text, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-[#143DA7]" />
                    </div>
                    <p className="text-lg leading-snug font-medium text-gray-800">
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={fadeUp} className="flex flex-col">
              <h3 className="mb-4 flex items-baseline text-6xl font-light tracking-tighter text-zinc-900 md:text-7xl">
                <AnimatedCounter to={8} duration={2} />
                <span className="text-zinc-400">+</span>
              </h3>
              <p className="mb-2 font-mono text-sm tracking-widest text-zinc-900 uppercase">
                Years
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                Of specialized expertise in digital growth.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col">
              <h3 className="mb-4 flex items-baseline text-6xl font-light tracking-tighter text-zinc-900 md:text-7xl">
                <AnimatedCounter to={300} duration={2.5} />
                <span className="text-zinc-400">+</span>
              </h3>
              <p className="mb-2 font-mono text-sm tracking-widest text-zinc-900 uppercase">
                Clients Served
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                30% International <br /> 70% Indian Clientele
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col">
              <h3 className="mb-4 flex items-baseline text-6xl font-light tracking-tighter text-zinc-900 md:text-7xl">
                <AnimatedCounter to={10} duration={2} />
                <span className="text-zinc-400">+</span>
              </h3>
              <p className="mb-2 font-mono text-sm tracking-widest text-zinc-900 uppercase">
                Recognitions
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                Awards across the industry for design and execution.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col">
              <h3 className="mb-4 flex items-baseline text-6xl font-light tracking-tighter text-zinc-900 md:text-7xl">
                <AnimatedCounter to={250} duration={3} />
                <span className="text-zinc-400">+</span>
              </h3>
              <p className="mb-2 font-mono text-sm tracking-widest text-zinc-900 uppercase">
                Stories Told
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                Through campaigns across all touchpoints of the brand journey.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CLIENTS SECTION */}
      <section
        className="border-t border-zinc-100 bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8"
        id="client"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-mono text-3xl tracking-tight text-gray-900 sm:text-4xl">
              Trusted by the Best of Brands
            </h2>
          </div>

          <motion.div
            variants={logoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-4 lg:grid-cols-5"
          >
            {clients.map((client) => (
              <motion.div
                key={client.id}
                variants={logoItemVariants}
                className="group flex h-32 items-center justify-center bg-white p-6 transition-colors hover:bg-gray-50"
              >
                <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={client.src}
                    alt={client.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-contain transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
