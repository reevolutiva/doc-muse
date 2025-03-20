"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { createErrorHandler } from '@/lib/utils/error-handler'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface ChatContextType {
  messages: Message[]
  sendMessage: (content: string) => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const errorHandler = createErrorHandler('Chat')
  
  const sendMessage = async (content: string) => {
    try {
      // Add user message immediately
      const userMessage: Message = { role: 'user', content }
      setMessages(prev => [...prev, userMessage])
      setIsLoading(true)
      
      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: `This is a placeholder response to: "${content}"`
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1000)
      
      // In a real implementation, you would call an API here
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: content }),
      //   headers: { 'Content-Type': 'application/json' }
      // })
      // const data = await response.json()
      // setMessages(prev => [...prev, data.message])
      
    } catch (error) {
      errorHandler(error)
      setIsLoading(false)
    }
  }
  
  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
