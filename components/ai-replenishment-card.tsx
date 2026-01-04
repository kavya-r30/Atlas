"use client"

import { RefreshCw, Calendar, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

interface ReplenishmentItem {
  id: string
  product_name: string
  image_url: string
  next_replenishment_date: string
  frequency_days: number
  last_ordered_date: string
  product_id?: string
  base_price?: number
}

export function AIReplenishmentCard({ item }: { item: ReplenishmentItem }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-muted/20 border border-transparent hover:border-sky-500/30 p-6 flex items-center gap-6 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="h-20 w-20 relative bg-white shrink-0 shadow-sm">
        <Image src={item.image_url || "/placeholder.svg"} alt={item.product_name} fill className="object-cover p-2" />
      </div>

      <div className="flex-1 space-y-2 relative">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-black uppercase tracking-widest">{item.product_name}</h4>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-sky-500 bg-sky-500/10 px-2 py-0.5 flex items-center gap-1">
            <Zap className="h-2 w-2 fill-current" /> Predictive
          </span>
        </div>

        <div className="flex items-center gap-4 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            Due: {new Date(item.next_replenishment_date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" />
            Every {item.frequency_days} days
          </div>
        </div>

        {item.base_price && <p className="text-[10px] font-black text-foreground">₹{item.base_price.toFixed(2)}</p>}

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[10px] font-black text-foreground">Next auto-order scheduled</p>
          <Button
            variant="link"
            className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-sky-500 group-hover:underline"
          >
            Manage <ArrowRight className="ml-1.5 h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
