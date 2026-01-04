import { Navbar } from "@/components/navbar"
import { getOrderDetails } from "@/lib/api/orders"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Truck, Package, CheckCircle2, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderDetails(id)

  if (!order) notFound()

  const steps = [
    { status: "pending", label: "Confirmed", icon: CheckCircle2 },
    { status: "processing", label: "Packed", icon: Package },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: MapPin },
  ]

  const currentStep = steps.findIndex((s) => s.status === order.status) || 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b pb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Order {order.order_number}</h1>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="rounded-none uppercase tracking-widest font-bold text-[10px] bg-transparent"
              >
                Invoice
              </Button>
              <Button className="rounded-none uppercase tracking-widest font-bold text-[10px]">Need Help?</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
              {/* Vertical Tracking Timeline */}
              <section className="space-y-8 bg-card border p-8">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Tracking Timeline</h2>
                <div className="space-y-0 relative">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStep
                    const Icon = step.icon
                    return (
                      <div key={step.status} className="flex gap-6 pb-10 relative last:pb-0">
                        {idx !== steps.length - 1 && (
                          <div
                            className={`absolute left-[11px] top-6 w-[2px] h-full ${
                              idx < currentStep ? "bg-primary" : "bg-border border-dashed border-l-2"
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 h-6 w-6 rounded-full flex items-center justify-center border-2 bg-background ${
                            isCompleted ? "border-primary text-primary" : "border-border text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="space-y-1">
                          <p
                            className={`text-sm font-bold uppercase tracking-widest ${isCompleted ? "text-foreground" : "text-muted-foreground opacity-50"}`}
                          >
                            {step.label}
                          </p>
                          {isCompleted && (
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {idx === currentStep ? "Current Status" : "Successfully processed"}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Items */}
              <section className="space-y-8">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Order Items</h2>
                <div className="space-y-12">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-6">
                      <div className="relative aspect-[3/4] w-24 bg-muted overflow-hidden">
                        <img
                          src={item.product_image || "/placeholder.svg?height=400&width=300"}
                          alt={item.product_name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-bold">{item.product_name}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold">₹{item.price.toFixed(2)}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none text-[10px] font-bold uppercase tracking-widest bg-transparent h-8"
                        >
                          Write a Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              {/* Delivery Info */}
              <div className="bg-card border p-8 space-y-8">
                <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-4">Delivery & Payment</h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <MapPin className="h-3 w-3" /> Shipping Address
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {typeof order.shipping_address === "object" ? (
                        <>
                          <p className="font-bold text-foreground mb-1">{(order.shipping_address as any).full_name}</p>
                          <p>{(order.shipping_address as any).address_line1}</p>
                          <p>
                            {(order.shipping_address as any).city}, {(order.shipping_address as any).state}{" "}
                            {(order.shipping_address as any).postal_code}
                          </p>
                        </>
                      ) : (
                        <p>{order.shipping_address}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <CreditCard className="h-3 w-3" /> Payment Method
                    </div>
                    <p className="text-xs font-bold">{order.payment_method || "Credit Card"}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-dashed">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{(order.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{(order.shipping_cost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Need help banner */}
              <div className="p-8 bg-primary text-primary-foreground text-center space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest">Issue with your order?</h3>
                <p className="text-[10px] font-medium leading-relaxed opacity-80">
                  Our support team is available 24/7 to help with any delivery or product issues.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-none uppercase tracking-widest font-bold text-[10px] bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
