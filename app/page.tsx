"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, ArrowLeft } from "lucide-react"
import SplashScreen from "@/components/splash-screen"
import WelcomePage from "@/components/welcome-page"
import { apiService } from "../services/api"   // ✅ no need to import ChatRequest here

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
  sources?: string[]
}

export default function ChatbotPage() {
  const [currentView, setCurrentView] = useState<"splash" | "welcome" | "chat">("splash")
  const [userEmail, setUserEmail] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSplashComplete = () => {
    setCurrentView("welcome")
  }

  const handleStart = (email: string) => {
    setUserEmail(email)
    setCurrentView("chat")
    const welcomeMessage: Message = {
      id: 1,
      text: `Hello ${email.split("@")[0]}! I'm your AI Training Assistant. I'm here to help you with your learning journey. What would you like to explore today?`,
      isUser: false,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      // ✅ Send { query: ... } instead of { message: ... }
      const response = await apiService.sendMessage(currentInput, userEmail)

      if ((response as any).conversation_id) {
        setConversationId((response as any).conversation_id)
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.answer,   // ✅ backend returns { answer: "..." }
        isUser: false,
        timestamp: new Date(),
        sources: (response as any).sources,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Failed to send message:", error)

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleBackToWelcome = () => {
    setCurrentView("welcome")
    setMessages([])
    setUserEmail("")
    setConversationId("")
  }

  if (currentView === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (currentView === "welcome") {
    return <WelcomePage onStart={handleStart} />
  }

  return (
    <div className="min-h-screen bg-pattern bg-dots relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background/98 via-primary/2 to-accent/2" />

      <div className="relative z-10">
        <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToWelcome}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <div>
                  <h1 className="text-xl font-bold">AI Training Assistant</h1>
                  <p className="text-xs opacity-90">Chatting with {userEmail.split("@")[0]}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto w-full p-4">
          <Card className="h-[calc(100vh-200px)] flex flex-col shadow-xl bg-card/95 backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser ? "bg-accent" : "bg-primary"
                      }`}
                    >
                      {message.isUser ? (
                        <User className="w-4 h-4 text-accent-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.isUser
                          ? "bg-gradient-to-r from-accent to-primary text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/20">
                          <p className="text-xs opacity-70 mb-1">Sources:</p>
                          <ul className="text-xs opacity-80 space-y-1">
                            {message.sources.map((source, index) => (
                              <li key={index} className="truncate">
                                • {source}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <span className={`text-xs mt-1 block opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-4 bg-muted/30">
              <div className="flex space-x-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your training..."
                  className="flex-1 h-12 bg-background"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="h-12 w-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

