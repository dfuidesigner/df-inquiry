import Image from "next/image"
import Link from "next/link"
import React, { ReactNode } from "react"

interface AnimatedButtonProps {
  children?: ReactNode
  href?: string
  variant?: "primary" | "light" | "lime"
  as?: "link" | "button"
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export const AnimatedButton = ({
  children,
  href = "#",
  variant = "primary",
  as = "link",
  onClick,
  className = "",
}: AnimatedButtonProps) => {
  const styles = {
    primary: {
      button: "bg-[#3f2fee] text-white",
      hoverFill: "bg-[#1b1b1b]",
      arrow: "",
    },
    light: {
      button: "bg-white text-black hover:text-white",
      hoverFill: "bg-[#3f2fee]",
      arrow: "invert transition-all duration-300 group-hover:invert-0",
    },
    lime: {
      button: "bg-[#d5f04b] text-black group-hover:text-white",
      hoverFill: "bg-[#1b1b1b]",
      arrow: "invert transition-all duration-300 group-hover:invert-0",
    },
  }

  const activeStyle = styles[variant]

  const baseClasses = `group relative flex w-max items-center justify-center gap-2 overflow-hidden rounded-full px-3 py-3.5 text-sm leading-tight font-semibold transition-all duration-300 md:px-7 ${activeStyle.button} ${className}`

  const InnerContent = (
    <>
      <div
        className={`absolute top-1/2 left-1/2 h-[calc(100%+4rem)] w-[calc(100%+4rem)] -translate-x-1/2 translate-y-full rounded-[100%] transition-transform duration-500 ease-out group-hover:-translate-y-1/2 ${activeStyle.hoverFill}`}
      />

      <div className="relative z-10 flex-none transition-colors duration-300">
        {children}
      </div>

      <div className="relative z-10 flex h-3 w-3 flex-none items-center justify-center overflow-hidden">
        <div className="relative flex h-full w-full items-center justify-center transition-transform duration-500 ease-out group-hover:translate-x-full group-hover:-translate-y-full">
          <Image
            loading="lazy"
            alt="Arrow icon"
            width={50}
            height={50}
            src="https://cdn.prod.website-files.com/6655d16113e6966ef4eb1041/6906fcf823dbdb59419f53c7_Up%20white.svg"
            className={`h-3 w-3 shrink-0 ${activeStyle.arrow}`}
          />
          <Image
            loading="lazy"
            alt="Arrow icon"
            width={50}
            height={50}
            src="https://cdn.prod.website-files.com/6655d16113e6966ef4eb1041/6906fcf823dbdb59419f53c7_Up%20white.svg"
            className={`absolute top-full -left-full h-3 w-3 shrink-0 ${activeStyle.arrow}`}
          />
        </div>
      </div>
    </>
  )

  if (as === "button") {
    return (
      <button onClick={onClick} className={baseClasses}>
        {InnerContent}
      </button>
    )
  }

  return (
    <Link href={href} className={baseClasses}>
      {InnerContent}
    </Link>
  )
}
