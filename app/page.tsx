import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { AIReplenishmentWidget } from "@/components/ai-replenishment-widget"
import { getFeaturedProducts, getTrendingProducts } from "@/lib/api/products"
import { getTopCategories } from "@/lib/api/categories"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const [featuredProducts, trendingProducts, topCategories] = await Promise.all([
    getFeaturedProducts(8),
    getTrendingProducts(8),
    getTopCategories(3),
  ])

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden">
          <Image
            src="/luxury-lifestyle-minimalist.jpg"
            alt="Hero"
            fill
            className="object-cover scale-105 animate-fade-in"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          <div className="container relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-8 stagger-children">
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em] bg-black/40 backdrop-blur-md px-3 py-1 w-fit">
                New Collection 2026
              </span>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white text-balance pt-4">
                Curated Style for the <span className="italic text-secondary">Modern Explorer</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-lg text-pretty font-medium leading-relaxed">
                A definitive collection of timeless pieces, crafted for those who appreciate the intersection of form
                and function.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="rounded-none px-10 h-14 uppercase tracking-widest font-black transition-all hover:bg-secondary hover:text-white"
                  >
                    Explore Shop
                  </Button>
                </Link>
                <Link href="/category/new-arrivals">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-none px-10 h-14 uppercase tracking-widest font-black bg-white/10 text-white border-white/40 backdrop-blur-md hover:bg-white hover:text-black transition-all"
                  >
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-32 container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 block">
                Collections
              </span>
              <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase">Shop by category</h2>
            </div>
            <Link
              href="/categories"
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-secondary"
            >
              Discover all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden bg-muted"
              >
                <Image
                  src={category.image_url || `/placeholder.svg?height=800&width=600&query=${category.name}`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-white text-3xl font-black tracking-tighter uppercase mb-4 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {category.name}
                  </h3>
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-4 opacity-0 transition-all delay-100 group-hover:opacity-100">
                    {category.product_count} Products
                  </span>
                  <div className="w-12 h-[2px] bg-white scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-32 bg-muted/20 relative overflow-hidden">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 block">
                  Curated Selection
                </span>
                <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase">The trending edit</h2>
              </div>
              <Link
                href="/shop?sort=trending"
                className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-secondary"
              >
                View products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-16 gap-x-8 stagger-children">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <AIReplenishmentWidget userId="user-123" />

        {/* Journal Section */}
        <section className="py-32 container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 stagger-children">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary block">
                Atlas Journal
              </span>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-tight uppercase">
                A story of <br /> craftsmanship
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                We believe in products that tell a story. Discover the artisans behind our newest sustainable collection
                and the journey of every material we source.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-xs font-black uppercase tracking-[0.3em] group hover:no-underline hover:text-secondary"
              >
                Read the journal <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[3/4] relative overflow-hidden bg-muted group">
                <Image
                  src="/craftsmanship.jpg"
                  alt="Edit 1"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="aspect-[3/4] relative overflow-hidden bg-muted mt-12 group">
                <Image
                  src="/design-details.jpg"
                  alt="Edit 2"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Selection */}
        <section className="py-32 container px-4 sm:px-6 lg:px-8 border-t">
          <div className="mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 block">
              Staff Picks
            </span>
            <h2 className="text-4xl font-black tracking-tighter sm:text-5xl uppercase">Featured selection</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-16 gap-x-8 stagger-children">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-20 bg-muted/10">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <div className="col-span-2 lg:col-span-2 space-y-8">
              <Link href="/" className="text-3xl font-black tracking-tighter">
                ATLAS
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed font-medium">
                Modern curation for the discerning explorer. We connect you with global brands that define the next
                standard of quality and design.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Shop</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                <li>
                  <Link href="/shop" className="hover:text-primary transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-primary transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="hover:text-primary transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/trending" className="hover:text-primary transition-colors">
                    Trending
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Support</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-primary transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="hover:text-primary transition-colors">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Atlas</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-primary transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 Atlas E-commerce Platform. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Pinterest
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
