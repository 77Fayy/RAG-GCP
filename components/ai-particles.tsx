"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Bot, Sparkles, Zap, Brain, Cpu } from "lucide-react"

interface Particle {
  id: number
  x: number
  y: number
  icon: React.ReactNode
  delay: number
  duration: number
}

export default function AIParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const icons = [
      <Bot key="bot" size={20} />,
      <Sparkles key="sparkles" size={16} />,
      <Zap key="zap" size={18} />,
      <Brain key="brain" size={22} />,
      <Cpu key="cpu" size={20} />,
    ]

    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      icon: icons[Math.floor(Math.random() * icons.length)],
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }))

    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-primary/10 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.icon}
        </div>
      ))}
    </div>
  )
}
