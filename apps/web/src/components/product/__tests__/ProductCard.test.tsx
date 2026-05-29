import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductCard } from '../ProductCard'
import { makeProduct } from '@/test/factories'
import { useCartStore } from '@/store/cartStore'

// Reset cart before each test
beforeEach(() => {
  useCartStore.setState({ items: [] })
})

function renderCard(product = makeProduct()) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders product name', () => {
    renderCard()
    expect(screen.getByText('Nordic Wall Hanging')).toBeInTheDocument()
  })

  it('renders product price', () => {
    renderCard()
    expect(screen.getByText('£35.00')).toBeInTheDocument()
  })

  it('links to product detail page', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /View Nordic Wall Hanging/i })
    expect(link).toHaveAttribute('href', '/shop/nordic-wall-hanging')
  })

  it('shows sold out badge when isSoldOut', () => {
    renderCard(makeProduct({ isSoldOut: true }))
    expect(screen.getByText('Sold Out')).toBeInTheDocument()
  })

  it('shows discount badge when discountPercent set', () => {
    renderCard(makeProduct({ discountPercent: 20 }))
    expect(screen.getByText('-20%')).toBeInTheDocument()
  })

  it('shows compare at price when set', () => {
    renderCard(makeProduct({ price: 2800, compareAtPrice: 3500 }))
    expect(screen.getByText('£35.00')).toBeInTheDocument() // strikethrough
  })

  it('shows product image when available', () => {
    renderCard()
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('shows no image placeholder when no images', () => {
    renderCard(makeProduct({ images: [] }))
    expect(screen.getByText('No image')).toBeInTheDocument()
  })

  it('adds item to cart when quick-add button clicked', () => {
    renderCard()
    const addBtn = screen.getByLabelText(/Add Nordic Wall Hanging to cart/i)
    fireEvent.click(addBtn)
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('does not show quick-add button when sold out', () => {
    renderCard(makeProduct({ isSoldOut: true }))
    expect(screen.queryByLabelText(/Add .* to cart/i)).not.toBeInTheDocument()
  })
})
