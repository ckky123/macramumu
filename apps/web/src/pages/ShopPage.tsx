import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import type { ProductCategory } from '@/types'

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get('category') as ProductCategory | null
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, page, search }],
    queryFn: () =>
      productService.getProducts({
        category: category ?? undefined,
        page,
        pageSize: 12,
        search: search || undefined,
      }),
  })

  const setCategory = (cat: ProductCategory | null) => {
    const params = new URLSearchParams(searchParams)
    if (cat) {
      params.set('category', cat)
    } else {
      params.delete('category')
    }
    params.delete('page')
    setSearchParams(params)
  }

  const categoryLabel = category
    ? PRODUCT_CATEGORIES.find((c) => c.value === category)?.label
    : 'All Products'

  return (
    <>
      <Helmet>
        <title>{categoryLabel} — Macramumu</title>
        <meta
          name="description"
          content={`Shop ${categoryLabel?.toLowerCase()} at Macramumu. Handmade macramé pieces crafted in London.`}
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-bark-600 mb-2">
            {categoryLabel}
          </h1>
          {data && (
            <p className="font-sans text-sm text-sand-400">
              {data.total} {data.total === 1 ? 'piece' : 'pieces'}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-52 shrink-0" aria-label="Product filters">
            <FilterPanel
              activeCategory={category}
              onCategoryChange={setCategory}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Search + mobile filter toggle */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm font-sans rounded-xl border border-sand-300 bg-white text-bark-600 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-bark-300"
                  aria-label="Search products"
                />
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowFilters((v) => !v)}
                className="lg:hidden"
                aria-expanded={showFilters}
                aria-controls="mobile-filters"
                leftIcon={<SlidersHorizontal size={16} />}
              >
                Filters
              </Button>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div
                id="mobile-filters"
                className="lg:hidden mb-6 p-4 bg-white rounded-2xl border border-sand-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-sm font-medium text-bark-500">Filters</span>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-sand-400 hover:text-bark-500"
                    aria-label="Close filters"
                  >
                    <X size={16} />
                  </button>
                </div>
                <FilterPanel
                  activeCategory={category}
                  onCategoryChange={(cat) => {
                    setCategory(cat)
                    setShowFilters(false)
                  }}
                />
              </div>
            )}

            {/* Product grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6" aria-busy="true" aria-label="Loading products">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-cream-200 animate-pulse" aria-hidden="true" />
                ))}
              </div>
            ) : data?.data.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-xl text-bark-400 mb-3">No products found</p>
                <p className="font-sans text-sm text-sand-400 mb-6">
                  Try a different category or search term.
                </p>
                <Button variant="outline" onClick={() => { setCategory(null); setSearch('') }}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {data?.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data && data.total > 12 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams)
                        params.set('page', String(page - 1))
                        setSearchParams(params)
                      }}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 font-sans text-sm text-sand-400">
                      Page {page} of {Math.ceil(data.total / 12)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!data.hasMore}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams)
                        params.set('page', String(page + 1))
                        setSearchParams(params)
                      }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function FilterPanel({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: ProductCategory | null
  onCategoryChange: (cat: ProductCategory | null) => void
}) {
  return (
    <div>
      <h2 className="font-sans text-xs uppercase tracking-widest text-sand-400 mb-4">
        Category
      </h2>
      <ul className="flex flex-col gap-1" role="list">
        <li>
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg font-sans text-sm transition-colors ${
              !activeCategory
                ? 'bg-bark-100 text-bark-600 font-medium'
                : 'text-sand-400 hover:text-bark-500 hover:bg-sand-50'
            }`}
            aria-current={!activeCategory ? 'true' : undefined}
          >
            All Products
          </button>
        </li>
        {PRODUCT_CATEGORIES.map(({ value, label }) => (
          <li key={value}>
            <button
              onClick={() => onCategoryChange(value)}
              className={`w-full text-left px-3 py-2 rounded-lg font-sans text-sm transition-colors ${
                activeCategory === value
                  ? 'bg-bark-100 text-bark-600 font-medium'
                  : 'text-sand-400 hover:text-bark-500 hover:bg-sand-50'
              }`}
              aria-current={activeCategory === value ? 'true' : undefined}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
