"use client"

import dynamic from "next/dynamic"

const Chatbot = dynamic(() => import("./ChatbotWidget"), {
  ssr: false,
})

export default function ChatbotWrapper() {
  return <Chatbot />
}
