"use client"
import { useEffect, useMemo } from "react"
import { Bot } from "lucide-react"
import AIParticles from "./ai-particles"
import NeuralNetwork from "./neural-network"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  // ✅ Generate bubble styles once on client
  const bubbles = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      width: `${20 + Math.random() * 40}px`,
      height: `${20 + Math.random() * 40}px`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
    }))
  }, [])

  return (
    <div className="min-h-screen bg-pattern bg-dots bg-grid relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/95 to-accent/10" />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-accent/5 rounded-full animate-float animate-reverse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-secondary/5 rounded-full animate-wave" />
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-primary/5 rounded-full animate-bubble"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 left-1/2 w-20 h-20 bg-accent/5 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* ✅ Fixed Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((style, i) => (
          <div key={i} className="absolute bg-primary/3 rounded-full animate-bubble" style={style} />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <NeuralNetwork />
        <AIParticles />

        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Bot className="w-16 h-16 text-primary-foreground animate-bounce" />
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              AI Training Assistant
            </h1>

            {/* Loading indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>

            <p className="text-muted-foreground text-lg animate-pulse">Initializing AI Systems...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

