import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { DEMO_USER_ID } from "@/lib/constants"

export interface Address {
  id: string
  user_id: string
  full_name: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
  is_default: boolean
  created_at: string
}

export async function getUserAddresses(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })

  if (error) {
    console.error("Error fetching addresses:", error)
    return []
  }

  return data as Address[]
}

export async function createAddress(address: Omit<Address, "id" | "created_at">) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("addresses").insert(address).select().single()

  if (error) {
    console.error("Error creating address:", error)
    return null
  }

  return data as Address
}

export async function updateAddress(id: string, address: Partial<Address>) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("addresses").update(address).eq("id", id).select().single()

  if (error) {
    console.error("Error updating address:", error)
    return null
  }

  return data as Address
}

export async function deleteAddress(id: string) {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("addresses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting address:", error)
    return false
  }

  return true
}
