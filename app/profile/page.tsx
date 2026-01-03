import { Navbar } from "@/components/navbar"
import { getUserOrders } from "@/lib/api/orders"
import { getUserAddresses } from "@/lib/api/addresses"
import { DEMO_USER_ID } from "@/lib/constants"
import { ShoppingBag, MapPin, User, Settings, Package, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const userId = DEMO_USER_ID

  // Fetch data in parallel
  const [orders, addresses] = await Promise.all([getUserOrders(userId), getUserAddresses(userId)])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-full border">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Personal Account</h1>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-1">
                  ID: {userId.split("-")[0]}...
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="rounded-none font-bold uppercase tracking-widest text-[10px] bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-2">
              <nav className="flex flex-col">
                {[
                  { label: "Recent Orders", icon: Package, href: "#orders", active: true },
                  { label: "My Addresses", icon: MapPin, href: "#addresses" },
                  { label: "Account Settings", icon: User, href: "#settings" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest transition-colors ${
                      item.active ? "bg-muted border-l-2 border-primary" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-50" />
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-16">
              {/* Recent Orders Section */}
              <section id="orders" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" /> Recent Orders
                  </h2>
                  <Link href="/orders" className="text-[10px] font-bold uppercase tracking-widest hover:underline">
                    View All
                  </Link>
                </div>

                {orders.length > 0 ? (
                  <div className="border border-dashed">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6 border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <div className="space-y-1 text-center sm:text-left">
                          <p className="text-sm font-bold">Order #{order.order_number}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <span
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-[10px] font-bold uppercase tracking-widest hover:underline mt-1 block"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 bg-muted/20 border border-dashed flex flex-col items-center justify-center gap-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">No orders found</p>
                    <Link href="/shop">
                      <Button size="sm" className="rounded-none h-9">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </section>

              {/* Addresses Section */}
              <section id="addresses" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Delivery Addresses
                  </h2>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold uppercase tracking-widest">
                    Add New
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-6 border ${address.is_default ? "border-primary ring-1 ring-primary" : "border-border"} relative group`}
                    >
                      {address.is_default && (
                        <span className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-[8px] font-bold uppercase tracking-widest text-primary-foreground">
                          Default
                        </span>
                      )}
                      <div className="space-y-3">
                        <p className="text-sm font-bold">{address.full_name}</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>{address.address_line1}</p>
                          {address.address_line2 && <p>{address.address_line2}</p>}
                          <p>
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p>{address.country}</p>
                        </div>
                        <div className="pt-4 flex gap-4 border-t border-dashed mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[10px] font-bold uppercase tracking-widest hover:text-primary">
                            Edit
                          </button>
                          <button className="text-[10px] font-bold uppercase tracking-widest hover:text-destructive">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="p-6 border border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors text-muted-foreground min-h-[160px]">
                    <Plus className="h-5 w-5" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Add New Address</p>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import { Plus } from "lucide-react"
