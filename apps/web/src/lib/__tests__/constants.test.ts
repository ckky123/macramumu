import { describe, it, expect } from 'vitest'
import { formatPrice, DELIVERY_RATES, FREE_DELIVERY_THRESHOLD, PRODUCT_CATEGORIES, CHATBOT_FAQS } from '../constants'

describe('formatPrice', () => {
  it('formats pence to GBP string', () => {
    expect(formatPrice(1000)).toBe('£10.00')
    expect(formatPrice(350)).toBe('£3.50')
    expect(formatPrice(0)).toBe('£0.00')
    expect(formatPrice(9999)).toBe('£99.99')
  })

  it('handles large amounts', () => {
    expect(formatPrice(100000)).toBe('£1,000.00')
  })
})

describe('DELIVERY_RATES', () => {
  it('has standard and tracked options', () => {
    expect(DELIVERY_RATES).toHaveLength(2)
    expect(DELIVERY_RATES.find((r) => r.id === 'standard')).toBeDefined()
    expect(DELIVERY_RATES.find((r) => r.id === 'tracked')).toBeDefined()
  })

  it('standard is cheaper than tracked', () => {
    const standard = DELIVERY_RATES.find((r) => r.id === 'standard')!
    const tracked  = DELIVERY_RATES.find((r) => r.id === 'tracked')!
    expect(standard.price).toBeLessThan(tracked.price)
  })

  it('all rates have required fields', () => {
    DELIVERY_RATES.forEach((rate) => {
      expect(rate.id).toBeTruthy()
      expect(rate.label).toBeTruthy()
      expect(rate.price).toBeGreaterThan(0)
      expect(rate.estimatedDays).toBeTruthy()
    })
  })
})

describe('FREE_DELIVERY_THRESHOLD', () => {
  it('is £50 in pence', () => {
    expect(FREE_DELIVERY_THRESHOLD).toBe(5000)
  })
})

describe('PRODUCT_CATEGORIES', () => {
  it('has at least 10 categories', () => {
    expect(PRODUCT_CATEGORIES.length).toBeGreaterThanOrEqual(10)
  })

  it('all categories have value and label', () => {
    PRODUCT_CATEGORIES.forEach((cat) => {
      expect(cat.value).toBeTruthy()
      expect(cat.label).toBeTruthy()
    })
  })
})

describe('CHATBOT_FAQS', () => {
  it('has at least 5 FAQs', () => {
    expect(CHATBOT_FAQS.length).toBeGreaterThanOrEqual(5)
  })

  it('all FAQs have keywords, question, and answer', () => {
    CHATBOT_FAQS.forEach((faq) => {
      expect(faq.keywords.length).toBeGreaterThan(0)
      expect(faq.question).toBeTruthy()
      expect(faq.answer).toBeTruthy()
    })
  })
})
