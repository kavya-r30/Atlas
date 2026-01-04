import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { DEMO_USER_ID } from "@/lib/constants"

// Wishlist
export async function getWishlist(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      *,
      product:products(*)
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching wishlist:", error)
    return []
  }

  return data
}

export async function toggleWishlist(userId: string, productId: string) {
  const supabase = getSupabaseBrowserClient()

  // First check if it exists
  const { data: existing, error: findError } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle()

  if (findError) {
    console.error("Error checking wishlist status:", findError)
    return false
  }

  if (existing) {
    const { error: deleteError } = await supabase.from("wishlists").delete().eq("id", existing.id)
    if (deleteError) {
      console.error("Error deleting from wishlist:", deleteError)
      return true // Return true because it technically still exists
    }
    return false
  } else {
    const { error: insertError } = await supabase.from("wishlists").insert({
      user_id: userId,
      product_id: productId,
    })
    if (insertError) {
      console.error("Error adding to wishlist:", insertError)
      return false
    }
    return true
  }
}

// Outfits
export interface Outfit {
  id: string
  user_id: string
  name: string
  product_ids: string[]
  thumbnail_url: string | null
  created_at: string
}

export async function getUserOutfits(userId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching outfits:", error)
    return []
  }

  return data as Outfit[]
}

export async function createOutfit(outfit: Omit<Outfit, "id" | "created_at">) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("outfits").insert(outfit).select().single()

  if (error) {
    console.error("Error creating outfit:", error)
    return null
  }

  return data as Outfit
}
