import { Navbar } from "@/components/navbar"
import { getAllSellers } from "@/lib/api/admin"
import Link from "next/link"
import { Star, ShieldCheck } from "lucide-react"

export default async function SellersPage() {
  const sellers = await getAllSellers()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="border-b pb-8">
            <h1 className="text-4xl font-bold tracking-tight">Our Sellers</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Meet the curators and artisans behind our collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-card border p-8 space-y-6 flex flex-col group transition-all hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-muted flex items-center justify-center font-bold text-xl uppercase tracking-widest border shrink-0">
                      {seller.name?.[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{seller.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-xs font-bold">{seller.rating}</span>
                        </div>
                        {seller.verified && (
                          <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded-sm">
                            <ShieldCheck className="h-3 w-3 text-primary" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {seller.description || "An Atlas curated partner committed to quality and style."}
                </p>

                <div className="pt-4 border-t border-dashed mt-auto">
                  <Link
                    href={`/shop?seller=${seller.id}`}
                    className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    View Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
