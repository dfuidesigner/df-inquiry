"use client"

import * as React from "react"

interface EnquiryContextType {
  isEnquiryOpen: boolean
  setIsEnquiryOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedService: string
  openEnquiry: (service?: string) => void
}

const EnquiryContext = React.createContext<EnquiryContextType | undefined>(
  undefined
)

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = React.useState(false)
  const [selectedService, setSelectedService] = React.useState("other")

  const openEnquiry = (service: string = "other") => {
    setSelectedService(service)
    setIsEnquiryOpen(true)
  }

  React.useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("enquiry_popup_seen")
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        openEnquiry("other")
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
    <EnquiryContext.Provider
      value={{ isEnquiryOpen, setIsEnquiryOpen, selectedService, openEnquiry }}
    >
      {children}
    </EnquiryContext.Provider>
  )
}

export const useEnquiry = () => {
  const context = React.useContext(EnquiryContext)
  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider")
  }
  return context
}
