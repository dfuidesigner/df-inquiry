"use client"

import * as React from "react"
import Link from "next/link"
import {  m as motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const mainLinks = [
  { title: "Services", href: "#services" },
  { title: "About", href: "#about" },
  { title: "Clients", href: "#client" },
  { title: "Work", href: "#portfolio" },
  { title: "Contact Us", href: "#contact" },
]

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.488-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isEnquiryOpen, setIsEnquiryOpen] = React.useState(false)
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)

  const phoneNumber = "+91 7838 152 753"
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`

  React.useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("enquiry_popup_seen")

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsEnquiryOpen(true)
        sessionStorage.setItem("enquiry_popup_seen", "true")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    if (isEnquiryOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isEnquiryOpen])

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md transition-all"
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-3 md:px-6">
          <Link
            href="/"
            className="relative z-50 flex shrink-0 items-center transition-transform hover:scale-105"
          >
            <Image
              src="/images/logo.png"
              width={160}
              height={45}
              alt="Digital Fueled"
              className="w-30 object-contain lg:w-40"
            />
          </Link>

          <nav className="hidden lg:flex lg:items-center lg:gap-2">
            {mainLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="relative rounded-full px-4 py-2 text-[14px] font-bold tracking-wide text-gray-900 uppercase transition-colors"
                onMouseEnter={() => setHoveredItem(link.title)}
              >
                {hoveredItem === link.title && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gray-100/80"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.title}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="relative z-50 flex items-center gap-3 lg:gap-8">
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-gray-900 uppercase transition-colors hover:text-[#1e5bce] sm:text-[15px] lg:text-[18px]"
            >
              <Phone className="h-4 w-4 text-[#1e5bce] lg:h-5 lg:w-5" />
              <span className="whitespace-nowrap">{phoneNumber}</span>
            </a>

            <div className="hidden lg:flex">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[14px] font-bold tracking-wide text-white uppercase transition-transform hover:scale-105 hover:bg-[#20b958]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </Link>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-white px-5 pt-20">
                <div className="flex flex-col gap-6 px-2">
                  <div className="mb-4">
                    <p className="mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                      Menu
                    </p>
                    {mainLinks.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-[#86ef47]"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-6 border-t border-gray-100 pt-8">
                    <Link
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-[14px] font-bold tracking-wide text-white uppercase transition-transform active:scale-95"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      Connect on WhatsApp
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

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

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert("Enquiry Submitted!")
                  setIsEnquiryOpen(false)
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm transition-colors outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm transition-colors outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 234 567 890"
                    className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm transition-colors outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    How can we help?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your project..."
                    className="w-full resize-none rounded-md border border-gray-200 px-3 py-2.5 text-sm transition-colors outline-none focus:border-black"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#1e5bce] py-3 text-[14px] font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
