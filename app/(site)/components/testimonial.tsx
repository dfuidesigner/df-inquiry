"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const getInitials = (name: string) => {
  if (!name) return ""
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

const testimonials = [
  {
    company: "Wild Wisdom",
    text: (
      <>
        &quot;The interactive quiz platform they built is{" "}
        <strong>incredibly engaging</strong>. Our Indian user base loves the
        seamless experience, and the design perfectly captures the essence of
        nature. <strong>Truly impressive work.</strong>&quot;
      </>
    ),
    author: "Aarav Desai",
    role: "Product Head",
    avatar: "/avatar-1.jpg",
  },
  {
    company: "Harmonia",
    text: (
      <>
        &quot;Developing our psychotherapy platform required a delicate touch.
        They delivered a <strong>secure, intuitive, and calming</strong>{" "}
        interface that our therapists and clients absolutely love. Highly
        recommended!&quot;
      </>
    ),
    author: "Dr. Ananya Iyer",
    role: "Founder & Lead Therapist",
    avatar: "/avatar-2.jpg",
  },
  {
    company: "RewardsApp",
    text: (
      <>
        &quot;They transformed our corporate gifting concept into a{" "}
        <strong>powerful B2B SaaS platform</strong>. The user flow is flawless,
        making large-scale corporate gifting a breeze for enterprises.{" "}
        <strong>Absolute pleasure to work with.</strong>&quot;
      </>
    ),
    author: "Kabir Malhotra",
    role: "CEO",
    avatar: "/avatar-3.jpg",
  },
  {
    company: "Gaur City Mall",
    text: (
      <>
        &quot;Our commercial website needed to handle high traffic while
        showcasing a premium shopping experience. The final result is{" "}
        <strong>visually stunning</strong> and highly responsive across all
        devices.&quot;
      </>
    ),
    author: "Priya Sharma",
    role: "Marketing Director",
    avatar: "/avatar-4.jpg",
  },
  {
    company: "Sehgal Neo Hospital",
    text: (
      <>
        &quot;A top-notch digital healthcare experience. They built a{" "}
        <strong>reliable and accessible</strong> platform that makes it easy for
        our patients to find the information, book appointments, and get care
        quickly.&quot;
      </>
    ),
    author: "Rahul Verma",
    role: "IT Administrator",
    avatar: "/avatar-5.jpg",
  },
  {
    company: "RewardsApp",
    text: (
      <>
        &quot;From start to finish, the team was able to deliver exactly what
        our B2B clients needed. The process was smoother than ever, and the{" "}
        <strong>platform&apos;s scalability is top-tier</strong>.&quot;
      </>
    ),
    author: "Neha Gupta",
    role: "VP of HR Operations",
    avatar: "/avatar-6.jpg",
  },
]

export default function TestimonialCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    const onInit = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    onInit()

    // Bind event listeners
    api.on("reInit", onInit)
    api.on("select", onSelect)

    return () => {
      api.off("reInit", onInit)
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <section className="overflow-hidden bg-[#f0f2f5] py-20">
      <div className="w-full pl-4 sm:pl-6 lg:pl-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 max-w-5xl font-mono text-[36px] leading-tight tracking-tight text-[#222222] md:text-[48px]"
        >
          Find your best design with us.{" "}
          <span className="bg-linear-to-tl from-[#0091DA] via-[#143DA7] to-[#080C5E] bg-clip-text text-transparent">
            We guarantee next success is yours!
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mb-10 flex flex-wrap items-center gap-4 font-mono text-sm"
        >
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[#222] shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="font-medium">100% Project Delivery</span>
          </div>
          <p className="text-gray-500">
            Trusted by leading enterprises across India
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative w-full shadow-sm"
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0 flex w-full border-y border-gray-200 font-gra">
              {testimonials.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="flex basis-full flex-col border-r border-gray-200 bg-white p-8 pl-8 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-[20%]"
                >
                  <p className="mb-6 text-[13px] font-semibold text-gray-400">
                    {item.company}
                  </p>

                  <p className="mb-8 text-sm leading-relaxed font-medium text-gray-600">
                    {item.text}
                  </p>

                  <div className="mt-auto flex items-center gap-3 pt-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={item.avatar}
                        alt={item.author}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-200 text-[13px] font-medium text-gray-700">
                        {getInitials(item.author)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="text-[14px] text-[#111111]">
                        {item.author}
                      </h4>
                      <p className="text-[12px] text-gray-500">{item.role}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-10 flex justify-center gap-2 pr-4 sm:pr-6 lg:pr-8"
        >
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                i === current
                  ? "bg-[#333333]"
                  : "bg-[#d4d4d4] hover:bg-[#a3a3a3]"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
