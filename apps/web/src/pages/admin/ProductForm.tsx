import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X } from 'lucide-react'
import { productService } from '@/services/productService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import type { Product } from '@/types'

const productSchema = z.object({
  name:             z.string().min(2, 'Name is required'),
  shortDescription: z.string().min(10, 'Short description required (min 10 chars)'),
  description:      z.string().min(20, 'Description required (min 20 chars)'),
  price:            z.coerce.number().min(1, 'Price must be at least £0.01').int('Price must be in pence'),
  compareAtPrice:   z.coerce.number().optional(),
  category:         z.string().min(1, 'Category is required'),
  tags:             z.string().optional(),
  stock:            z.coerce.number().min(0, 'Stock cannot be negative').int('Stock must be a whole number'),
  discountPercent:  z.coerce.number().min(0).max(100).optional(),
  weight:           z.coerce.number().min(0).optional(),
  isActive:         z.boolean(),
  isFeatured:       z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name:             product.name,
          shortDescription: product.shortDescription,
          description:      product.description,
          price:            product.price,
          compareAtPrice:   product.compareAtPrice,
          category:         product.category,
          tags:             product.tags.join(', '),
          stock:            product.stock,
          discountPercent:  product.discountPercent,
          weight:           product.weight,
          isActive:         product.isActive,
          isFeatured:       product.isFeatured,
        }
      : {
          isActive:  true,
          isFeatured: false,
          stock:     1,
        },
  })

  const onSubmit = async (data: ProductFormData) => {
    setServerError(null)
    const payload = {
      name:             data.name,
      shortDescription: data.shortDescription,
      description:      data.description,
      price:            data.price,
      compareAtPrice:   data.compareAtPrice,
      category:         data.category as Product['category'],
      tags:             data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      stock:            data.stock,
      discountPercent:  data.discountPercent,
      weight:           data.weight,
      isActive:         data.isActive,
      isFeatured:       data.isFeatured,
    }

    try {
      if (product) {
        const result = await productService.updateProduct(product.id, payload)
        if (result.error) throw new Error(result.error)
      } else {
        const result = await productService.createProduct(payload)
        if (result.error) throw new Error(result.error)
      }
      onSuccess()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save product')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product?.id) return
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const isPrimary = product.images.length === 0
    const result = await productService.uploadProductImage(product.id, file, isPrimary)
    setUploadingImage(false)

    if (result.error) {
      setServerError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-sans" role="alert">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="sm:col-span-2">
          <Input
            label="Product name"
            required
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Short description"
            required
            hint="Shown on product cards (1–2 sentences)"
            error={errors.shortDescription?.message}
            {...register('shortDescription')}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-bark-500 font-sans mb-1.5">
            Full description <span className="text-blush-500">*</span>
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-2.5 text-sm text-bark-600 font-sans placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-bark-300 resize-none"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.description.message}</p>
          )}
        </div>

        <Input
          label="Price (pence)"
          type="number"
          required
          hint="e.g. 1250 = £12.50"
          error={errors.price?.message}
          {...register('price')}
        />

        <Input
          label="Compare at price (pence)"
          type="number"
          hint="Original price before discount"
          error={errors.compareAtPrice?.message}
          {...register('compareAtPrice')}
        />

        <div>
          <label className="block text-sm font-medium text-bark-500 font-sans mb-1.5">
            Category <span className="text-blush-500">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-sand-300 bg-cream-50 px-4 py-2.5 text-sm text-bark-600 font-sans focus:outline-none focus:ring-2 focus:ring-bark-300"
            {...register('category')}
          >
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 font-sans mt-1" role="alert">{errors.category.message}</p>
          )}
        </div>

        <Input
          label="Stock quantity"
          type="number"
          required
          error={errors.stock?.message}
          {...register('stock')}
        />

        <Input
          label="Discount %"
          type="number"
          hint="0–100, leave blank for no discount"
          error={errors.discountPercent?.message}
          {...register('discountPercent')}
        />

        <Input
          label="Weight (grams)"
          type="number"
          hint="For postage calculation"
          error={errors.weight?.message}
          {...register('weight')}
        />

        <div className="sm:col-span-2">
          <Input
            label="Tags"
            hint="Comma separated: handmade, nordic, gift"
            error={errors.tags?.message}
            {...register('tags')}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 accent-bark-400 rounded"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="font-sans text-sm text-bark-600">
            Active (visible in shop)
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            className="w-4 h-4 accent-bark-400 rounded"
            {...register('isFeatured')}
          />
          <label htmlFor="isFeatured" className="font-sans text-sm text-bark-600">
            Featured (shown on homepage)
          </label>
        </div>

        {/* Image upload — only for existing products */}
        {product && (
          <div className="sm:col-span-2">
            <p className="font-sans text-sm font-medium text-bark-500 mb-2">Product Images</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.images.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-16 h-16 object-cover rounded-xl border border-sand-200"
                  />
                  {img.isPrimary && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-bark-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px]">★</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-sand-300 text-sand-400 hover:border-bark-300 hover:text-bark-500 cursor-pointer transition-colors w-fit">
              <Upload size={16} />
              <span className="font-sans text-sm">
                {uploadingImage ? 'Uploading...' : 'Upload image'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                aria-label="Upload product image"
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-sand-100">
        <Button type="button" variant="outline" onClick={onCancel} leftIcon={<X size={14} />}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} fullWidth>
          {product ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
