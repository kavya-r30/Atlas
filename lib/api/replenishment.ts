import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { DEMO_USER_ID } from "@/lib/constants"

const REPLENISHMENT_PRODUCT_IDS = [
  "01dda082-734b-4c9c-bab0-01c90360da59",
  "0271bddf-2e5a-457d-ae10-4acbe9e5652e",
  "199ffaf0-059d-4945-925e-f74e9f40ac7f",
  "1c37cf9c-c489-44cf-ac5a-00d7c1183055",
]

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
    base_price: number
    images: string[]
  }
}

export async function getReplenishmentProducts(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name),
      sellers:product_sellers(id, price, stock_quantity)
    `)
    .in("id", REPLENISHMENT_PRODUCT_IDS)

  if (error) {
    console.error("Error fetching replenishment products:", error)
    return []
  }

  return (data || []).map((product, idx) => ({
    id: `replenish-${idx}`,
    user_id: userId,
    product_id: product.id,
    frequency_days: 30,
    last_purchase_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    next_due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    auto_order: true,
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      base_price: product.base_price,
      images: product.images || [],
    },
  }))
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
