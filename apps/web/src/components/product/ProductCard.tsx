import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { clsx } from 'clsx'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.isSoldOut) {
      addItem(product, 1)
    }
  }

  return (
    <Link
      to={`/shop/${product.slug}`}
      className={clsx(
        'group relative flex flex-col bg-white rounded-2xl overflow-hidden',
        'shadow-soft hover:shadow-product transition-all duration-300',
        'hover:-translate-y-1',
        className
      )}
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream-200">
            <span className="text-sand-400 text-sm font-sans">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isSoldOut && <Badge variant="soldout">Sold Out</Badge>}
          {!product.isSoldOut && product.discountPercent && (
            <Badge variant="sale">-{product.discountPercent}%</Badge>
          )}
          {!product.isSoldOut && product.isFeatured && !product.discountPercent && (
            <Badge variant="featured">Favourite</Badge>
          )}
        </div>

        {/* Quick add button */}
        {!product.isSoldOut && (
          <button
            onClick={handleAddToCart}
            className={clsx(
              'absolute bottom-3 right-3',
              'bg-cream-50/90 backdrop-blur-sm text-bark-500',
              'p-2.5 rounded-xl shadow-soft',
              'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0',
              'transition-all duration-200',
              'hover:bg-bark-400 hover:text-cream-50',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-bark-400'
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-xs text-sand-400 font-sans uppercase tracking-wide">
          {product.category.replace(/-/g, ' ')}
        </p>
        <h3 className="font-serif text-bark-600 text-sm leading-snug line-clamp-2 group-hover:text-bark-500 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={clsx(
            'font-sans font-medium text-sm',
            product.isSoldOut ? 'text-sand-400' : 'text-bark-500'
          )}>
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="font-sans text-xs text-sand-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
