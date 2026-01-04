import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// <CHANGE> Updated interfaces to match actual database schema
export interface SellerProfile {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  rating: number
  total_reviews: number
  return_policy: string | null
  return_days: number
  return_shipping_paid: boolean
  delivery_days: number
  verified: boolean
  created_at: string
}

export async function getSellerProfile(sellerId: string) {
  const supabase = getSupabaseBrowserClient()
  // <CHANGE> Query sellers table directly by seller id, not user_id
  const { data, error } = await supabase.from("sellers").select("*").eq("id", sellerId).single()

  if (error) {
    console.error("Error fetching seller profile:", error)
    return null
  }
  return data as SellerProfile
}

export async function updateSellerProfile(sellerId: string, profile: Partial<SellerProfile>) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("sellers").update(profile).eq("id", sellerId).select().single()

  if (error) {
    console.error("Error updating seller profile:", error)
    return null
  }
  return data as SellerProfile
}

export async function getSellerVariants(sellerId: string) {
  const supabase = getSupabaseBrowserClient()
  // <CHANGE> Query product_sellers table which links products to sellers
  const { data, error } = await supabase
    .from("product_sellers")
    .select(`
      *,
      product:products(id, name, slug)
    `)
    .eq("seller_id", sellerId)

  if (error) {
    console.error("Error fetching seller variants:", error)
    return []
  }
  return data
}

export async function updateVariantInventory(
  variantId: string,
  updates: { price?: number; stock_quantity?: number; is_active?: boolean },
) {
  const supabase = getSupabaseBrowserClient()
  // <CHANGE> Update product_sellers table
  const { data, error } = await supabase.from("product_sellers").update(updates).eq("id", variantId).select().single()

  if (error) {
    console.error("Error updating variant:", error)
    return null
  }
  return data
}

export async function getSellerOrderItems(sellerId: string) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      *,
      order:orders(order_number, status, created_at)
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching seller orders:", error)
    return []
  }
  return data
}
