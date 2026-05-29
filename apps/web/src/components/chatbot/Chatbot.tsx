import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { clsx } from 'clsx'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage } from '@/types'
import { CHATBOT_FAQS } from '@/lib/constants'

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content: "Hello! 🌿 I'm the Macramumu assistant. I can help with questions about delivery, materials, custom orders, and more. What would you like to know?",
  timestamp: new Date(),
}

function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()

  // Find matching FAQ
  const match = CHATBOT_FAQS.find((faq) =>
    faq.keywords.some((keyword) => lower.includes(keyword))
  )

  if (match) return match.answer

  // Fallback
  return "I'm not sure about that one! For anything specific, please reach out via our Contact page and we'll get back to you within 1–2 business days. 💛"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: uuidv4(),
        role: 'bot',
        content: getBotResponse(text),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div
          className={clsx(
            'fixed bottom-20 right-4 sm:right-6 z-50',
            'w-[calc(100vw-2rem)] sm:w-80',
            'bg-cream-50 rounded-2xl shadow-warm border border-sand-200',
            'flex flex-col overflow-hidden',
            'animate-slide-up'
          )}
          role="dialog"
          aria-label="Chat with Macramumu"
          aria-live="polite"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-bark-400 text-cream-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-sage-300 rounded-full animate-pulse" aria-hidden="true" />
              <span className="font-sans text-sm font-medium">Macramumu Chat</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-bark-500 transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-72"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={clsx(
                    'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-sans leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-bark-400 text-cream-50 rounded-br-sm'
                      : 'bg-sand-100 text-bark-600 rounded-bl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-sand-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-sand-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-sand-200 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className={clsx(
                'flex-1 px-3 py-2 text-sm font-sans rounded-xl',
                'bg-sand-100 border border-sand-200',
                'text-bark-600 placeholder:text-sand-400',
                'focus:outline-none focus:ring-2 focus:ring-bark-300',
              )}
              aria-label="Type your message"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={clsx(
                'p-2 rounded-xl transition-colors',
                input.trim()
                  ? 'bg-bark-400 text-cream-50 hover:bg-bark-500'
                  : 'bg-sand-200 text-sand-400 cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={clsx(
          'fixed bottom-4 right-4 sm:right-6 z-50',
          'w-12 h-12 rounded-full shadow-warm',
          'flex items-center justify-center',
          'transition-all duration-200',
          isOpen
            ? 'bg-bark-500 text-cream-50'
            : 'bg-bark-400 text-cream-50 hover:bg-bark-500 hover:scale-105'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </>
  )
}
