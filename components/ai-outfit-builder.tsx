"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Shirt, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export interface OutfitProduct {
  id: string
  name: string
  slug: string
  base_price: number
  images: string[]
  category?: {
    id: string
    name: string
  }
}

export interface Outfit {
  id: string
  name: string
  products?: OutfitProduct[]
  product_ids?: string[]
  thumbnail_url?: string
}

export function AIOutfitBuilder({ outfits = [] }: { outfits?: Outfit[] }) {
  const [activeTab, setActiveTab] = useState("daily")

  // If no outfits provided, show empty state
  if (!outfits || outfits.length === 0) {
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
            <p className="text-sm text-muted-foreground max-w-lg">Create coordinated looks from your favorite items.</p>
          </div>

          <div className="py-12 bg-muted/20 border border-dashed flex flex-col items-center justify-center gap-4">
            <Shirt className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No outfits created yet</p>
          </div>
        </div>
      </div>
    )
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {outfits.slice(0, 2).map((outfit) => (
              <div key={outfit.id} className="space-y-6">
                <div className="flex gap-4">
                  {(outfit.products || []).slice(0, 3).map((product, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square w-full bg-muted relative border hover:border-purple-500/50 transition-colors overflow-hidden"
                    >
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover p-2"
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black tracking-tighter uppercase">{outfit.name}</h3>
                  <div className="text-xs text-muted-foreground space-y-2">
                    {(outfit.products || []).slice(0, 3).map((p) => (
                      <p key={p.id}>
                        {p.name} - ₹{p.base_price.toFixed(2)}
                      </p>
                    ))}
                  </div>
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
              Your selected items have high color harmony and style consistency across all pieces.
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
