"use client"

import { m as motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight } from "lucide-react"

const faqs = [
  {
    value: "item-1",
    question: "How do I choose a reliable web app development agency?",
    answer:
      "Look for an agency with a strong portfolio, proven client testimonials, and expertise in modern tech stacks. Transparency in communication, a clear development process, and dedicated post-launch support are also key indicators of a reliable partner.",
  },
  {
    value: "item-2",
    question: "How long does it take to build a web application?",
    answer:
      "The timeline varies heavily based on complexity, features, and third-party integrations. A basic web app might take 4-8 weeks, while a more complex, feature-rich platform can take 3-6 months from discovery to launch.",
  },
  {
    value: "item-3",
    question: "Should I hire developers or an agency for app development?",
    answer:
      "If you need full-cycle development, faster delivery, and project management, an agency is the better choice. Hiring individual developers works best for small projects or when you already have a technical team in place.",
  },
  {
    value: "item-4",
    question:
      "How do I choose the right app development company for my business?",
    answer:
      "Evaluate their industry experience, technical proficiency, and understanding of your specific business goals. A great partner doesn't just write code; they offer strategic guidance on user experience, scalability, and market fit to ensure your product succeeds.",
  },
  {
    value: "item-5",
    question: "Is the web application secure?",
    answer:
      "Yes, security is a top priority. We implement industry-standard security measures, including data encryption, secure authentication (like OAuth), regular vulnerability assessments, and compliance with modern data protection regulations to keep your application and user data safe.",
  },
  {
    value: "item-6",
    question: "Do you provide maintenance and support?",
    answer:
      "Absolutely. We offer comprehensive post-launch maintenance and support packages to ensure your web application remains updated, secure, bug-free, and performs optimally as your user base and business requirements grow.",
  },
  {
    value: "item-7",
    question:
      "Do you offer custom web app development service for startups and enterprises?",
    answer:
      "Yes, we cater to both. For startups, we focus on rapid MVP development, strong branding, and scalability to help secure funding. For enterprises, we emphasize robust architecture, complex system integration, and enterprise-grade security.",
  },
  {
    value: "item-8",
    question:
      "Are your web application development services in India available for global clients?",
    answer:
      "Yes! While our development hub is based in India, we work seamlessly with clients worldwide. We easily accommodate different time zones, ensure completely transparent communication through modern project management tools, and deliver global-standard quality.",
  },
  {
    value: "item-9",
    question:
      "Do you build progressive web app development service solutions as well?",
    answer:
      "Yes, we build high-performance Progressive Web Apps (PWAs). PWAs offer native app-like experiences, offline capabilities, push notifications, and fast loading times, perfectly optimized for users on both desktop and mobile devices.",
  },
  {
    value: "item-10",
    question: "How long does it take to develop a custom web application?",
    answer:
      "For a fully custom web application tailored to specific and complex business workflows, the development process typically ranges from 3 to 6 months. This encompasses the entire cycle: discovery, UX/UI design, development, rigorous QA testing, and final deployment.",
  },
]

export default function FAQSection() {
  return (
    <section className="px-4 py-16">
      <div className="container mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 font-mono text-4xl tracking-tight text-[#111111] md:text-[44px] md:leading-tight"
        >
          Frequently asked <br /> questions
        </motion.h2>

        <div className="flex flex-col-reverse gap-12 lg:flex-row lg:items-stretch lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex-1"
          >
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.value}
                  value={faq.value}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="group flex py-6 text-left hover:no-underline [&>.ic-a]:hidden">
                    <span className="pr-4 font-gra text-xl font-medium text-[#111111]">
                      {faq.question}
                    </span>
                    <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 group-data-[state=open]:scale-x-[-1] group-data-[state=open]:rotate-180" />
                  </AccordionTrigger>

                  <AccordionContent className="pb-8">
                    {typeof faq.answer === "string" ? (
                      <p className="pr-10 text-[15px] leading-relaxed text-gray-600">
                        {faq.answer}
                      </p>
                    ) : (
                      faq.answer
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="relative w-full shrink-0 lg:w-95"
          >
            <div className="sticky top-24 rounded-sm bg-[#181818] p-8 shadow-xl">
              <div className="mb-6">
                <Avatar className="h-14 w-14 rounded-sm">
                  <AvatarImage
                    src="/avatar.jpg"
                    alt="Mohan CEO"
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-sm bg-gray-600 text-lg font-medium text-white">
                    MO
                  </AvatarFallback>
                </Avatar>
              </div>

              <p className="mb-8 text-[15px] leading-relaxed font-medium text-white">
                Hi, Feel free to connect with us anytime — we’re here to assist
                you with all your queries and business requirements.
              </p>

              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/917838152753?text=Hi%20Mohan,%20I%20have%20a%20question.",
                    "_blank"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-full bg-[#d5f04b] px-6 py-3.5 text-[15px] font-semibold text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Ask Questions
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
