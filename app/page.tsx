import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts, getTrendingProducts } from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const [featuredProducts, trendingProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getTrendingProducts(8),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] w-full overflow-hidden bg-muted">
          <Image src="/placeholder.svg?height=1080&width=1920" alt="Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
          <div className="container relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-balance leading-tight">
                Curated Style for the <span className="italic text-secondary">Modern Explorer</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg text-pretty">
                Discover a collection where quality meets design. Atlas brings you the finest selection from global
                sellers.
              </p>
              <div className="flex gap-4">
                <Link href="/category/all">
                  <Button size="lg" className="rounded-none px-8 h-12 uppercase tracking-widest font-bold">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/category/new-arrivals">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-none px-8 h-12 uppercase tracking-widest font-bold bg-transparent"
                  >
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-24 container px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Categories</h2>
              <p className="text-muted-foreground mt-2">Explore our most popular departments</p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category, idx) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative h-80 overflow-hidden bg-muted"
              >
                <Image
                  src={category.image_url || `/placeholder.svg?height=600&width=400&query=${category.name}`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold tracking-widest uppercase text-center px-4">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trending Now</h2>
                <p className="text-muted-foreground mt-2">The pieces everyone is talking about</p>
              </div>
              <Link
                href="/shop?sort=trending"
                className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              >
                Shop All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Selection */}
        <section className="py-24 container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">The Atlas Curated Edit</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hand-selected by our team of stylists, this season's collection focuses on versatility, sustainable
                materials, and timeless silhouettes.
              </p>
              <Button variant="link" className="p-0 h-auto text-base font-bold uppercase tracking-widest group">
                Read the journal <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                <Image src="/placeholder.svg?height=600&width=450" alt="Edit 1" fill className="object-cover" />
              </div>
              <div className="aspect-[3/4] relative overflow-hidden bg-muted mt-8">
                <Image src="/placeholder.svg?height=600&width=450" alt="Edit 2" fill className="object-cover" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-card">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <Link href="/" className="text-2xl font-bold tracking-tighter">
                ATLAS
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                A modern e-commerce platform connecting discerning shoppers with exceptional products from global
                artisans and brands.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Atlas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
