import { Navbar } from "@/components/navbar"
import { getReplenishmentSchedules } from "@/lib/api/replenishment"
import { DEMO_USER_ID } from "@/lib/constants"
import { RefreshCcw, Calendar, ShoppingCart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function ReplenishPage() {
  const userId = DEMO_USER_ID
  const schedules = await getReplenishmentSchedules(userId)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Replenish</h1>
              <p className="text-muted-foreground mt-2 font-medium uppercase tracking-widest text-xs">
                Managed recurring essentials
              </p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {schedules.length} active schedules
            </p>
          </div>

          {schedules.length > 0 ? (
            <div className="grid gap-8">
              {schedules.map((schedule) => {
                const product = schedule.product as any
                const imageUrl = product?.images?.[0] || "/placeholder.svg?height=400&width=300"

                return (
                  <div
                    key={schedule.id}
                    className="bg-card border p-8 flex flex-col md:flex-row items-center gap-12 group transition-all hover:border-primary"
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className="h-32 w-24 bg-muted shrink-0 relative overflow-hidden">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={product?.name || "Product"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight">{product?.name}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                            Frequency: Every {schedule.frequency_days} days
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-8">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              <Calendar className="h-3 w-3" /> Last Order
                            </div>
                            <p className="text-xs font-bold">
                              {schedule.last_purchase_date
                                ? new Date(schedule.last_purchase_date).toLocaleDateString()
                                : "Never"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              <ArrowRight className="h-3 w-3" /> Next Due
                            </div>
                            <p className="text-xs font-bold text-secondary">
                              {schedule.next_due_date
                                ? new Date(schedule.next_due_date).toLocaleDateString()
                                : "Pending"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-48">
                      <Button className="rounded-none uppercase tracking-widest font-bold text-[10px] h-12 w-full">
                        Quick Reorder <ShoppingCart className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-none uppercase tracking-widest font-bold text-[10px] h-10 w-full bg-transparent border-border"
                      >
                        Edit Schedule
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center gap-8 text-center bg-muted/20 border border-dashed">
              <RefreshCcw className="h-12 w-12 text-muted-foreground opacity-20" />
              <div className="space-y-2">
                <p className="text-xl font-bold tracking-tight">No Replenishment Schedules</p>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Automate your recurring purchases. Add a replenishment schedule to your favorite products for
                  effortless restocking.
                </p>
              </div>
              <Link href="/shop">
                <Button className="rounded-none px-12 h-14 uppercase tracking-widest font-bold text-xs">
                  Explore Collections
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
