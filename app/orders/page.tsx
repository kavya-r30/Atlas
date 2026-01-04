import { Navbar } from "@/components/navbar"
import { getUserOrders } from "@/lib/api/orders"
import { DEMO_USER_ID } from "@/lib/constants"
import Link from "next/link"
import { Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function OrdersPage() {
  const userId = DEMO_USER_ID
  const orders = await getUserOrders(userId)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Orders</h1>
              <p className="text-muted-foreground mt-2 font-medium">Manage and track your Atlas purchases</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {orders.length} total orders
            </p>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border group overflow-hidden transition-all hover:border-primary"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-8 border-b border-dashed">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Order Number
                        </p>
                        <p className="text-sm font-bold tracking-tight">{order.order_number}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</p>
                        <p className="text-sm font-bold tracking-tight">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</p>
                        <p className="text-sm font-bold tracking-tight">₹{order.total.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
                        <span
                          className={`inline-block px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                      <div className="flex -space-x-4">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={item.id}
                            className="relative h-16 w-12 border-2 border-background bg-muted overflow-hidden z-10"
                            style={{ zIndex: 10 - idx }}
                          >
                            <img
                              src={item.product_image || "/placeholder.svg?height=200&width=150"}
                              alt={item.product_name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="h-16 w-12 border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 w-full sm:w-auto">
                        <Link href={`/orders/${order.id}`} className="flex-1 sm:flex-none">
                          <Button
                            variant="outline"
                            className="w-full rounded-none border-border uppercase tracking-widest font-bold text-[10px] h-10 bg-transparent"
                          >
                            View Details
                          </Button>
                        </Link>
                        {order.status === "shipped" && (
                          <Button className="flex-1 sm:flex-none rounded-none uppercase tracking-widest font-bold text-[10px] h-10">
                            Track Order <Truck className="ml-2 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center gap-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground opacity-20" />
              <div className="space-y-2">
                <p className="text-xl font-bold">No orders found</p>
                <p className="text-muted-foreground max-w-xs">
                  You haven't placed any orders yet. Start exploring our collection.
                </p>
              </div>
              <Link href="/shop">
                <Button className="rounded-none px-8 h-12 uppercase tracking-widest font-bold">Browse Shop</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
