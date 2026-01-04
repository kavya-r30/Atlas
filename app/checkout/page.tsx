import { Navbar } from "@/components/navbar"
import { getCartItems } from "@/lib/api/cart"
import { getUserAddresses } from "@/lib/api/addresses"
import { DEMO_USER_ID } from "@/lib/constants"
import { ShieldCheck, Truck, CreditCard, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default async function CheckoutPage() {
  const userId = DEMO_USER_ID
  const cartItems = await getCartItems(userId)
  const addresses = await getUserAddresses(userId)

  const subtotal = cartItems.reduce((acc, item: any) => acc + (item.product?.base_price || 0) * item.quantity, 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 150 ? 0 : 15
  const total = subtotal + tax + shipping

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span className="text-primary">Cart</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Checkout</span>
            <ChevronRight className="h-3 w-3" />
            <span>Success</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
              {/* Shipping Address */}
              <section className="space-y-8">
                <div className="flex justify-between items-end border-b pb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest">1. Shipping Address</h2>
                  <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest">
                    + Add New
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-6 border text-left space-y-3 cursor-pointer transition-all ${addr.is_default ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground"}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold">{addr.full_name}</p>
                          {addr.is_default && (
                            <span className="text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 font-bold uppercase tracking-tighter">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>{addr.address_line1}</p>
                          {addr.address_line2 && <p>{addr.address_line2}</p>}
                          <p>
                            {addr.city}, {addr.state} {addr.postal_code}
                          </p>
                          <p>{addr.country}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 border-2 border-dashed flex flex-col items-center gap-4 text-center">
                      <Truck className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-bold">No saved addresses</p>
                        <p className="text-xs text-muted-foreground">Add your shipping details to continue</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none uppercase tracking-widest font-bold text-[10px] bg-transparent"
                      >
                        Add Address
                      </Button>
                    </div>
                  )}
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-8">
                <div className="border-b pb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest">2. Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-6 border border-primary ring-1 ring-primary flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold">Credit / Debit Card</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    <div className="h-4 w-4 rounded-full border-4 border-primary" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Card Number
                      </p>
                      <Input placeholder="0000 0000 0000 0000" className="rounded-none border-border h-12 font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expiry</p>
                        <Input placeholder="MM/YY" className="rounded-none border-border h-12 font-mono" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CVC</p>
                        <Input placeholder="123" className="rounded-none border-border h-12 font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Badge */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 border border-dashed text-muted-foreground">
                <ShieldCheck className="h-5 w-5" />
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  Your transaction is secure and encrypted with 256-bit SSL
                </p>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4">
              <div className="bg-card border p-8 space-y-8 sticky top-24">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-4">In Your Order</h2>

                <div className="space-y-6 max-h-[40vh] overflow-auto no-scrollbar">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-16 bg-muted shrink-0 overflow-hidden">
                        <Image
                          src={item.product?.images?.[0] || "/placeholder.svg?height=200&width=150"}
                          alt={item.product?.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <p className="text-xs font-bold line-clamp-1">{item.product?.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">Qty: {item.quantity}</p>
                        <p className="text-xs font-bold">₹{(item.product?.base_price || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-dashed">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span>3-5 Business Days</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-4 border-t">
                    <span className="uppercase tracking-widest">Total to Pay</span>
                    <span className="text-xl">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-none uppercase tracking-widest font-bold text-base mt-4 shadow-xl">
                  Place Order
                </Button>

                <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                  By placing your order, you agree to Atlas's <span className="underline">Terms of Service</span> and{" "}
                  <span className="underline">Privacy Policy</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
