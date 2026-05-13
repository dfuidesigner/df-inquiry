"use client"

import { motion } from "framer-motion"

const technologies = [
  { id: 1, name: "React", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
  {
    id: 2,
    name: "Next.js",
    iconUrl: "https://cdn.simpleicons.org/nextdotjs/000000",
  },
  { id: 3, name: "Astro", iconUrl: "https://cdn.simpleicons.org/astro/FF5D01" },
  {
    id: 4,
    name: "TypeScript",
    iconUrl: "https://cdn.simpleicons.org/typescript/3178C6",
  },
  {
    id: 5,
    name: "Tailwind",
    iconUrl: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  },
  {
    id: 6,
    name: "Node.js",
    iconUrl: "https://cdn.simpleicons.org/nodedotjs/339933",
  },
  { id: 7, name: "PHP", iconUrl: "https://cdn.simpleicons.org/php/777BB4" },
  {
    id: 8,
    name: "Laravel",
    iconUrl: "https://cdn.simpleicons.org/laravel/FF2D20",
  },
  {
    id: 9,
    name: "Vue.js",
    iconUrl: "https://cdn.simpleicons.org/vuedotjs/4FC08D",
  },
  {
    id: 10,
    name: "PostgreSQL",
    iconUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
  },
  {
    id: 11,
    name: "MongoDB",
    iconUrl: "https://cdn.simpleicons.org/mongodb/47A248",
  },
  {
    id: 12,
    name: "GraphQL",
    iconUrl: "https://cdn.simpleicons.org/graphql/E10098",
  },
  {
    id: 13,
    name: "Supabase",
    iconUrl: "https://cdn.simpleicons.org/supabase/3ECF8E",
  },
  {
    id: 14,
    name: "Prisma",
    iconUrl: "https://cdn.simpleicons.org/prisma/2D3748",
  },
  {
    id: 15,
    name: "Docker",
    iconUrl: "https://cdn.simpleicons.org/docker/2496ED",
  },
  {
    id: 16,
    name: "Redis",
    iconUrl: "https://cdn.simpleicons.org/redis/DC382D",
  },
  {
    id: 17,
    name: "Firebase",
    iconUrl: "https://cdn.simpleicons.org/firebase/FFCA28",
  },
  {
    id: 18,
    name: "Vercel",
    iconUrl: "https://cdn.simpleicons.org/vercel/000000",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 } as const,
  },
}

export default function TechStackSection() {
  return (
    <section className="py-24 font-sans sm:py-32">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-mono text-3xl tracking-tight sm:text-4xl md:text-5xl"
          >
            Powered by <span className="text-[#080C5E]">modern tech</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-gray-500"
          >
            We leverage best-in-class frameworks, languages, and infrastructure
            to build scalable, lightning-fast digital experiences.
          </motion.p>
        </div>

        {/* Tech Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {technologies.map((tech) => (
              <motion.div
                variants={itemVariants}
                key={tech.id}
                whileHover={{
                  y: -8,
                  borderColor: "rgba(0, 145, 218, 0.3)",
                  boxShadow: "0 10px 40px -10px rgba(0, 145, 218, 0.2)",
                }}
                className="group relative flex h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl bg-white"
                style={{
                  border: "1px solid var(--color-gray-400)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tech.iconUrl}
                  alt={`${tech.name} logo`}
                  className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.05))",
                  }}
                />
                <span className="font-gra text-[14px] font-semibold text-gray-700 transition-colors duration-300 group-hover:text-[#0091DA]">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
