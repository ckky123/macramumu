import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShoppingBag, ArrowLeft, Minus, Plus, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/constants'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: !!slug,
  })

  const handleAddToCart = () => {
    if (!product || product.isSoldOut) return
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl bg-cream-200 animate-pulse" aria-hidden="true" />
          <div className="flex flex-col gap-4">
            {[80, 40, 60, 100, 40].map((w, i) => (
              <div key={i} className={`h-5 bg-cream-200 rounded animate-pulse w-${w}`} aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-bark-600 mb-3">Product not found</h1>
        <Button as={Link} to="/shop" variant="outline" leftIcon={<ArrowLeft size={16} />}>
          Back to Shop
        </Button>
      </div>
    )
  }

  const primaryImage = product.images[selectedImage] ?? product.images[0]

  return (
    <>
      <Helmet>
        <title>{product.name} — Macramumu</title>
        <meta name="description" content={product.shortDescription} />
        <meta property="og:title" content={`${product.name} — Macramumu`} />
        <meta property="og:description" content={product.shortDescription} />
        {primaryImage && <meta property="og:image" content={primaryImage.url} />}
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-sans text-xs text-sand-400">
            <li><Link to="/" className="hover:text-bark-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/shop" className="hover:text-bark-500 transition-colors">Shop</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-bark-500" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sand-400 font-sans text-sm">No image</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-bark-400' : 'border-transparent hover:border-sand-300'
                    }`}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={selectedImage === i}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-sand-400 mb-2">
                {product.category.replace(/-/g, ' ')}
              </p>
              <h1 className="font-serif text-3xl text-bark-600 leading-snug">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className={`font-sans text-2xl font-medium ${product.isSoldOut ? 'text-sand-400' : 'text-bark-600'}`}>
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-sans text-base text-sand-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {product.discountPercent && (
                <Badge variant="sale">-{product.discountPercent}%</Badge>
              )}
              {product.isSoldOut && <Badge variant="soldout">Sold Out</Badge>}
            </div>

            <p className="font-sans text-sm text-bark-500 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Quantity + Add to cart */}
            {!product.isSoldOut && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3" role="group" aria-label="Quantity">
                  <span className="font-sans text-sm text-sand-400">Qty</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg border border-sand-200 flex items-center justify-center text-bark-500 hover:bg-sand-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-sans text-sm text-bark-600 w-8 text-center" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-lg border border-sand-200 flex items-center justify-center text-bark-500 hover:bg-sand-100 transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-sans text-xs text-sand-400">
                    {product.stock} available
                  </span>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  fullWidth
                  leftIcon={added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  variant={added ? 'secondary' : 'primary'}
                >
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </Button>
              </div>
            )}

            {/* Description */}
            <div className="pt-4 border-t border-sand-100">
              <h2 className="font-serif text-lg text-bark-600 mb-3">About this piece</h2>
              <p className="font-sans text-sm text-bark-500 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-cream-100 rounded-full font-sans text-xs text-sand-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Care note */}
            <div className="p-4 bg-cream-100 rounded-2xl">
              <p className="font-sans text-xs text-sand-400 leading-relaxed">
                🌿 <strong className="text-bark-500">Care:</strong> Spot clean with damp cloth. Keep away from direct sunlight. Each piece is handmade — slight variations are part of its charm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
