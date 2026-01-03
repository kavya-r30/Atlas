import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types/database"

export async function getCategories() {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("name", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }

  return (data as Category[]) || []
}

export async function getCategoryBySlug(slug: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("[v0] Error fetching category:", error)
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
    console.error("[v0] Error fetching subcategories:", error)
    return []
  }

  return (data as Category[]) || []
}
