"use client"

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0a0a0a] py-6 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Digital Fueled. All rights reserved.
        </p>
        <div className="flex flex-col items-center gap-1 text-sm text-gray-400 sm:items-end">
          <p>Digital Fueled IT Pvt Ltd.</p>

          <a
            href="tel:+917838152753"
            className="transition-colors hover:text-white"
          >
            +91 7838 152 753
          </a>
        </div>
      </div>
    </footer>
  )
}
