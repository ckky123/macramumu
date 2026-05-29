import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Package, ShoppingBag, Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services/productService'
import { orderService } from '@/services/orderService'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ProductForm } from './ProductForm'
import { formatPrice } from '@/lib/constants'
import type { Product } from '@/types'

type Tab = 'products' | 'orders'

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('products')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { profile } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => productService.getAllProducts(),
  })

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => orderService.getAllOrders(),
    enabled: tab === 'orders',
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      productService.updateProduct(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleCloseForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  return (
    <>
      <Helmet><title>Dashboard — Macramumu</title></Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-bark-600">Dashboard</h1>
            <p className="font-sans text-sm text-sand-400 mt-1">
              Welcome back, {profile?.fullName ?? 'Admin'}
            </p>
          </div>
          {tab === 'products' && (
            <Button
              onClick={() => setShowProductForm(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Product
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products?.length ?? 0, icon: <Package size={18} /> },
            { label: 'Active', value: products?.filter((p) => p.isActive).length ?? 0, icon: <Eye size={18} /> },
            { label: 'Sold Out', value: products?.filter((p) => p.isSoldOut).length ?? 0, icon: <ShoppingBag size={18} /> },
            { label: 'Orders', value: orders?.length ?? '—', icon: <ShoppingBag size={18} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-sand-100 p-5">
              <div className="flex items-center gap-2 text-sand-400 mb-2">
                {icon}
                <span className="font-sans text-xs uppercase tracking-wide">{label}</span>
              </div>
              <p className="font-serif text-2xl text-bark-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-sand-100 p-1 rounded-xl w-fit" role="tablist">
          {(['products', 'orders'] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg font-sans text-sm font-medium transition-colors capitalize ${
                tab === t
                  ? 'bg-white text-bark-600 shadow-soft'
                  : 'text-sand-400 hover:text-bark-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Products tab */}
        {tab === 'products' && (
          <div role="tabpanel" aria-label="Products">
            {productsLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-cream-200 rounded-xl animate-pulse" aria-hidden="true" />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-sand-100 overflow-hidden">
                <table className="w-full" aria-label="Products table">
                  <thead>
                    <tr className="border-b border-sand-100">
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Product</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400 hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Price</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Stock</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400 hidden md:table-cell">Status</th>
                      <th className="text-right px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => {
                      const image = product.images.find((i) => i.isPrimary) ?? product.images[0]
                      return (
                        <tr key={product.id} className="border-b border-sand-50 hover:bg-cream-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={image?.url}
                                alt={image?.alt ?? product.name}
                                className="w-10 h-10 rounded-lg object-cover bg-cream-100 shrink-0"
                              />
                              <div>
                                <p className="font-sans text-sm text-bark-600 font-medium line-clamp-1">{product.name}</p>
                                {product.isFeatured && (
                                  <span className="inline-flex items-center gap-0.5 text-xs text-sand-400">
                                    <Star size={10} /> Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="font-sans text-xs text-sand-400 capitalize">
                              {product.category.replace(/-/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <span className="font-sans text-sm text-bark-600">{formatPrice(product.price)}</span>
                              {product.discountPercent && (
                                <Badge variant="sale" className="ml-1.5">-{product.discountPercent}%</Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-sans text-sm font-medium ${
                              product.stock === 0 ? 'text-red-400' :
                              product.stock <= 3 ? 'text-amber-500' : 'text-sage-500'
                            }`}>
                              {product.stock === 0 ? 'Sold out' : product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <Badge variant={product.isActive ? 'new' : 'soldout'}>
                              {product.isActive ? 'Active' : 'Hidden'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => toggleActiveMutation.mutate({ id: product.id, isActive: !product.isActive })}
                                className="p-1.5 rounded-lg text-sand-400 hover:text-bark-500 hover:bg-sand-100 transition-colors"
                                aria-label={product.isActive ? 'Hide product' : 'Show product'}
                                title={product.isActive ? 'Hide' : 'Show'}
                              >
                                {product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-1.5 rounded-lg text-sand-400 hover:text-bark-500 hover:bg-sand-100 transition-colors"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                                    deleteMutation.mutate(product.id)
                                  }
                                }}
                                className="p-1.5 rounded-lg text-sand-400 hover:text-red-400 hover:bg-red-50 transition-colors"
                                aria-label={`Delete ${product.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {products?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="font-sans text-sm text-sand-400">No products yet. Add your first one!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div role="tabpanel" aria-label="Orders">
            {ordersLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-cream-200 rounded-xl animate-pulse" aria-hidden="true" />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-sand-100 overflow-hidden">
                <table className="w-full" aria-label="Orders table">
                  <thead>
                    <tr className="border-b border-sand-100">
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Order ID</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400 hidden sm:table-cell">Date</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Total</th>
                      <th className="text-left px-4 py-3 font-sans text-xs uppercase tracking-wide text-sand-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order) => (
                      <tr key={order.id} className="border-b border-sand-50 hover:bg-cream-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-sans text-xs text-sand-400 font-mono">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="font-sans text-sm text-bark-600">
                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-sans text-sm font-medium text-bark-600">
                            {formatPrice(order.total)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={
                            order.status === 'paid' || order.status === 'delivered' ? 'new' :
                            order.status === 'cancelled' || order.status === 'refunded' ? 'soldout' :
                            'default'
                          }>
                            {order.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="font-sans text-sm text-sand-400">No orders yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product form modal */}
      <Modal
        isOpen={showProductForm}
        onClose={handleCloseForm}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={() => {
            handleCloseForm()
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
          }}
          onCancel={handleCloseForm}
        />
      </Modal>
    </>
  )
}
