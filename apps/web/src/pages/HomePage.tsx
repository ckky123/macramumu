import { Link } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { ArrowRight, Leaf, Heart, Package } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { APP_CONFIG } from '@/lib/constants'

const BRAND_VALUES = [
  {
    icon: <Leaf size={22} />,
    title: 'Natural Materials',
    description: '100% natural cotton cord, sustainably sourced wooden accents.',
  },
  {
    icon: <Heart size={22} />,
    title: 'Handcrafted with Love',
    description: 'Every piece is made by hand in our London studio — no two are identical.',
  },
  {
    icon: <Package size={22} />,
    title: 'Beautifully Packaged',
    description: 'Gift-ready packaging with every order. Perfect for yourself or someone special.',
  },
]

export function HomePage() {
  const { data: featuredData } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getProducts({ featured: true, pageSize: 4 }),
  })

  return (
    <>
      <Helmet>
        <title>Macramumu — Handmade Macramé Homeware & Accessories | London</title>
        <meta
          name="description"
          content="Macramumu creates unique Nordic-style handmade macramé homeware and accessories in London. Shop wall hangings, hair clips, jewellery dishes, keyrings and more."
        />
      </Helmet>

      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-cream-100"
        aria-label="Hero section"
      >
        {/* Decorative background texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #E2C49A 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #F5D0C8 0%, transparent 40%),
                              radial-gradient(circle at 60% 80%, #C8D4C4 0%, transparent 40%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-sand-400 mb-6 animate-fade-in">
            Handcrafted in London
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-bark-600 leading-tight mb-6 animate-slide-up">
            Macramé made with
            <br />
            <em className="text-blush-400 not-italic">warmth & intention</em>
          </h1>
          <p className="font-sans text-base sm:text-lg text-sand-400 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in">
            Nordic-inspired homeware and accessories, woven by hand. Each piece
            brings a little calm, a little nature, and a lot of love into your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              as={Link}
              to="/shop"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              Shop the Collection
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="outline"
              size="lg"
            >
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Brand values */}
      <section className="py-16 bg-white" aria-label="Our values">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BRAND_VALUES.map(({ icon, title, description }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 p-6">
                <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center text-bark-400">
                  {icon}
                </div>
                <h3 className="font-serif text-bark-600 text-lg">{title}</h3>
                <p className="font-sans text-sm text-sand-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 bg-cream-50" aria-label="Featured products">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-sand-400 mb-2">
                Handpicked for you
              </p>
              <h2 className="font-serif text-3xl text-bark-600">
                Customer Favourites
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1.5 font-sans text-sm text-bark-400 hover:text-bark-600 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {featuredData?.data && featuredData.data.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {featuredData.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Placeholder skeletons */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-cream-200 animate-pulse"
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button as={Link} to="/shop" variant="outline">
              View all products
            </Button>
          </div>
        </div>
      </section>

      {/* Brand story teaser */}
      <section className="py-16 bg-bark-600 text-cream-50" aria-label="About Macramumu">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-sans text-xs uppercase tracking-widest text-cream-300 mb-4">
            Our story
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-cream-50 mb-6 leading-snug">
            A London couple, a love of fibre art,
            <br />
            and a Nordic soul
          </h2>
          <p className="font-sans text-base text-cream-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {APP_CONFIG.description}. We started Macramumu because we believe
            your home should feel like a sanctuary — warm, natural, and full of
            things made with intention.
          </p>
          <Button
            as={Link}
            to="/about"
            variant="outline"
            className="border-cream-300 text-cream-200 hover:bg-bark-500 hover:border-cream-200"
          >
            Read our story
          </Button>
        </div>
      </section>

      {/* Instagram teaser */}
      <section className="py-12 bg-cream-100" aria-label="Follow us on Instagram">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-sans text-sm text-sand-400 mb-2">
            Follow along on Instagram
          </p>
          <a
            href={APP_CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-2xl text-bark-500 hover:text-bark-600 transition-colors"
          >
            @macramumu
          </a>
        </div>
      </section>
    </>
  )
}
