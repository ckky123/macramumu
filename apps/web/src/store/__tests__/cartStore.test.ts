import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../cartStore'
import { makeProduct } from '@/test/factories'

// Reset store between tests
beforeEach(() => {
  useCartStore.setState({ items: [], deliveryOption: 'standard' })
})

describe('cartStore — addItem', () => {
  it('adds a new item to the cart', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product, 1)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('increments quantity for existing item', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().addItem(product, 2)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('does not exceed stock limit', () => {
    const product = makeProduct({ stock: 3 })
    useCartStore.getState().addItem(product, 10)
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('defaults quantity to 1', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })
})

describe('cartStore — removeItem', () => {
  it('removes an item by product id', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product)
    useCartStore.getState().removeItem(product.id)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('does nothing if item not in cart', () => {
    useCartStore.getState().removeItem('nonexistent')
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})

describe('cartStore — updateQuantity', () => {
  it('updates quantity', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().updateQuantity(product.id, 3)
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('removes item when quantity set to 0', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().updateQuantity(product.id, 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('removes item when quantity set to negative', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().updateQuantity(product.id, -1)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('caps quantity at stock', () => {
    const product = makeProduct({ stock: 2 })
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().updateQuantity(product.id, 10)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })
})

describe('cartStore — clearCart', () => {
  it('removes all items', () => {
    const p1 = makeProduct({ id: 'p1' })
    const p2 = makeProduct({ id: 'p2' })
    useCartStore.getState().addItem(p1)
    useCartStore.getState().addItem(p2)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})

describe('cartStore — computed values', () => {
  it('calculates subtotal correctly', () => {
    const product = makeProduct({ price: 1000 })
    useCartStore.getState().addItem(product, 2)
    expect(useCartStore.getState().getSubtotal()).toBe(2000)
  })

  it('calculates delivery fee for standard', () => {
    const product = makeProduct({ price: 1000 })
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().setDeliveryOption('standard')
    expect(useCartStore.getState().getDeliveryFee()).toBe(350)
  })

  it('calculates delivery fee for tracked', () => {
    const product = makeProduct({ price: 1000 })
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().setDeliveryOption('tracked')
    expect(useCartStore.getState().getDeliveryFee()).toBe(550)
  })

  it('gives free delivery when subtotal >= £50', () => {
    const product = makeProduct({ price: 5000 })
    useCartStore.getState().addItem(product, 1)
    expect(useCartStore.getState().getDeliveryFee()).toBe(0)
  })

  it('calculates total as subtotal + delivery', () => {
    const product = makeProduct({ price: 1000 })
    useCartStore.getState().addItem(product, 1)
    useCartStore.getState().setDeliveryOption('standard')
    expect(useCartStore.getState().getTotal()).toBe(1350)
  })

  it('counts total items including quantities', () => {
    const p1 = makeProduct({ id: 'p1' })
    const p2 = makeProduct({ id: 'p2' })
    useCartStore.getState().addItem(p1, 2)
    useCartStore.getState().addItem(p2, 3)
    expect(useCartStore.getState().getItemCount()).toBe(5)
  })

  it('returns 0 for empty cart', () => {
    expect(useCartStore.getState().getSubtotal()).toBe(0)
    expect(useCartStore.getState().getTotal()).toBe(350) // delivery still applies
    expect(useCartStore.getState().getItemCount()).toBe(0)
  })
})

describe('cartStore — delivery option', () => {
  it('sets delivery option', () => {
    useCartStore.getState().setDeliveryOption('tracked')
    expect(useCartStore.getState().deliveryOption).toBe('tracked')
  })
})
