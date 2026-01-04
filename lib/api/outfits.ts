import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { DEMO_USER_ID } from "@/lib/constants"

const OUTFIT_PRODUCT_IDS = [
  "1bbc84de-6834-48db-9777-dd293e05c47c",
  "34c433ea-6fb1-4571-9acc-8b827c6b4893",
  "453366ae-8bae-4e21-b25d-678b691e6d98",
  "50cc9bcf-a772-4850-9e80-db4597919cb6",
  "5534e2cd-9e1e-406e-ab7d-5ad9936c6f8d",
  "dc77a19c-9d08-4257-aedd-7a6997e0a531",
]

export interface OutfitBundle {
  id: string
  name: string
  description?: string
  product_ids: string[]
  discount_percentage: number
  is_ai_generated: boolean
  intent_query?: string
  created_at?: string
  products?: Array<{
    id: string
    name: string
    slug: string
    base_price: number
    images: string[]
    category: {
      id: string
      name: string
    }
  }>
}

export async function getOutfitBundles(limit = 10) {
  const supabase = getSupabaseBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      base_price,
      images,
      category:categories(id, name)
    `)
    .in("id", OUTFIT_PRODUCT_IDS)

  if (error) {
    console.error("Error fetching outfit products:", error)
    return []
  }

  const bundlesWithProducts = [
    {
      id: "bundle-1",
      name: "Summer Essentials",
      description: "Perfect summer wardrobe collection",
      product_ids: OUTFIT_PRODUCT_IDS.slice(0, 3),
      discount_percentage: 10,
      is_ai_generated: true,
      intent_query: "summer outfit",
      created_at: new Date().toISOString(),
      products: (products || []).slice(0, 3),
    },
    {
      id: "bundle-2",
      name: "Casual & Comfortable",
      description: "Everyday wear bundle",
      product_ids: OUTFIT_PRODUCT_IDS.slice(3, 6),
      discount_percentage: 8,
      is_ai_generated: true,
      intent_query: "casual wear",
      created_at: new Date().toISOString(),
      products: (products || []).slice(3, 6),
    },
  ]

  return bundlesWithProducts
}

export async function getUserOutfits(userId: string = DEMO_USER_ID) {
  const supabase = getSupabaseBrowserClient()

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      base_price,
      images,
      category:categories(id, name)
    `)
    .in("id", OUTFIT_PRODUCT_IDS.slice(0, 4))

  if (error) {
    console.error("Error fetching user outfits:", error)
    return []
  }

  return [
    {
      id: "outfit-1",
      user_id: userId,
      name: "My Casual Look",
      product_ids: OUTFIT_PRODUCT_IDS.slice(0, 3),
      created_at: new Date().toISOString(),
      products: products || [],
    },
  ]
}
