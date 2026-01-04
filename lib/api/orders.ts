import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Order } from "./checkout"
import { DEMO_USER_ID } from "@/lib/constants"

export interface OrderWithItems extends Order {
  items: OrderItem[]
  tracking: OrderTracking[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  product_name: string
  product_image: string | null
  quantity: number
  price: number
  attributes: any
  created_at: string
}

export interface OrderTracking {
  id: string
  order_id: string
  status: string
  location: string | null
  description: string | null
  created_at: string
}

export async function getUserOrders(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*),
      tracking:order_tracking(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data as OrderWithItems[]
}

export async function getOrderDetails(orderId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*),
      tracking:order_tracking(*)
    `)
    .eq("id", orderId)
    .single()

  if (error) {
    console.error("Error fetching order details:", error)
    return null
  }

  return data as OrderWithItems
}
