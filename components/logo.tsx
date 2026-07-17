import * as React from "react"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ size = 24, className }: LogoProps) {
  return (
    <img
      src="/images/logo.png"
      alt=""
      width={size}
      className={className}
      // {...props}
    />
  )
}
