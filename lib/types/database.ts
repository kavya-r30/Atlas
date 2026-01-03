export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  location: any
  preferences: any
  created_at: string
  updated_at: string
}

export interface Seller {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  rating: number
  total_reviews: number
  return_policy: string | null
  return_days: number
  return_shipping_paid: boolean
  delivery_days: number
  verified: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  image_url: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category_id: string
  base_price: number
  images: string[]
  attributes: any
  tags: string[]
  is_digital: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
  category?: Category
  sellers?: ProductSeller[]
  avg_rating?: number
  review_count?: number
}

export interface ProductSeller {
  id: string
  product_id: string
  seller_id: string
  price: number
  stock_quantity: number
  delivery_days: number | null
  is_active: boolean
  created_at: string
  seller?: Seller
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  seller_id: string
  quantity: number
  selected_attributes: any
  created_at: string
  product?: Product
  seller?: Seller
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: string
  subtotal: number
  tax: number
  shipping_cost: number
  total: number
  shipping_address: any
  billing_address: any
  payment_method: string | null
  payment_status: string
  estimated_delivery: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  product_name: string
  product_image: string | null
  quantity: number
  price: number
  attributes: any
  created_at: string
}

export interface OrderTracking {
  id: string
  order_id: string
  status: string
  location: string | null
  description: string | null
  metadata: any
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  seller_id: string | null
  order_id: string | null
  rating: number
  title: string | null
  content: string | null
  images: string[] | null
  verified_purchase: boolean
  helpful_count: number
  detailed_ratings: any
  created_at: string
  user?: User
}

export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Outfit {
  id: string
  user_id: string
  name: string
  product_ids: string[]
  thumbnail_url: string | null
  created_at: string
}

export interface ReplenishmentSchedule {
  id: string
  user_id: string
  product_id: string
  frequency_days: number
  last_purchase_date: string | null
  next_due_date: string | null
  auto_order: boolean
  created_at: string
  product?: Product
}

export interface Address {
  id: string
  user_id: string
  type: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
  created_at: string
}
