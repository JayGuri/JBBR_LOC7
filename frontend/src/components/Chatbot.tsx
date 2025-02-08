"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  text: string
  sender: "user" | "bot"
}

interface ChatbotProps {
  onClose: () => void
}

export function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you with your expense report?", sender: "bot" },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }])
      // Here you would typically send the message to your AI backend and get a response
      // For now, we'll just echo the message back
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: `You said: ${input}`, sender: "bot" }])
      }, 500)
      setInput("")
    }
  }

  return (
    <div className="bg-[#ffffff] p-4 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chat with AI Assistant</h2>
        <Button onClick={onClose} variant="ghost" size="sm">
          Close
        </Button>
      </div>
      <ScrollArea className="h-[300px] mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              message.sender === "user" ? "bg-[#ffdbdb] ml-auto" : "bg-[#f0f0f0]"
            } max-w-[80%]`}
          >
            {message.text}
          </div>
        ))}
      </ScrollArea>
      <div className="flex">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow mr-2 text-white"
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} className="bg-[#161a34] text-[#ffffff] hover:bg-[#161a34]/90">
          Send
        </Button>
      </div>
    </div>
  )
}

