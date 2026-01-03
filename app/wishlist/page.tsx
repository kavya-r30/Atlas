import { Navbar } from "@/components/navbar"
import { getWishlist } from "@/lib/api/engagement"
import { ProductCard } from "@/components/product-card"
import { DEMO_USER_ID } from "@/lib/constants"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function WishlistPage() {
  const wishlistItems = await getWishlist(DEMO_USER_ID)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Wishlist</h1>
              <p className="text-muted-foreground mt-2 font-medium">Your curated selection of must-have pieces</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {wishlistItems.length} saved items
            </p>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
              {wishlistItems.map((item: any) => (
                <ProductCard key={item.id} product={item.product} />
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center gap-6 text-center">
              <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-full">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-bold">Your wishlist is empty</p>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Save items you love to keep track of them and get notified about updates.
                </p>
              </div>
              <Link href="/shop">
                <Button className="rounded-none px-8 h-12 uppercase tracking-widest font-bold">Start Exploring</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
