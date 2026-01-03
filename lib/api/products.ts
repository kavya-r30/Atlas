import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Product, ProductSeller } from "@/lib/types/database"

export interface ProductImage {
  id: string
  url: string
  alt_text?: string
}

export interface ProductWithDetails extends Product {
  images: ProductImage[]
  variants: ProductSeller[]
  avg_rating?: number
  review_count?: number
}

export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sellerId?: string
  tags?: string[]
  search?: string
  minRating?: number
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "popular"
}

export async function getProducts(filters: ProductFilters = {}, page = 1, limit = 20) {
  const supabase = getSupabaseBrowserClient()

  let query = supabase.from("products").select(
    `
      *,
      category:categories(*),
      sellers:product_sellers(
        *,
        seller:sellers(*)
      ),
      reviews(rating)
    `,
    { count: "exact" },
  )

  // Apply filters
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId)
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.minPrice) {
    query = query.gte("base_price", filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte("base_price", filters.maxPrice)
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.contains("tags", filters.tags)
  }

  // Apply sorting
  switch (filters.sort) {
    case "price_asc":
      query = query.order("base_price", { ascending: true })
      break
    case "price_desc":
      query = query.order("base_price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "rating":
    case "popular":
      // We'll sort these in memory after fetching
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] Error fetching products:", error)
    return { products: [], total: 0 }
  }

  let transformedProducts = (data || []).map((product) => {
    const reviews = (product as any).reviews || []
    const avgRating = reviews.length > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length : 0
    const transformed = transformProduct(product)
    return {
      ...transformed,
      avg_rating: avgRating,
      review_count: reviews.length,
    }
  })

  if (filters.minRating && filters.minRating > 0) {
    transformedProducts = transformedProducts.filter((p) => (p.avg_rating || 0) >= filters.minRating!)
  }

  if (filters.sort === "rating") {
    transformedProducts.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
  } else if (filters.sort === "popular") {
    // Sort by review count as a proxy for popularity
    transformedProducts.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
  }

  return { products: transformedProducts, total: count || 0 }
}

export async function getProductBySlug(slug: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      sellers:product_sellers(
        *,
        seller:sellers(*)
      ),
      reviews(rating)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }

  const reviews = data.reviews || []
  const avgRating = reviews.length > 0 ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length : 0

  const productWithRating = data as any
  productWithRating.avg_rating = avgRating
  productWithRating.review_count = reviews.length

  return transformProduct(productWithRating)
}

export async function getFeaturedProducts(limit = 8) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      sellers:product_sellers(
        *,
        seller:sellers(*)
      )
    `)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching featured products:", error)
    return []
  }

  return (data || []).map(transformProduct)
}

export async function getTrendingProducts(limit = 8) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      sellers:product_sellers(
        *,
        seller:sellers(*)
      )
    `)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching trending products:", error)
    return []
  }

  return (data || []).map(transformProduct)
}

function transformProduct(product: any): ProductWithDetails {
  // Transform image URLs (array of strings) to ProductImage objects
  const images: ProductImage[] = product.images
    ? product.images.map((url: string, idx: number) => ({
        id: `${product.id}-img-${idx}`,
        url,
        alt_text: `${product.name} - Image ${idx + 1}`,
      }))
    : []

  return {
    ...product,
    images,
    variants: product.sellers || [],
  }
}
