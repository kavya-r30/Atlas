import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { DEMO_USER_ID } from "@/lib/constants"

export interface ReplenishmentSchedule {
  id: string
  user_id: string
  product_id: string
  frequency_days: number
  last_purchase_date: string | null
  next_due_date: string | null
  auto_order: boolean
  product?: {
    id: string
    name: string
    slug: string
  }
}

export async function getReplenishmentSchedules(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("replenishment_schedules")
    .select(`
      *,
      product:products(id, name, slug)
    `)
    .eq("user_id", userId)
    .order("next_due_date", { ascending: true })

  if (error) {
    console.error("Error fetching schedules:", error)
    return []
  }
  return data as ReplenishmentSchedule[]
}
