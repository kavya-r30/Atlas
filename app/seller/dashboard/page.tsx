import { Navbar } from "@/components/navbar"
import { getSellerProfile, getSellerVariants, getSellerOrderItems } from "@/lib/api/sellers"
import { DEMO_SELLER_ID } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Settings, ArrowUpRight, TrendingUp, PackageIcon, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default async function SellerDashboard() {
  const userId = DEMO_SELLER_ID
  const seller = await getSellerProfile(userId)
  const variants = await getSellerVariants(seller?.id || "")
  const orders = await getSellerOrderItems(seller?.id || "")

  const activeProducts = variants.filter((v) => v.is_active).length
  const totalStock = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
  const lowStockItems = variants.filter((v) => (v.stock_quantity || 0) < 10).length
  const pendingOrders = orders.filter((o) => (o.order as any).status === "pending").length
  const totalRevenue = orders.reduce((sum, o) => sum + (o as any).price * o.quantity, 0)

  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const day = new Date()
    day.setDate(day.getDate() - (6 - i))
    const dayOrders = orders.filter((o) => new Date((o.order as any).created_at).toDateString() === day.toDateString())
    return {
      name: day.toLocaleDateString("en-US", { weekday: "short" }),
      sales: dayOrders.reduce((sum, o) => sum + (o as any).price * o.quantity, 0),
      orders: dayOrders.length,
    }
  })

  const topProducts = variants
    .sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0))
    .slice(0, 5)
    .map((v) => ({
      name: ((v.product as any)?.name || "Product").substring(0, 15),
      stock: v.stock_quantity || 0,
      price: v.price,
    }))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
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

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-card border space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <PackageIcon className="h-4 w-4" /> Active Products
              </p>
              <p className="text-4xl font-bold">{activeProducts}</p>
              <p className="text-[10px] text-muted-foreground">Total stock: {totalStock} units</p>
            </div>
            <div className="p-6 bg-card border space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Pending Orders
              </p>
              <p className="text-4xl font-bold">{pendingOrders}</p>
              <p className="text-[10px] text-muted-foreground">Total orders: {orders.length}</p>
            </div>
            <div className="p-6 bg-card border space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</p>
              <p className="text-4xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-[10px] text-muted-foreground">From {orders.length} orders</p>
            </div>
            <div className="p-6 bg-card border space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" /> Low Stock
              </p>
              <p className="text-4xl font-bold text-amber-600">{lowStockItems}</p>
              <p className="text-[10px] text-muted-foreground">Items need restocking</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Chart */}
            <div className="p-6 bg-card border space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">Weekly Sales</h2>
                <p className="text-[10px] text-muted-foreground">Last 7 days performance</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" />
                  <Bar dataKey="orders" fill="hsl(var(--primary) / 0.5)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="p-6 bg-card border space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">Top Products</h2>
                <p className="text-[10px] text-muted-foreground">By stock quantity</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="stock" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
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
                        <td className="px-6 py-4 font-bold text-sm">₹{v.price.toFixed(2)}</td>
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

            {/* Recent Orders */}
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
                        <img
                          src={item.product_image || "/placeholder.svg"}
                          alt="product"
                          className="object-cover w-full h-full"
                        />
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
