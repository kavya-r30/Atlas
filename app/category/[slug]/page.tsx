"use client"

import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/api/products"
import { getCategoryBySlug, getSubcategories } from "@/lib/api/categories"
import Link from "next/link"
import { Filter, LayoutGrid, List, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

function CategoryContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params.slug as string

  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState<any>(null)
  const [subcategories, setSubcategories] = useState<any[]>([])
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
      const categoryData = await getCategoryBySlug(slug)
      if (!categoryData) {
        router.push("/404")
        return
      }

      const [productsData, subcategoriesData] = await Promise.all([
        getProducts({
          categoryId: categoryData.id,
          sort: sort as any,
          minRating: minRating ? Number.parseFloat(minRating) : undefined,
          minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
        }),
        getSubcategories(categoryData.id),
      ])

      setCategory(categoryData)
      setProducts(productsData.products)
      setSubcategories(subcategoriesData)
      setLoading(false)
    }
    fetchData()
  }, [slug, sort, minRating, minPrice, maxPrice, router])

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/category/${slug}?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(`/category/${slug}`)
  }

  if (loading || !category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4">
            <nav className="text-xs text-muted-foreground flex items-center gap-2 font-medium uppercase tracking-widest">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-primary transition-colors">
                Categories
              </Link>
              <span>/</span>
              <span className="text-primary">{category.name}</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
                <p className="text-muted-foreground mt-2 max-w-xl leading-relaxed">
                  {category.description ||
                    `Discover our curated selection of products in the ${category.name} collection.`}
                </p>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Showing {products.length} products</p>
            </div>
          </div>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <Link key={sub.id} href={`/category/${sub.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none border-muted-foreground/20 hover:bg-muted font-bold tracking-widest uppercase text-[10px] bg-transparent"
                  >
                    {sub.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Filters & Grid */}
          <div className="flex flex-col gap-6">
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
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6"
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
        </div>
      </main>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <CategoryContent />
    </Suspense>
  )
}
