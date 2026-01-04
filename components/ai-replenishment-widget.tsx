"use client"

import { motion } from "framer-motion"
import { Clock, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getReplenishment, type ReplenishmentItem } from "@/lib/api/ai-agents"

export function AIReplenishmentWidget({ userId }: { userId?: string }) {
  const [items, setItems] = useState<ReplenishmentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    getReplenishment(userId)
      .then((data) => {
        console.log("[v0] Replenishment data:", data)
        setItems(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Replenishment error:", error)
        setLoading(false)
      })
  }, [userId])

  if (loading) {
    return (
      <section className="py-12 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) return null

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Time to Restock</h2>
            <p className="text-sm text-muted-foreground">AI-predicted replenishment based on your usage patterns</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <ReplenishmentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReplenishmentCard({ item }: { item: ReplenishmentItem }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-muted rounded-lg" />
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">{item.product_name}</h3>
          <p className="text-xs text-muted-foreground">Due: {item.next_due_date}</p>
          <p className="text-xs text-muted-foreground">Every {item.frequency_days} days</p>
        </div>
      </div>
      <Button size="sm" className="w-full gap-2">
        <ShoppingCart className="w-4 h-4" />
        Auto-Reorder
      </Button>
    </motion.div>
  )
}
