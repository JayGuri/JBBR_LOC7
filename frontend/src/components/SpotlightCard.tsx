"use client"

import React, { useRef, useState } from "react"

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string
}

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ children, className = "", spotlightColor = "rgba(255, 219, 219, 0.25)", ...props }, ref) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current || isFocused) return

      const rect = divRef.current.getBoundingClientRect()
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const handleFocus = () => {
      setIsFocused(true)
      setOpacity(0.6)
    }

    const handleBlur = () => {
      setIsFocused(false)
      setOpacity(0)
    }

    const handleMouseEnter = () => {
      setOpacity(0.6)
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setOpacity(0)
      setIsHovered(false)
    }

    return (
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative rounded-xl border border-[#161a34]/10 bg-[#fcfeff] 
          overflow-hidden p-6 transition-all duration-300 ease-in-out
          hover:border-[#161a34]/30 hover:shadow-lg hover:-translate-y-1
          ${isHovered ? "scale-[1.02]" : "scale-100"}
          ${className}
        `}
        {...props}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    )
  },
)

SpotlightCard.displayName = "SpotlightCard"

export default SpotlightCard

