import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types/database"

export async function getCategories() {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      products:products(count)
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }

  return (data || []).map((cat: any) => ({
    ...cat,
    product_count: cat.products?.[0]?.count || 0,
  })) as Category[]
}

export async function getCategoryBySlug(slug: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data as Category
}

export async function getSubcategories(parentId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parentId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching subcategories:", error)
    return []
  }

  return (data as Category[]) || []
}

export async function getTopCategories(limit = 3) {
  const categories = await getCategories()
  return categories.sort((a, b) => (b.product_count || 0) - (a.product_count || 0)).slice(0, limit)
}
