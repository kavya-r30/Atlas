"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Search, ShoppingBag, User, Heart, Menu } from "lucide-react"
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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    const fetchCartCount = async () => {
      const count = await getCartCount(DEMO_USER_ID)
      setCartCount(count)
    }
    fetchCartCount()

    const interval = setInterval(fetchCartCount, 5000)
    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 border-b",
        isScrolled
          ? "h-14 bg-background/90 backdrop-blur-xl border-border/40"
          : "h-20 bg-background/0 border-transparent",
      )}
    >
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-black tracking-tighter transition-transform group-hover:scale-105">
                ATLAS
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Link href="/shop" className="transition-all hover:text-secondary relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </Link>
              <Link href="/categories" className="transition-all hover:text-secondary relative group">
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </Link>
              <Link href="/ai" className="transition-all hover:text-secondary relative group">
                AI Curation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </Link>
              <Link href="/new-arrivals" className="transition-all hover:text-secondary relative group">
                New Arrivals
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </Link>
              <Link href="/sellers" className="transition-all hover:text-secondary relative group">
                Sellers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex w-full max-w-[200px] items-center space-x-2 relative group"
            >
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="SEARCH..."
                className="h-9 pl-9 bg-muted/30 border-none focus-visible:ring-0 focus-visible:bg-muted/50 transition-all text-[10px] font-bold tracking-widest uppercase rounded-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="flex items-center gap-1">
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex hover:bg-transparent hover:text-secondary transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-transparent hover:text-secondary transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-secondary-foreground">
                      {cartCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent hover:text-secondary transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
