/**
 * Test data factories — create consistent mock objects for tests
 */
import type { Product, CartItem, Order, UserProfile } from '@/types'

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id:               'prod-1',
    name:             'Nordic Wall Hanging',
    slug:             'nordic-wall-hanging',
    description:      'A beautiful handmade macramé wall hanging with Nordic-inspired design.',
    shortDescription: 'Handmade Nordic wall hanging.',
    price:            3500,
    category:         'wall-hangings',
    tags:             ['handmade', 'nordic', 'wall-art'],
    images:           [
      { id: 'img-1', url: 'https://example.com/img.jpg', alt: 'Wall hanging', isPrimary: true },
    ],
    stock:            5,
    isSoldOut:        false,
    isActive:         true,
    isFeatured:       true,
    createdAt:        '2024-01-01T00:00:00Z',
    updatedAt:        '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    product:  makeProduct(),
    quantity: 1,
    ...overrides,
  }
}

export function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id:              'order-1',
    items:           [
      {
        productId:    'prod-1',
        productName:  'Nordic Wall Hanging',
        productImage: 'https://example.com/img.jpg',
        quantity:     1,
        unitPrice:    3500,
        totalPrice:   3500,
      },
    ],
    subtotal:        3500,
    deliveryFee:     350,
    total:           3850,
    deliveryOption:  'standard',
    deliveryAddress: {
      fullName: 'Jane Smith',
      line1:    '123 Test Street',
      city:     'London',
      postcode: 'SW1A 1AA',
      country:  'GB',
    },
    status:    'pending',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeUserProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id:        'user-1',
    email:     'test@example.com',
    fullName:  'Test User',
    isAdmin:   false,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}
