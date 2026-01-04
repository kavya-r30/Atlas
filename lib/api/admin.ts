import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export async function getAllSellers() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("sellers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all sellers:", error)
    return []
  }
  return data
}

export async function verifySeller(sellerId: string, verified: boolean) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("sellers").update({ verified }).eq("id", sellerId)

  if (error) {
    console.error("Error verifying seller:", error)
    return false
  }
  return true
}

export async function getAllOrders() {
  const supabase = getSupabaseBrowserClient()
  // <CHANGE> Fix table reference from 'users' to 'profiles' to match schema
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      user:profiles(full_name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all orders:", error)
    return []
  }
  return data
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

  if (error) {
    console.error("Error updating order status:", error)
    return false
  }
  return true
}
