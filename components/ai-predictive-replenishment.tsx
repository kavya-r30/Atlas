"use client"

import { motion } from "framer-motion"
import { RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function AIPredictiveReplenishment() {
  return (
    <section className="py-24 container px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-purple-500 animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-500">Atlas Intelligence</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase">Predictive Replenishment</h2>
          <p className="mt-4 text-muted-foreground font-medium">
            Based on your usage patterns, these items are due for a refill.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReplenishmentCard
          name="Organic Cotton Tee"
          lastOrder="3 months ago"
          status="Due in 5 days"
          image="/white-tshirt.png"
          frequency="Every 90 days"
        />
        <ReplenishmentCard
          name="Signature Fragrance"
          lastOrder="6 months ago"
          status="Refill Suggested"
          image="/fragrance.jpg"
          frequency="Every 180 days"
        />
        <ReplenishmentCard
          name="Daily Essentials Pack"
          lastOrder="28 days ago"
          status="Order Scheduled"
          image="/everyday-essentials.png"
          frequency="Every 30 days"
        />
      </div>
    </section>
  )
}

function ReplenishmentCard({ name, lastOrder, status, image, frequency }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-background border border-border rounded-none p-4 flex gap-6 items-center"
    >
      <div className="relative aspect-[3/4] w-24 overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-110"
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-purple-500 uppercase tracking-wider">
          <Clock className="w-3 h-3" />
          {status}
        </div>
        <h3 className="font-black uppercase tracking-tight text-sm">{name}</h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Freq: {frequency}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-none text-[10px] font-black uppercase h-8 mt-2 bg-transparent"
        >
          Refill Now
        </Button>
      </div>
    </motion.div>
  )
}
