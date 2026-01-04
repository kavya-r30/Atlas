import { Navbar } from "@/components/navbar"
import { AIProductGrid } from "@/components/ai-product-grid"
import { AISmartBundles } from "@/components/ai-smart-bundles"
import { getFeaturedProducts } from "@/lib/api/products"

export default async function AIRecommendationsPage() {
  const products = await getFeaturedProducts(8)

  const mockBundles = [
    {
      id: "b1",
      name: "Modern Explorer Set",
      description: "Coordinated essentials for the urban wanderer, curated by our style agent.",
      discount_percentage: 15,
      products: products.slice(0, 3),
    },
    {
      id: "b2",
      name: "Evening Elegance",
      description: "A sophisticated selection for refined nights out, selected based on trending reviews.",
      discount_percentage: 10,
      products: products.slice(3, 6),
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12 pt-2">
        <section>
          <AIProductGrid
            products={products}
            title="Personalized For You"
            description="Based on your past orders and wishlist preferences."
            agent="Recommendation"
          />
        </section>

        <section className="pt-20 border-t">
          <AISmartBundles bundles={mockBundles} />
        </section>

        <section className="pt-20 border-t">
          <AIProductGrid
            products={products.slice(4)}
            title="Seasonal Essentials"
            description="Selected for your current location and weather conditions."
            agent="Style"
          />
        </section>
      </main>
    </div>
  )
}
