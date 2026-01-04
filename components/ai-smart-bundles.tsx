"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
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

interface Bundle {
  id: string
  name: string
  description: string
  discount_percentage: number
  products: Product[]
}

export function AISmartBundles({ bundles }: { bundles: Bundle[] }) {
  if (!bundles || bundles.length === 0) return null

  return (
    <div className="space-y-8 my-16">
      <div className="max-w-xl space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-2">
          <Zap className="h-3 w-3 fill-current" /> Intelligent Bundling
        </span>
        <h2 className="text-3xl font-black tracking-tighter sm:text-4xl uppercase">Curated Product Sets</h2>
        <p className="text-sm text-muted-foreground">AI-discovered combinations that work perfectly together.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {bundles.map((bundle, idx) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15 }}
            className="group relative bg-muted/30 p-8 flex flex-col md:flex-row gap-8 overflow-hidden ai-intelligence-glow rounded-none border-none"
          >
            <div className="flex-1 space-y-4 relative z-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase">{bundle.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{bundle.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-secondary text-white text-[10px] font-black uppercase tracking-widest">
                  Save {bundle.discount_percentage}%
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-[10px] font-black uppercase tracking-widest group/btn"
                >
                  View Bundle <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
            <div className="flex -space-x-8 md:-space-x-12 relative z-0">
              {bundle.products?.slice(0, 3).map((product, i) => (
                <div
                  key={i}
                  className="w-32 h-40 relative bg-white shadow-xl overflow-hidden transition-transform duration-500 hover:-translate-y-4 hover:z-10"
                  style={{ zIndex: 3 - i }}
                >
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
