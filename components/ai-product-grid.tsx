"use client"

import { ProductCard } from "@/components/product-card"
import type { ProductWithDetails } from "@/lib/api/products"
import { motion } from "framer-motion"

interface AIProductGridProps {
  products: ProductWithDetails[]
  title?: string
  description?: string
  agent?: string
}

export function AIProductGrid({ products, title, description, agent }: AIProductGridProps) {
  if (!products || products.length === 0) return null

  return (
    <div className="space-y-8 my-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-xl space-y-2">
          {agent && (
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 block">
              {agent} Curation
            </span>
          )}
          {title && <h2 className="text-3xl font-black tracking-tighter sm:text-4xl uppercase">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-sky-400/20 via-purple-500/20 to-pink-500/20 blur-lg opacity-0 hover:opacity-100 transition-opacity rounded-xl" />
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
