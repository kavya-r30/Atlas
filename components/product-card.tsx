"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Heart, Star, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductWithDetails } from "@/lib/api/products"
import { toggleWishlist } from "@/lib/api/engagement"
import { addToCart } from "@/lib/api/cart"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { DEMO_USER_ID } from "@/lib/constants" // Using centralized constant

interface ProductCardProps {
  product: ProductWithDetails
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const primaryImage = product.images?.[0]?.url || "/placeholder.svg?height=400&width=400"
  const lowestPrice =
    product.variants?.length > 0 ? Math.min(...product.variants.map((v) => v.price)) : product.base_price

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiking(true)
    try {
      await toggleWishlist(DEMO_USER_ID, product.id) // Using DEMO_USER_ID
      toast.success("Wishlist updated")
    } catch (error) {
      console.error("[v0] Wishlist toggle failed", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    try {
      const sellerId = product.variants?.[0]?.seller_id
      await addToCart(DEMO_USER_ID, product.id, 1, sellerId) // Corrected parameter order: userId, productId, quantity, sellerId
      toast.success("Added to cart")
    } catch (error) {
      console.error("[v0] Add to cart failed", error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  if (viewMode === "list") {
    return (
      <div className="group relative bg-card overflow-hidden border border-transparent transition-all hover:border-border flex gap-6 p-4">
        <div className="w-48 aspect-[3/4] overflow-hidden bg-muted relative shrink-0">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={primaryImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="192px"
            />
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-3">
            <div>
              <Link href={`/product/${product.slug}`} className="block group-hover:underline">
                <h3 className="text-lg font-semibold">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{product.category?.name || "Category"}</p>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <p className="font-bold text-xl">${lowestPrice.toFixed(2)}</p>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{product.avg_rating || 4.5}</span>
                <span className="text-sm text-muted-foreground">({product.review_count || 12})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={handleToggleWishlist} disabled={isLiking}>
                <Heart className={cn("h-4 w-4", isLiking && "animate-pulse")} />
              </Button>
              <Button variant="default" className="rounded-none px-6" onClick={handleAddToCart} disabled={isAdding}>
                <ShoppingBag className={cn("h-4 w-4 mr-2", isAdding && "animate-spin")} />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative bg-card overflow-hidden border border-transparent transition-all hover:border-border">
      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={primaryImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
        <button
          onClick={handleToggleWishlist}
          disabled={isLiking}
          className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-primary-foreground"
        >
          <Heart className={cn("h-4 w-4", isLiking && "animate-pulse")} />
        </button>
        {product.variants?.some((v) => v.stock_quantity < 5 && v.stock_quantity > 0) && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider">
            Low Stock
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <Link href={`/product/${product.slug}`} className="block group-hover:underline">
              <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
            </Link>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.category?.name || "Category"}</p>
          </div>
          <p className="font-semibold text-sm">${lowestPrice.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium">{product.avg_rating?.toFixed(1) || 4.5}</span>
            <span className="text-xs text-muted-foreground">({product.review_count || 12})</span>
          </div>
          <Button size="icon-sm" variant="secondary" className="h-8 w-8" onClick={handleAddToCart} disabled={isAdding}>
            <ShoppingBag className={cn("h-4 w-4", isAdding && "animate-spin")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
