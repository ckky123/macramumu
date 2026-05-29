import { supabase } from '@/lib/supabase'
import type { Order, CartItem, DeliveryOption, DeliveryAddress, ApiResponse } from '@/types'

export const orderService = {
  async createOrder(params: {
    items: CartItem[]
    subtotal: number
    deliveryFee: number
    total: number
    deliveryOption: DeliveryOption
    deliveryAddress: DeliveryAddress
    userId?: string
    guestEmail?: string
    stripePaymentIntentId?: string
  }): Promise<ApiResponse<Order>> {
    const orderItems = params.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images.find((i) => i.isPrimary)?.url ?? '',
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity,
    }))

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: params.userId ?? null,
        guest_email: params.guestEmail ?? null,
        items: orderItems,
        subtotal: params.subtotal,
        delivery_fee: params.deliveryFee,
        total: params.total,
        delivery_option: params.deliveryOption,
        delivery_address: params.deliveryAddress,
        status: 'pending',
        stripe_payment_intent_id: params.stripePaymentIntentId ?? null,
      })
      .select()
      .single()

    if (error) return { data: null, error: error.message }

    return { data: mapRowToOrder(data as Record<string, unknown>), error: null }
  },

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return mapRowToOrder(data as Record<string, unknown>)
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row) => mapRowToOrder(row as Record<string, unknown>))
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row) => mapRowToOrder(row as Record<string, unknown>))
  },

  async updateOrderStatus(
    id: string,
    status: Order['status'],
    trackingNumber?: string
  ): Promise<ApiResponse<Order>> {
    const updates: Record<string, unknown> = { status }
    if (trackingNumber) updates.tracking_number = trackingNumber

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: mapRowToOrder(data as Record<string, unknown>), error: null }
  },
}

function mapRowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    userId: row.user_id as string | undefined,
    guestEmail: row.guest_email as string | undefined,
    items: row.items as Order['items'],
    subtotal: row.subtotal as number,
    deliveryFee: row.delivery_fee as number,
    total: row.total as number,
    deliveryOption: row.delivery_option as DeliveryOption,
    deliveryAddress: row.delivery_address as DeliveryAddress,
    status: row.status as Order['status'],
    stripePaymentIntentId: row.stripe_payment_intent_id as string | undefined,
    trackingNumber: row.tracking_number as string | undefined,
    notes: row.notes as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
