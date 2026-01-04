"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Shirt, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function AIOutfitBuilder() {
  const [activeTab, setActiveTab] = useState("daily")

  const mockOutfits = [
    {
      id: "o1",
      name: "Minimalist Executive",
      items: [
        { name: "Oxford Shirt", image: "/placeholder.svg?height=200&width=200" },
        { name: "Navy Chinos", image: "/placeholder.svg?height=200&width=200" },
        { name: "Chelsea Boots", image: "/placeholder.svg?height=200&width=200" },
      ],
      description: "A coordinated ensemble for high-impact meetings.",
    },
  ]

  return (
    <div className="space-y-8 my-16 bg-background border p-8 ai-intelligence-glow overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Shirt className="h-32 w-32" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-2">
            <Sparkles className="h-3 w-3 fill-current" /> Style Coordinator Agent
          </span>
          <h2 className="text-3xl font-black tracking-tighter sm:text-4xl uppercase">AI Outfit Builder</h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Our AI has matched products from your cart and past orders to create these coordinated looks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {mockOutfits.map((outfit) => (
              <div key={outfit.id} className="space-y-6">
                <div className="flex gap-4">
                  {outfit.items.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square w-full bg-muted relative border hover:border-purple-500/50 transition-colors"
                    >
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover p-2" />
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black tracking-tighter uppercase">{outfit.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{outfit.description}</p>
                  <Button className="rounded-none bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8">
                    Add All to Cart <ShoppingBag className="ml-3 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/30 p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] relative">Coordination Score</h4>
            <div className="flex items-center gap-4 relative">
              <div className="text-6xl font-black tracking-tighter text-purple-600">98%</div>
              <div className="h-1 bg-muted flex-1 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "98%" }}
                  className="absolute inset-0 bg-purple-600"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-loose relative">
              Your selected items have high color harmony and style consistency. The "Oxford Shirt" matches perfectly
              with the "Navy Chinos" in your cart.
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-[10px] font-black uppercase tracking-widest relative group-hover:text-purple-600"
            >
              Full Style Report <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
