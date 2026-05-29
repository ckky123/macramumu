import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, DeliveryOption } from '@/types'
import { DELIVERY_RATES, FREE_DELIVERY_THRESHOLD } from '@/lib/constants'

interface CartState {
  items: CartItem[]
  deliveryOption: DeliveryOption
  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setDeliveryOption: (option: DeliveryOption) => void
  // Computed
  getSubtotal: () => number
  getDeliveryFee: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryOption: 'standard',

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            const newQty = Math.min(
              existing.quantity + quantity,
              product.stock
            )
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: newQty }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(quantity, product.stock) },
            ],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      setDeliveryOption: (option) => set({ deliveryOption: option }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal()
        if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0
        const rate = DELIVERY_RATES.find((r) => r.id === get().deliveryOption)
        return rate?.price ?? 350
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee()
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'macramumu-cart',
      version: 1,
    }
  )
)
