import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { formatPrice, DELIVERY_RATES, FREE_DELIVERY_THRESHOLD } from '@/lib/constants'

export function CartPage() {
  const { items, deliveryOption, removeItem, updateQuantity, setDeliveryOption, getSubtotal, getDeliveryFee, getTotal } = useCartStore()

  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const total = getTotal()
  const freeDeliveryRemaining = FREE_DELIVERY_THRESHOLD - subtotal

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Your Cart — Macramumu</title></Helmet>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <ShoppingBag size={48} className="mx-auto text-sand-300 mb-6" aria-hidden="true" />
          <h1 className="font-serif text-2xl text-bark-600 mb-3">Your cart is empty</h1>
          <p className="font-sans text-sm text-sand-400 mb-8">
            Looks like you haven't added anything yet. Explore our handmade collection.
          </p>
          <Button as={Link} to="/shop" rightIcon={<ArrowRight size={16} />}>
            Shop the Collection
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Your Cart ({items.length}) — Macramumu</title></Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif text-3xl text-bark-600 mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1">
            {/* Free delivery progress */}
            {freeDeliveryRemaining > 0 && (
              <div className="mb-6 p-4 bg-cream-100 rounded-2xl border border-cream-200">
                <p className="font-sans text-sm text-bark-500 mb-2">
                  Add <strong>{formatPrice(freeDeliveryRemaining)}</strong> more for free standard delivery
                </p>
                <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bark-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={subtotal}
                    aria-valuemax={FREE_DELIVERY_THRESHOLD}
                    aria-label="Progress to free delivery"
                  />
                </div>
              </div>
            )}
            {freeDeliveryRemaining <= 0 && (
              <div className="mb-6 p-4 bg-sage-100 rounded-2xl border border-sage-200">
                <p className="font-sans text-sm text-sage-500 font-medium">
                  🎉 You qualify for free standard delivery!
                </p>
              </div>
            )}

            <ul className="flex flex-col gap-4" role="list" aria-label="Cart items">
              {items.map(({ product, quantity }) => {
                const image = product.images.find((i) => i.isPrimary) ?? product.images[0]
                return (
                  <li
                    key={product.id}
                    className="flex gap-4 p-4 bg-white rounded-2xl border border-sand-100"
                  >
                    {/* Image */}
                    <Link to={`/shop/${product.slug}`} className="shrink-0">
                      <img
                        src={image?.url}
                        alt={image?.alt ?? product.name}
                        className="w-20 h-20 object-cover rounded-xl bg-cream-100"
                        loading="lazy"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/shop/${product.slug}`}>
                        <h3 className="font-serif text-bark-600 text-sm leading-snug hover:text-bark-500 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-sans text-xs text-sand-400 mt-0.5">
                        {formatPrice(product.price)} each
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${product.name}`}>
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-sand-200 flex items-center justify-center text-bark-500 hover:bg-sand-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-sans text-sm text-bark-600 w-6 text-center" aria-live="polite">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="w-7 h-7 rounded-lg border border-sand-200 flex items-center justify-center text-bark-500 hover:bg-sand-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-sans font-medium text-sm text-bark-600">
                            {formatPrice(product.price * quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="p-1.5 rounded-lg text-sand-400 hover:text-red-400 hover:bg-red-50 transition-colors"
                            aria-label={`Remove ${product.name} from cart`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Order summary */}
          <aside className="lg:w-80 shrink-0" aria-label="Order summary">
            <div className="bg-white rounded-2xl border border-sand-100 p-6 sticky top-24">
              <h2 className="font-serif text-lg text-bark-600 mb-5">Order Summary</h2>

              {/* Delivery options */}
              <fieldset className="mb-5">
                <legend className="font-sans text-xs uppercase tracking-widest text-sand-400 mb-3">
                  Delivery
                </legend>
                <div className="flex flex-col gap-2">
                  {DELIVERY_RATES.map((rate) => (
                    <label
                      key={rate.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        deliveryOption === rate.id
                          ? 'border-bark-300 bg-cream-50'
                          : 'border-sand-200 hover:border-sand-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={rate.id}
                        checked={deliveryOption === rate.id}
                        onChange={() => setDeliveryOption(rate.id)}
                        className="mt-0.5 accent-bark-400"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-sans text-sm text-bark-600">{rate.label}</span>
                          <span className="font-sans text-sm text-bark-500">
                            {subtotal >= FREE_DELIVERY_THRESHOLD && rate.id === 'standard'
                              ? 'Free'
                              : formatPrice(rate.price)}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-sand-400 mt-0.5">
                          {rate.description} · {rate.estimatedDays}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Totals */}
              <div className="flex flex-col gap-2 py-4 border-t border-sand-100">
                <div className="flex justify-between font-sans text-sm text-sand-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-sand-400">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-sans font-medium text-base text-bark-600 pt-2 border-t border-sand-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                as={Link}
                to="/checkout"
                fullWidth
                size="lg"
                rightIcon={<ArrowRight size={16} />}
                className="mt-4"
              >
                Proceed to Checkout
              </Button>

              <p className="font-sans text-xs text-sand-400 text-center mt-3">
                Secure checkout powered by Stripe
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
