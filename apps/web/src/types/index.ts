// ─── Product ────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'wall-hangings'
  | 'hair-clips'
  | 'jewellery-dishes'
  | 'keyrings'
  | 'keychains'
  | 'bookmarks'
  | 'coasters'
  | 'magnets'
  | 'stationery'
  | 'lanyards'
  | 'christmas-decorations'
  | 'accessories'
  | 'homeware'

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number           // in pence (GBP)
  compareAtPrice?: number // original price before discount, in pence
  category: ProductCategory
  tags: string[]
  images: ProductImage[]
  stock: number
  isSoldOut: boolean
  isActive: boolean
  isFeatured: boolean
  discountPercent?: number
  weight?: number         // grams, for postage calculation
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  name: string
  description: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  category: ProductCategory
  tags: string[]
  stock: number
  isActive: boolean
  isFeatured: boolean
  discountPercent?: number
  weight?: number
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number      // pence
  deliveryFee: number   // pence
  total: number         // pence
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'payment_processing'
  | 'paid'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type DeliveryOption = 'standard' | 'tracked'

export interface DeliveryAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  county?: string
  postcode: string
  country: 'GB'
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  unitPrice: number   // pence at time of purchase
  totalPrice: number  // pence
}

export interface Order {
  id: string
  userId?: string
  guestEmail?: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryOption: DeliveryOption
  deliveryAddress: DeliveryAddress
  status: OrderStatus
  stripePaymentIntentId?: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── User / Auth ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  isAdmin: boolean
  createdAt: string
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
}

export interface ChatbotFAQ {
  keywords: string[]
  question: string
  answer: string
}

// ─── Delivery ────────────────────────────────────────────────────────────────

export interface DeliveryRate {
  id: DeliveryOption
  label: string
  description: string
  price: number       // pence
  estimatedDays: string
}

// ─── API responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
