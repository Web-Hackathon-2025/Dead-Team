"use client"

import { useState, FormEvent } from "react"
import { Send, Bot, CornerDownLeft, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat"
import { ChatMessageList } from "@/components/ui/chat-message-list"

type ChatStep = 
  | "initial" 
  | "userType" 
  | "showQuestions" 
  | "checkRelevant" 
  | "collectEmail" 
  | "completed"

interface Message {
  id: number
  content: string | React.ReactNode
  sender: "user" | "ai"
}

const customerQuestions = [
  "How do I book a service?",
  "How do I find service providers?",
  "What payment methods are accepted?",
  "How do I cancel a booking?",
  "How do I rate a service provider?",
]

const providerQuestions = [
  "How do I register as a service provider?",
  "How do I manage my bookings?",
  "How do I update my profile?",
  "What are the commission rates?",
  "How do I get paid?",
]

export function HelpChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! 👋 I'm here to help you. Are you a customer looking for services, or a service provider?",
      sender: "ai",
    },
  ])
  const [step, setStep] = useState<ChatStep>("initial")
  const [userType, setUserType] = useState<"customer" | "provider" | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const addMessage = (content: string | React.ReactNode, sender: "user" | "ai") => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content,
        sender,
      },
    ])
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userInput = input.trim().toLowerCase()
    addMessage(input, "user")
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      handleUserResponse(userInput)
      setIsLoading(false)
    }, 800)
  }

  const handleUserResponse = (userInput: string) => {
    if (step === "initial") {
      if (userInput.includes("customer") || userInput.includes("client") || userInput.includes("user")) {
        setUserType("customer")
        setStep("showQuestions")
        addMessage(
          <div>
            <p className="mb-2">Great! Here are some common questions for customers:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {customerQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
            <p className="mt-3">Did any of these questions help? Or do you have a different question?</p>
          </div>,
          "ai"
        )
      } else if (userInput.includes("provider") || userInput.includes("worker") || userInput.includes("professional")) {
        setUserType("provider")
        setStep("showQuestions")
        addMessage(
          <div>
            <p className="mb-2">Perfect! Here are some common questions for service providers:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {providerQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
            <p className="mt-3">Did any of these questions help? Or do you have a different question?</p>
          </div>,
          "ai"
        )
      } else {
        addMessage(
          "Please let me know if you're a customer looking for services, or a service provider. You can type 'customer' or 'provider'.",
          "ai"
        )
      }
    } else if (step === "showQuestions") {
      if (userInput.includes("yes") || userInput.includes("helpful") || userInput.includes("relevant") || userInput.includes("found")) {
        setStep("completed")
        addMessage(
          "Great! I'm glad I could help. Is there anything else you'd like to know?",
          "ai"
        )
      } else if (userInput.includes("no") || userInput.includes("not") || userInput.includes("different")) {
        setStep("collectEmail")
        addMessage(
          "I understand. To better assist you, could you please provide your email address? Our team will get back to you with a personalized response.",
          "ai"
        )
      } else {
        // User asked a different question
        addMessage(
          "I see you have a different question. Let me help you with that. Could you provide your email address so our team can give you a detailed response?",
          "ai"
        )
        setStep("collectEmail")
      }
    } else if (step === "collectEmail") {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(userInput)) {
        setEmail(userInput)
        setStep("completed")
        addMessage(
          <div>
            <p className="mb-2">Thank you! We've received your email: <strong>{userInput}</strong></p>
            <p>Our team will get back to you soon. Is there anything else I can help you with?</p>
          </div>,
          "ai"
        )
      } else {
        addMessage(
          "That doesn't look like a valid email address. Please enter a valid email (e.g., yourname@example.com).",
          "ai"
        )
      }
    } else if (step === "completed") {
      // Continue conversation
      addMessage(
        "I'm here to help! Feel free to ask me anything else, or you can close this chat anytime.",
        "ai"
      )
    }
  }

  const handleQuickAction = (action: string) => {
    addMessage(action, "user")
    setIsLoading(true)
    
    setTimeout(() => {
      handleUserResponse(action.toLowerCase())
      setIsLoading(false)
    }, 800)
  }

  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={<Bot className="h-6 w-6 text-white" />}
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">
        <h1 className="text-xl font-semibold text-gray-900">Need Help? 💬</h1>
        <p className="text-sm text-gray-600">
          Ask me anything, I'm here to assist you
        </p>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              {message.sender === "user" ? (
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                  fallback="U"
                />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}

          {step === "initial" && (
            <ChatBubble variant="received">
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <ChatBubbleMessage variant="received">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction("I am a customer")}
                    className="w-full justify-start"
                  >
                    I'm a Customer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction("I am a provider")}
                    className="w-full justify-start"
                  >
                    I'm a Service Provider
                  </Button>
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              step === "collectEmail"
                ? "Enter your email address..."
                : "Type your message..."
            }
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0 justify-end">
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Send
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}

