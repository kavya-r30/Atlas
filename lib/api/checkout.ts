import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { CartItem } from "./cart"

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  tax: number
  shipping_fee: number
  total: number
  payment_method: string
  shipping_address_id: string
  billing_address_id: string
  created_at: string
}

export async function placeOrder(orderData: Omit<Order, "id" | "order_number" | "created_at">, cartItems: CartItem[]) {
  const supabase = getSupabaseBrowserClient()

  // Generate a random order number
  const orderNumber = `ATL-${Math.floor(100000 + Math.random() * 900000)}`

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      ...orderData,
      order_number: orderNumber,
      status: "pending",
    })
    .select()
    .single()

  if (orderError) {
    console.error("[v0] Error placing order:", orderError)
    return null
  }

  // Insert order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_variant_id: item.product_variant_id,
    seller_id: item.variant?.seller_id,
    quantity: item.quantity,
    price_at_purchase: item.variant?.price,
    status: "pending",
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("[v0] Error creating order items:", itemsError)
    return null
  }

  // Clear cart
  await supabase.from("cart_items").delete().eq("user_id", orderData.user_id)

  return order as Order
}
