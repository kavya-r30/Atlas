"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Send, Mic, Search, Package, Zap, ShoppingBag } from "lucide-react"
import { processIntent } from "@/lib/api/ai-agents"
import { useRouter } from "next/navigation"

interface AIIntelligenceGlowProps {
  isActive: boolean
  onClose: () => void
}

export function AIIntelligenceGlow({ isActive, onClose }: AIIntelligenceGlowProps) {
  const [query, setQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const router = useRouter()

  // Mock responses
  const res = {
    bundles: [
      {
        id: "bundle-1",
        title: "Everyday Essentials Pack",
        items: ["Organic Cotton T-Shirt", "Slim Fit Jeans", "White Sneakers"],
        price: "₹3,999",
        discount: "20% OFF",
      },
      {
        id: "bundle-2",
        title: "Eco Starter Kit",
        items: ["Bamboo Toothbrush", "Reusable Bottle", "Canvas Tote"],
        price: "₹1,299",
        discount: "15% OFF",
      },
    ],
    outfits: [
      { id: "outfit-1", title: "Casual Friday Look", items: ["Linen Shirt", "Chinos", "Loafers"] },
      { id: "outfit-2", title: "Minimal Streetwear", items: ["Oversized Tee", "Cargo Pants", "Sneakers"] },
    ],
    refills: [
      "Face Wash (last ordered 28 days ago)",
      "Protein Powder (running low)",
      "Laundry Detergent (monthly refill)",
    ],
    search: ["Sustainable Cotton T-Shirts", "Recycled Fabric Hoodies", "Eco-friendly Sneakers"],
  }

  // Formats responses into a readable string
  const formatResponse = (title: string, items: any[]) => {
    return `✨ ${title}\n\n` + items
      .map((item: any) => {
        if (typeof item === "string") return `• ${item}`
        if (item.items && item.items.length > 0)
          return `• ${item.title}\n  ${item.items.join(", ")}\n  ${item.price ?? ""} ${item.discount ?? ""}`
        return `• ${item.title}`
      })
      .join("\n\n")
  }

  const handleSubmit = async () => {
    if (!query.trim()) return

    setIsProcessing(true)
    setResponse(null)

    try {
      let result: string

      // Simple keyword mapping to mock responses
      const q = query.toLowerCase()
      if (q.includes("bundle")) result = formatResponse("Best Bundles", res.bundles)
      else if (q.includes("outfit")) result = formatResponse("Suggested Outfits", res.outfits)
      else if (q.includes("reorder") || q.includes("refill")) result = formatResponse("Refills Due", res.refills.map((i) => ({ title: i, items: [] })))
      else if (q.includes("sustainable") || q.includes("search")) result = formatResponse("Search Results", res.search.map((i) => ({ title: i, items: [] })))
      else {
        // fallback to API
        const apiResult = await processIntent({
          user_id: "user-123",
          query,
          context: { page: "home", timestamp: new Date().toISOString() },
        })
        result = apiResult.response
      }

      setResponse(result)

      // Navigate for search
      if (q.includes("search")) {
        router.push(`/shop?q=${encodeURIComponent(query)}`)
      }
    } catch (error) {
      console.error("[v0] AI Intent error:", error)
      setResponse("Sorry, I encountered an error. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Glow overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[100]"
          >
            <div className="absolute inset-0 border-[4px] border-transparent animate-pulse shadow-[inset_0_0_80px_rgba(147,51,234,0.3),0_0_80px_rgba(147,51,234,0.3)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-pink-500 to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />
          </motion.div>

          {/* AI Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-background/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Atlas Intelligence</h2>
                    <p className="text-xs text-muted-foreground">Intent-based commerce agent active</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* AI Response */}
              {response && (
                <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border whitespace-pre-wrap">
                  <p className="text-sm leading-relaxed">{response}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <AIQuickAction
                    icon={<Search className="w-4 h-4" />}
                    label="Smart Search"
                    onClick={() => {
                      setQuery("Find me sustainable basics")
                      setTimeout(handleSubmit, 50)
                    }}
                  />
                  <AIQuickAction
                    icon={<Zap className="w-4 h-4" />}
                    label="Outfit Builder"
                    onClick={() => {
                      setQuery("Create an outfit for casual Friday")
                      setTimeout(handleSubmit, 50)
                    }}
                  />
                  <AIQuickAction
                    icon={<Package className="w-4 h-4" />}
                    label="Refills Due"
                    onClick={() => {
                      setQuery("What products should I reorder?")
                      setTimeout(handleSubmit, 50)
                    }}
                  />
                  <AIQuickAction
                    icon={<ShoppingBag className="w-4 h-4" />}
                    label="Best Bundles"
                    onClick={() => {
                      setQuery("Show me the best bundle deals")
                      setTimeout(handleSubmit, 50)
                    }}
                  />
                </div>
              </div>

              {/* Input */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="What are you looking for today?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-muted/50 border-none focus:ring-2 ring-purple-500/50 rounded-xl py-4 pl-4 pr-24 text-sm transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!query || isProcessing}
                    className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-all hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading bar */}
            {isProcessing && (
              <div className="h-1 w-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
                  className="h-full w-1/3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function AIQuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-purple-500/20 transition-all group"
    >
      <div className="p-2 bg-background rounded-lg group-hover:scale-110 transition-transform shadow-sm">{icon}</div>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  )
}
