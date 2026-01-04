const AI_API_BASE = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000"

export interface IntentRequest {
  user_id: string
  query: string
  context?: Record<string, any>
}

export interface IntentResponse {
  response: string
  intent: string
  recommendations?: any[]
}

export interface ReplenishmentItem {
  id: string
  product_id: string
  product_name: string
  next_due_date: string
  frequency_days: number
  image_url: string
  last_refill: string
}

export interface StyleValidation {
  valid: boolean
  messages: string[]
  conflicts?: Array<{ item1: string; item2: string; reason: string }>
}

export async function processIntent(request: IntentRequest): Promise<IntentResponse> {
  const response = await fetch(`${AI_API_BASE}/api/ai/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error("Failed to process intent")
  }

  return response.json()
}

export async function getReplenishment(userId: string): Promise<ReplenishmentItem[]> {
  const response = await fetch(`${AI_API_BASE}/api/ai/replenishment/${userId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch replenishment data")
  }

  const data = await response.json()
  return data.due || []
}

export async function validateStyle(cartItems: string[], userId: string): Promise<StyleValidation> {
  const response = await fetch(`${AI_API_BASE}/api/ai/style-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart_items: cartItems, user_id: userId }),
  })

  if (!response.ok) {
    throw new Error("Failed to validate style")
  }

  return response.json()
}

export async function getSmartBundles(userId: string, preferences?: Record<string, any>) {
  const response = await fetch(`${AI_API_BASE}/api/ai/bundles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, preferences }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch smart bundles")
  }

  return response.json()
}

export async function getOutfitRecommendations(userId: string, occasion?: string) {
  const response = await fetch(`${AI_API_BASE}/api/ai/outfits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, occasion }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch outfit recommendations")
  }

  return response.json()
}
