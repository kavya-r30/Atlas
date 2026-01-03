export const dynamic = "force-dynamic";

import { Navbar } from "@/components/navbar"
import { getAllSellers, getAllOrders } from "@/lib/api/admin"
import { getCategories } from "@/lib/api/categories"
import { getProducts } from "@/lib/api/products"
import { Button } from "@/components/ui/button"
import { Users, LayoutGrid, ShoppingCart, ShieldAlert } from "lucide-react"

export default async function AdminConsole() {
  const [sellers, orders, categories, productsResponse] = await Promise.all([
    getAllSellers(),
    getAllOrders(),
    getCategories(),
    getProducts(),
  ])

  const products = productsResponse.products

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="border-b pb-8">
            <h1 className="text-4xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-muted-foreground mt-2 font-medium tracking-tight uppercase tracking-widest text-xs">
              Global platform oversight
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-primary text-primary-foreground space-y-2">
              <Users className="h-5 w-5 opacity-70" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Total Sellers</p>
              <p className="text-3xl font-bold">{sellers.length}</p>
            </div>
            <div className="p-8 bg-card border space-y-2">
              <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categories</p>
              <p className="text-3xl font-bold">{categories.length}</p>
            </div>
            <div className="p-8 bg-card border space-y-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <div className="p-8 bg-card border space-y-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Unverified Sellers
              </p>
              <p className="text-3xl font-bold text-destructive">{sellers.filter((s) => !s.is_verified).length}</p>
            </div>
          </div>

          <div className="space-y-12">
            {/* Global Orders Table */}
            <section className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Global Orders Overview</h2>
              <div className="bg-card border overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Order #</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Customer</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Date</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Total</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-bold tracking-tight">{order.order_number}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold">{(order.user as any)?.email ?? "—"}</p>
                          <p className="text-[10px] text-muted-foreground">{(order.user as any).email}</p>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter bg-muted">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Seller Verification Management */}
            <section className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Seller Oversight</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellers.map((seller) => (
                  <div key={seller.id} className="p-6 bg-card border flex flex-col justify-between space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted flex items-center justify-center font-bold text-xs">
                          {seller.business_name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{seller.business_name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Joined {new Date(seller.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter ${seller.is_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {seller.is_verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-none text-[8px] font-bold uppercase tracking-widest h-8 bg-transparent"
                      >
                        View Shop
                      </Button>
                      {!seller.is_verified && (
                        <Button className="flex-1 rounded-none text-[8px] font-bold uppercase tracking-widest h-8">
                          Verify Seller
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
