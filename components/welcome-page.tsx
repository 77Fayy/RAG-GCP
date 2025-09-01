"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Sparkles, MessageCircle, Zap, Brain, Cpu } from "lucide-react"
import AIParticles from "./ai-particles"
import NeuralNetwork from "./neural-network"

interface WelcomePageProps {
  onStart: (email: string) => void
}

export default function WelcomePage({ onStart }: WelcomePageProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = async () => {
    if (!email.trim()) return

    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      onStart(email)
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStart()
    }
  }

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

      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-primary/3 rounded-full animate-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <NeuralNetwork />
        <AIParticles />

        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/90 backdrop-blur-md relative z-10 transform transition-all duration-500 hover:scale-105">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Bot className="w-10 h-10 text-primary-foreground animate-bounce" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                AI Training Assistant
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Your intelligent companion for personalized learning experiences
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground group hover:text-primary transition-colors">
                <Brain className="w-5 h-5 text-primary group-hover:animate-pulse" />
                <span>Smart Learning</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground group hover:text-accent transition-colors">
                <MessageCircle className="w-5 h-5 text-accent group-hover:animate-bounce" />
                <span>Real-time Chat</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground group hover:text-primary transition-colors">
                <Zap className="w-5 h-5 text-primary group-hover:animate-pulse" />
                <span>Instant Help</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground group hover:text-accent transition-colors">
                <Cpu className="w-5 h-5 text-accent group-hover:animate-spin" />
                <span>AI Powered</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Enter your email to get started
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-center transition-all duration-300 focus:scale-105"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleStart}
              disabled={!email.trim() || isLoading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <div
                      className="absolute inset-0 w-5 h-5 border-2 border-transparent border-t-accent rounded-full animate-spin animate-reverse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </div>
                  <span className="animate-pulse">Initializing AI Neural Networks...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6 animate-bounce" />
                  <span>Start Chatting</span>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>

            <p className="text-xs text-muted-foreground text-center animate-fade-in">
              By continuing, you agree to our AI assistant terms of service
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
