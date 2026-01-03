"use client"

import { Navbar } from "@/components/navbar"
import { getCartItems, updateCartItemQuantity, removeFromCart } from "@/lib/api/cart"
import { DEMO_USER_ID } from "@/lib/constants"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartItems(DEMO_USER_ID)
        setCartItems(items)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCart()
  }, [])

  const handleUpdateQuantity = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = Math.max(1, currentQty + delta)
    if (newQty === currentQty) return

    try {
      // Optimistic update
      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item)))

      const updated = await updateCartItemQuantity(itemId, newQty)
      if (!updated) {
        // Revert on failure
        const original = await getCartItems(DEMO_USER_ID)
        setCartItems(original)
        toast.error("Failed to update quantity")
      }
    } catch (error) {
      console.error("[v0] Update failed:", error)
      toast.error("An error occurred")
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      const success = await removeFromCart(itemId)
      if (success) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId))
        toast.success("Item removed from cart")
      } else {
        toast.error("Failed to remove item")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const subtotal = cartItems.reduce((acc, item: any) => acc + (item.product?.base_price || 0) * item.quantity, 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15
  const total = subtotal + tax + shipping

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading your selection...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
            <h1 className="text-4xl font-bold tracking-tight">Your Cart</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {cartItems.length} items in your selection
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-8 space-y-12">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="relative aspect-[3/4] w-24 sm:w-32 bg-muted overflow-hidden">
                      <Image
                        src={item.product?.images?.[0] || "/placeholder.svg?height=400&width=300"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link href={`/product/${item.product?.slug}`} className="text-lg font-bold hover:underline">
                              {item.product?.name}
                            </Link>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                              Seller: {item.seller?.name || "Standard Seller"}
                            </p>
                          </div>
                          <p className="text-lg font-bold">${(item.product?.base_price || 0).toFixed(2)}</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
                          {item.selected_attributes?.color && (
                            <p>
                              Color: <span className="text-muted-foreground">{item.selected_attributes.color}</span>
                            </p>
                          )}
                          {item.selected_attributes?.size && (
                            <p>
                              Size: <span className="text-muted-foreground">{item.selected_attributes.size}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center border p-1 gap-4">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            className="p-1 hover:text-primary transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-8 border-t border-dashed">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-4">
                <div className="bg-card border p-8 space-y-8 sticky top-24">
                  <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Estimated Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-4 border-t">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full h-14 rounded-none uppercase tracking-widest font-bold text-base mt-4">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="space-y-4 pt-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-center text-muted-foreground">
                      Secure payment options
                    </p>
                    <div className="flex justify-center gap-4 opacity-50">
                      <div className="h-8 w-12 bg-muted rounded" />
                      <div className="h-8 w-12 bg-muted rounded" />
                      <div className="h-8 w-12 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center gap-6">
              <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-full">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-bold">Your cart is empty</p>
                <p className="text-muted-foreground">Discover pieces that reflect your style in our collection.</p>
              </div>
              <Link href="/shop">
                <Button className="rounded-none px-8 h-12 uppercase tracking-widest font-bold">Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
