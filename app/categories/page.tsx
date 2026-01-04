import { Navbar } from "@/components/navbar"
import { getCategories } from "@/lib/api/categories"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default async function CategoriesPage() {
  const allCategories = await getCategories()

  const categories = allCategories.filter(
    (allCategories) => allCategories.product_count > 0
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tighter">Collections</h1>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
                Browse our curated departments
              </p>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {categories.length} Departments Available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="group space-y-6">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={category.image_url || `/placeholder.svg?height=800&width=600&query=${category.name}`}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-background/95 backdrop-blur p-6 flex flex-col gap-2 border">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold tracking-widest uppercase">{category.name}</h2>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {category.product_count} items
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 px-2">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {category.description ||
                      `Explore our premium selection of ${category.name.toLowerCase()} curated for quality and style.`}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline inline-flex items-center gap-2">
                    Shop Collection <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
