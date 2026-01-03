"use client"

import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/api/products"
import { Filter, LayoutGrid, List, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function NewArrivalsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const sort = searchParams.get("sort") || "newest"
  const minRating = searchParams.get("minRating") || undefined
  const minPrice = searchParams.get("minPrice") || undefined
  const maxPrice = searchParams.get("maxPrice") || undefined

  const hasFilters = sort !== "newest" || minRating || minPrice || maxPrice

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { products: productsData } = await getProducts({
        sort: sort as any,
        minRating: minRating ? Number.parseFloat(minRating) : undefined,
        minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
      })
      setProducts(productsData)
      setLoading(false)
    }
    fetchData()
  }, [sort, minRating, minPrice, maxPrice])

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/new-arrivals?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/new-arrivals")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="text-center space-y-4 border-b pb-12">
            <h1 className="text-5xl font-bold tracking-tighter uppercase italic">New Arrivals</h1>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto">
              Discover the latest additions to the Atlas collection. Fresh designs, sustainable materials, and timeless
              style.
            </p>
          </div>

          <div className="flex items-center justify-between border-y py-4 sticky top-16 bg-background z-40">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold tracking-widest uppercase text-xs h-8"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] uppercase tracking-widest"
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
              <div className="hidden sm:flex items-center border-l pl-4 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:inline">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="text-xs font-bold uppercase tracking-widest bg-transparent border border-border rounded-none px-3 h-8 cursor-pointer hover:bg-muted"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="border rounded-none p-6 space-y-6 bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          updateFilter("minRating", minRating === rating.toString() ? undefined : rating.toString())
                        }
                        className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary w-full ${
                          minRating === rating.toString() ? "text-primary font-bold" : "text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span>& Up</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
                  : "flex flex-col gap-6"
              }
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="py-16 text-center space-y-4">
              <p className="text-xl font-bold">No products found</p>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={null}>
      <NewArrivalsContent />
    </Suspense>
  )
}
