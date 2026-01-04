"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { AIIntelligenceGlow } from "./ai-intelligence-glow"
import { motion } from "framer-motion"

export function AITrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[99] flex items-center gap-2 bg-background border border-border shadow-xl hover:shadow-2xl rounded-full px-5 py-3 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="w-5 h-5 text-purple-500 group-hover:animate-spin-slow" />
        <span className="text-sm font-semibold tracking-tight">Ask Atlas</span>
      </motion.button>

      <AIIntelligenceGlow isActive={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
