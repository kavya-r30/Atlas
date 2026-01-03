"use client"

import type React from "react"

import Link from "next/link"
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getCartCount } from "@/lib/api/cart"
import { DEMO_USER_ID } from "@/lib/constants"

export function Navbar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchCartCount = async () => {
      const count = await getCartCount(DEMO_USER_ID)
      setCartCount(count)
    }
    fetchCartCount()

    // Poll for cart updates every 5 seconds
    const interval = setInterval(fetchCartCount, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tighter">ATLAS</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/shop" className="transition-colors hover:text-primary">
                Shop
              </Link>
              <Link href="/categories" className="transition-colors hover:text-primary">
                Categories
              </Link>
              <Link href="/new-arrivals" className="transition-colors hover:text-primary">
                New Arrivals
              </Link>
              <Link href="/sellers" className="transition-colors hover:text-primary">
                Sellers
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4 md:gap-8">
            <form onSubmit={handleSearch} className="hidden lg:flex w-full max-w-sm items-center space-x-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, brands..."
                className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="flex items-center gap-2">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
