"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"
import { Filter, X, LayoutGrid, List, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function ShopContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const category = searchParams.get("category") || undefined
  const sort = searchParams.get("sort") || undefined
  const search = searchParams.get("search") || undefined
  const minPrice = searchParams.get("minPrice") || undefined
  const maxPrice = searchParams.get("maxPrice") || undefined
  const minRating = searchParams.get("minRating") || undefined

  const hasFilters = category || search || minPrice || maxPrice || sort || minRating

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        getProducts({
          categoryId: category,
          sort: sort as any,
          search: search,
          minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
          minRating: minRating ? Number.parseFloat(minRating) : undefined,
        }),
        getCategories(),
      ])
      setProducts(productsData.products)
      setCategories(categoriesData)
      setLoading(false)
    }
    fetchData()
  }, [category, sort, search, minPrice, maxPrice, minRating])

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <h2 className="text-xs font-bold uppercase tracking-widest">Filters</h2>
              </div>
              {hasFilters && (
                <Link href="/shop">
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase tracking-widest">
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </Link>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => updateFilter("minRating", rating.toString())}
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

              <div className="space-y-4 border-t pt-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter("category", undefined)}
                    className={`block text-sm font-medium transition-colors hover:text-primary w-full text-left ${
                      !category ? "text-primary font-bold" : "text-muted-foreground"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter("category", cat.id)}
                      className={`block text-sm font-medium transition-colors hover:text-primary w-full text-left ${
                        category === cat.id ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "newest", label: "Newest Arrivals" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                    { value: "rating", label: "Customer Rating" },
                    { value: "popular", label: "Most Popular" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter("sort", option.value)}
                      className={`block text-sm font-medium transition-colors hover:text-primary w-full text-left ${
                        sort === option.value ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-4 border-b pb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                  {search
                    ? `Search: "${search}"`
                    : category
                      ? categories.find((c) => c.id === category)?.name
                      : "All Products"}
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {products.length} Items
                  </p>
                  <div className="flex items-center border rounded-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-none h-8 w-8 ${viewMode === "grid" ? "bg-muted" : ""}`}
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-none h-8 w-8 ${viewMode === "list" ? "bg-muted" : ""}`}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {search && (
                <p className="text-sm text-muted-foreground">
                  Showing results for <span className="font-semibold">"{search}"</span>
                </p>
              )}
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === "grid" ? "grid grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12" : "flex flex-col gap-6"
                }
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-4">
                <p className="text-xl font-bold">No products found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                <Link href="/shop">
                  <Button className="rounded-none px-8 h-12 uppercase tracking-widest font-bold">
                    View All Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  )
}
