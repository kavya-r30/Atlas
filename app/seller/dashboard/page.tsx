import { Navbar } from "@/components/navbar"
import { getSellerProfile, getSellerVariants, getSellerOrderItems } from "@/lib/api/sellers"
import { DEMO_SELLER_ID } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Settings, ArrowUpRight } from "lucide-react"

export default async function SellerDashboard() {
  // Hardcoded for demo
  const userId = DEMO_SELLER_ID
  const seller = await getSellerProfile(userId)
  const variants = await getSellerVariants(seller?.id || "")
  const orders = await getSellerOrderItems(seller?.id || "")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Seller Console</h1>
              <p className="text-muted-foreground mt-2 font-medium">{seller?.business_name || "Merchant Dashboard"}</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="rounded-none uppercase tracking-widest font-bold text-[10px] h-10 bg-transparent"
              >
                Edit Profile <Settings className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Products</p>
              <p className="text-3xl font-bold">{variants.filter((v) => v.is_active).length}</p>
            </div>
            <div className="p-8 bg-card border space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Orders</p>
              <p className="text-3xl font-bold">{orders.filter((o) => (o.order as any).status === "pending").length}</p>
            </div>
            <div className="p-8 bg-card border space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Verification Status
              </p>
              <p
                className={`text-xl font-bold uppercase tracking-widest ${seller?.is_verified ? "text-green-600" : "text-amber-600"}`}
              >
                {seller?.is_verified ? "Verified" : "Pending"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Inventory Management */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest">Inventory Management</h2>
                <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest">
                  Manage All
                </Button>
              </div>
              <div className="bg-card border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {variants.slice(0, 5).map((v) => (
                      <tr key={v.id}>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold truncate max-w-[150px]">{(v.product as any).name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">SKU: {v.sku}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm">${v.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${v.stock_quantity < 10 ? "bg-destructive" : "bg-green-500"}`}
                            />
                            <span className="text-xs font-bold">{v.stock_quantity}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Seller Orders */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest">Recent Orders</h2>
                <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {orders.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-6 bg-card border flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-10 bg-muted shrink-0 overflow-hidden">
                        <img src={item.product_image || "/placeholder.svg"} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{(item.order as any).order_number}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                          {item.product_name} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[8px] font-bold uppercase tracking-tighter bg-muted px-2 py-0.5">
                        {(item.order as any).status}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
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
