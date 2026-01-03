import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Review } from "@/lib/types/database"

export async function getProductReviews(productId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      user:profiles(full_name, avatar_url)
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching reviews:", error)
    return []
  }

  return (data as Review[]) || []
}

export async function createReview(review: {
  product_id: string
  user_id: string
  seller_id?: string
  order_id?: string
  rating: number
  title?: string
  content?: string
  images?: string[]
  verified_purchase?: boolean
}) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("reviews").insert(review).select().single()

  if (error) {
    console.error("[v0] Error creating review:", error)
    return null
  }

  return data as Review
}
