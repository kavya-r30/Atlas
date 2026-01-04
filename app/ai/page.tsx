import { Navbar } from "@/components/navbar"
import { AIProductGrid } from "@/components/ai-product-grid"
import { AISmartBundles } from "@/components/ai-smart-bundles"
import { getFeaturedProducts } from "@/lib/api/products"
import { getOutfitBundles } from "@/lib/api/outfits"

export default async function AIRecommendationsPage() {
  const [products, outfitBundles] = await Promise.all([getFeaturedProducts(8), getOutfitBundles(2)])

  // Transform outfit bundles into the format AISmartBundles expects
  const bundles = outfitBundles.map((bundle) => ({
    id: bundle.id,
    name: bundle.name,
    description: bundle.description || "AI-curated outfit bundle",
    discount_percentage: bundle.discount_percentage,
    products: bundle.products || [],
  }))

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

        {bundles.length > 0 && (
          <section className="pt-20 border-t">
            <AISmartBundles bundles={bundles} />
          </section>
        )}

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
