"use client"

import { useState } from "react"
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductWithDetails } from "@/lib/api/products"
import { cn } from "@/lib/utils"
import { addToCart } from "@/lib/api/cart"
import { DEMO_USER_ID } from "@/lib/constants"

interface ProductActionsProps {
  product: ProductWithDetails
}

export function ProductActions({ product }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSeller, setSelectedSeller] = useState<string>(product.variants[0]?.seller_id || "")
  const [isAdding, setIsAdding] = useState(false)

  const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[]
  const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[]

  const currentVariant =
    product.variants.find(
      (v) =>
        v.seller_id === selectedSeller &&
        (!selectedSize || v.size === selectedSize) &&
        (!selectedColor || v.color === selectedColor),
    ) || product.variants.find((v) => v.seller_id === selectedSeller)

  const handleAddToCart = async () => {
    if (!currentVariant) return
    setIsAdding(true)
    try {
      await addToCart(DEMO_USER_ID, product.id, 1, currentVariant.seller_id, {
        size: selectedSize,
        color: selectedColor,
      })
      // In a real app, this would trigger a cart state update or toast
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{product.category?.name}</p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-bold">{product.avg_rating?.toFixed(1) || "N/A"}</span>
            <span className="text-sm text-muted-foreground font-medium">({product.review_count || 0} reviews)</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-2xl font-semibold">₹{currentVariant?.price.toFixed(2) || product.base_price.toFixed(2)}</p>
      </div>

      {/* Attributes */}
      <div className="space-y-6">
        {colors.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest">
              Color: <span className="text-muted-foreground">{selectedColor || "Select"}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "h-10 px-4 border text-sm font-bold transition-all uppercase tracking-widest",
                    selectedColor === color
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary",
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest">
              Size: <span className="text-muted-foreground">{selectedSize || "Select"}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "h-10 min-w-[3rem] px-3 border text-sm font-bold transition-all uppercase tracking-widest",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Seller Selection */}
        {product.variants.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest">Select Seller</p>
            <div className="grid gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedSeller(v.seller_id)}
                  className={cn(
                    "flex items-center justify-between p-4 border text-left transition-all",
                    selectedSeller === v.seller_id
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-muted-foreground/30",
                  )}
                >
                  <div>
                    <p className="text-sm font-bold">{v.seller?.name || "Seller"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {v.seller?.verified && (
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 font-bold uppercase tracking-tighter">
                          Verified
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Delivery in {v.delivery_days || v.seller?.delivery_days || 3}-
                        {(v.delivery_days || v.seller?.delivery_days || 3) + 2} days
                      </p>
                    </div>
                  </div>
                  <p className="font-bold">₹{v.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Button
            className="flex-1 h-14 rounded-none uppercase tracking-widest font-bold text-base"
            disabled={isAdding || currentVariant?.stock_quantity === 0}
            onClick={handleAddToCart}
          >
            {currentVariant?.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            <ShoppingCart className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-none border-border bg-transparent">
            <Heart className="h-6 w-6" />
          </Button>
        </div>
        <Button
          variant="secondary"
          className="h-14 rounded-none uppercase tracking-widest font-bold text-sm bg-muted/50"
        >
          Get the full outfit
        </Button>
      </div>

      {/* Service Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-dashed">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On orders over ₹150</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCcw className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest">Easy Returns</p>
            <p className="text-xs text-muted-foreground">
              {currentVariant?.seller?.return_days || 30}-day return policy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest">Secure Payment</p>
            <p className="text-xs text-muted-foreground">Certified transactions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
