import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { CartItem } from "@/lib/types/database"
import { DEMO_USER_ID } from "@/lib/constants"

const DEFAULT_USER_ID = "1436151c-9dc0-4810-bcbb-946bfe5ab587"

export async function getCartItems(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      product:products(*),
      seller:sellers(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching cart items:", error)
    return []
  }

  return (data as CartItem[]) || []
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  sellerId?: string,
  selectedAttributes?: any,
) {
  const supabase = getSupabaseBrowserClient()

  console.log("[v0] addToCart called with:", { userId, productId, quantity, sellerId, selectedAttributes })

  // Check if item already exists
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating cart item:", error)
      return null
    }

    return data as CartItem
  }

  // Insert new item
  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: userId,
      product_id: productId,
      seller_id: sellerId || null,
      quantity,
      selected_attributes: selectedAttributes || null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding to cart:", error)
    return null
  }

  return data as CartItem
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = getSupabaseBrowserClient()

  // Ensure quantity is at least 1
  const sanitizedQuantity = Math.max(1, quantity)

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity: sanitizedQuantity })
    .eq("id", cartItemId)
    .select(`
      *,
      product:products(*),
      seller:sellers(*)
    `)
    .single()

  if (error) {
    console.error("[v0] Error updating cart item quantity:", error)
    return null
  }

  return data as CartItem
}

export async function removeFromCart(cartItemId: string) {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

  if (error) {
    console.error("[v0] Error removing from cart:", error)
    return false
  }

  return true
}

export async function clearCart(userId: string) {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId)

  if (error) {
    console.error("[v0] Error clearing cart:", error)
    return false
  }

  return true
}

export async function getCartCount(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()

  const { count, error } = await supabase
    .from("cart_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (error) {
    console.error("[v0] Error fetching cart count:", error)
    return 0
  }

  return count || 0
}
