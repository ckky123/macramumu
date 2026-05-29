import type { DeliveryRate, ProductCategory, ChatbotFAQ } from '@/types'

// ─── Delivery ────────────────────────────────────────────────────────────────

export const DELIVERY_RATES: DeliveryRate[] = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: 'Royal Mail 2nd Class',
    price: 350,           // £3.50
    estimatedDays: '3–5 working days',
  },
  {
    id: 'tracked',
    label: 'Tracked Delivery',
    description: 'Royal Mail Tracked 48',
    price: 550,           // £5.50
    estimatedDays: '2–3 working days',
  },
]

export const FREE_DELIVERY_THRESHOLD = 5000  // £50.00 in pence

// ─── Product categories ───────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'wall-hangings',        label: 'Wall Hangings' },
  { value: 'hair-clips',           label: 'Hair Clips' },
  { value: 'jewellery-dishes',     label: 'Jewellery Dishes' },
  { value: 'keyrings',             label: 'Key Rings' },
  { value: 'keychains',            label: 'Key Chains' },
  { value: 'bookmarks',            label: 'Bookmarks' },
  { value: 'coasters',             label: 'Coasters' },
  { value: 'magnets',              label: 'Magnets' },
  { value: 'stationery',           label: 'Stationery' },
  { value: 'lanyards',             label: 'Lanyards' },
  { value: 'christmas-decorations',label: 'Christmas Decorations' },
  { value: 'accessories',          label: 'Accessories' },
  { value: 'homeware',             label: 'Homeware' },
]

// ─── Chatbot FAQs ─────────────────────────────────────────────────────────────

export const CHATBOT_FAQS: ChatbotFAQ[] = [
  {
    keywords: ['delivery', 'shipping', 'postage', 'how long', 'arrive', 'dispatch'],
    question: 'How long does delivery take?',
    answer: 'We offer Standard Delivery (3–5 working days, £3.50) and Tracked Delivery (2–3 working days, £5.50). Orders over £50 get free standard delivery. We dispatch from London, usually within 1–2 business days of your order.',
  },
  {
    keywords: ['custom', 'personalised', 'bespoke', 'made to order', 'customise'],
    question: 'Do you do custom orders?',
    answer: 'Yes! We love creating bespoke pieces. Please get in touch via our contact page with your ideas — colours, size, style — and we\'ll get back to you within 2 business days with a quote.',
  },
  {
    keywords: ['material', 'cotton', 'rope', 'cord', 'made of', 'natural'],
    question: 'What materials do you use?',
    answer: 'All our pieces are handcrafted using 100% natural cotton cord and rope. We choose natural, undyed fibres wherever possible to keep that warm, organic feel. Some pieces use sustainably sourced wooden beads or rings.',
  },
  {
    keywords: ['return', 'refund', 'exchange', 'wrong', 'damaged', 'broken'],
    question: 'What is your returns policy?',
    answer: 'We accept returns within 14 days of delivery for unused items in original condition. As handmade pieces, slight variations are part of their charm. If your item arrives damaged, please contact us within 48 hours with a photo and we\'ll sort it right away.',
  },
  {
    keywords: ['care', 'wash', 'clean', 'maintain', 'look after'],
    question: 'How do I care for my macramé piece?',
    answer: 'Spot clean with a damp cloth and mild soap. Avoid soaking or machine washing. Keep away from direct sunlight to preserve the natural colour. Gently reshape while damp if needed. With proper care, your piece will last for years.',
  },
  {
    keywords: ['gift', 'wrap', 'present', 'packaging', 'box'],
    question: 'Do you offer gift wrapping?',
    answer: 'Yes! All our orders come beautifully packaged. We can add a personalised gift message at checkout — just leave a note in the order comments.',
  },
  {
    keywords: ['wholesale', 'bulk', 'trade', 'stockist', 'shop'],
    question: 'Do you offer wholesale?',
    answer: 'We do consider wholesale for the right partners. Please reach out via our contact page with details about your shop and the products you\'re interested in.',
  },
  {
    keywords: ['instagram', 'social', 'follow', 'pinterest', 'facebook'],
    question: 'Where can I follow you?',
    answer: 'Find us on Instagram @macramumu, Pinterest at macramumu, and Facebook at Macramumu. We share new designs, behind-the-scenes making, and inspiration there regularly!',
  },
  {
    keywords: ['contact', 'email', 'message', 'get in touch', 'talk'],
    question: 'How can I contact you?',
    answer: 'You can reach us via the Contact page on our website, or email us directly. We aim to respond within 1–2 business days. We\'re a small team (just the two of us!) so we appreciate your patience.',
  },
  {
    keywords: ['payment', 'pay', 'card', 'paypal', 'secure'],
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) and PayPal. All payments are processed securely through Stripe. We never store your card details.',
  },
]

// ─── App config ───────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: 'Macramumu',
  tagline: 'Handcrafted with love in London',
  description: 'Nordic-style handmade macramé homeware and accessories',
  email: 'hello@macramumu.co.uk',
  instagram: 'https://www.instagram.com/macramumu/',
  pinterest: 'https://uk.pinterest.com/macramumu/',
  facebook: 'https://www.facebook.com/macramumu/',
  currency: 'GBP',
  currencySymbol: '£',
  locale: 'en-GB',
  country: 'GB',
} as const

// ─── Formatting helpers ───────────────────────────────────────────────────────

/** Format pence to £X.XX string */
export function formatPrice(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100)
}
