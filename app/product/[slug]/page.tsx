import { cn } from "@/lib/utils"
import { Navbar } from "@/components/navbar"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductActions } from "@/components/product/product-actions"
import { ProductCard } from "@/components/product-card"
import { getProductBySlug, getProducts } from "@/lib/api/products"
import { getProductReviews } from "@/lib/api/reviews"
import { notFound } from "next/navigation"
import { Star } from "lucide-react"
import Image from "next/image"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const reviews = await getProductReviews(product.id)
  const { products: relatedProducts } = await getProducts({ categoryId: product.category_id }, 1, 4)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Product Overview */}
        <div className="container px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <ProductGallery images={product.images} />
            <ProductActions product={product} />
          </div>
        </div>

        {/* Product Details */}
        <div className="border-y border-dashed bg-muted/20">
          <div className="container px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Product Details</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed text-lg">
                    {product.description}
                  </div>
                </div>

                {product.attributes && Object.keys(product.attributes).length > 0 && (
                  <div className="grid grid-cols-2 gap-8 pt-8">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="space-y-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest">{key}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-8 bg-background p-8 border">
                <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Specifications</h3>
                <dl className="space-y-4">
                  {product.variants[0]?.sku && (
                    <div className="flex justify-between items-center text-sm">
                      <dt className="text-muted-foreground font-medium">SKU</dt>
                      <dd className="font-bold">{product.variants[0].sku}</dd>
                    </div>
                  )}
                  {product.category?.name && (
                    <div className="flex justify-between items-center text-sm">
                      <dt className="text-muted-foreground font-medium">Category</dt>
                      <dd className="font-bold">{product.category.name}</dd>
                    </div>
                  )}
                  {product.is_digital !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <dt className="text-muted-foreground font-medium">Type</dt>
                      <dd className="font-bold">{product.is_digital ? "Digital" : "Physical"}</dd>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <dt className="text-muted-foreground font-medium">Tags</dt>
                      <dd className="font-bold text-right">{product.tags.join(", ")}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Community Feedback</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-5 w-5",
                        star <= (product.avg_rating || 0) ? "fill-primary text-primary" : "text-border",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold">{product.avg_rating?.toFixed(1) || "N/A"}</span>
                <span className="text-muted-foreground font-medium text-sm">Based on {reviews.length} ratings</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="space-y-4 border-b pb-8 border-dashed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                        {review.user?.avatar_url && (
                          <Image
                            src={review.user.avatar_url || "/placeholder.svg"}
                            alt={review.user.full_name || "User"}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{review.user?.full_name || "Anonymous"}</p>
                        {review.verified_purchase && (
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                            Verified Purchase
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn("h-3 w-3", s <= review.rating ? "fill-primary text-primary" : "text-border")}
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && <p className="font-bold text-sm">{review.title}</p>}
                  {review.content && (
                    <p className="text-muted-foreground leading-relaxed text-sm italic">
                      &ldquo;{review.content}&rdquo;
                    </p>
                  )}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="relative h-16 w-16 bg-muted overflow-hidden">
                          <Image src={img || "/placeholder.svg"} alt="Review image" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground font-medium italic">No reviews yet for this product.</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container px-4 sm:px-6 lg:px-8 py-24 border-t">
            <div className="space-y-12">
              <h2 className="text-2xl font-bold tracking-tighter uppercase tracking-widest text-center">
                You may also like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((rp) => (
                    <ProductCard key={rp.id} product={rp} />
                  ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
