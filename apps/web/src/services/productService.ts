import { supabase } from '@/lib/supabase'
import type { Product, ProductFormData, ProductCategory, ApiResponse, PaginatedResponse } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapRowToProduct(row: Record<string, unknown>, images: Array<Record<string, unknown>>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    shortDescription: row.short_description as string,
    price: row.price as number,
    compareAtPrice: row.compare_at_price as number | undefined,
    category: row.category as ProductCategory,
    tags: (row.tags as string[]) ?? [],
    stock: row.stock as number,
    isSoldOut: row.is_sold_out as boolean,
    isActive: row.is_active as boolean,
    isFeatured: row.is_featured as boolean,
    discountPercent: row.discount_percent as number | undefined,
    weight: row.weight as number | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    images: images.map((img) => ({
      id: img.id as string,
      url: img.url as string,
      alt: img.alt as string,
      isPrimary: img.is_primary as boolean,
    })),
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const productService = {
  async getProducts(options?: {
    category?: ProductCategory
    featured?: boolean
    page?: number
    pageSize?: number
    search?: string
  }): Promise<PaginatedResponse<Product>> {
    const page = options?.page ?? 1
    const pageSize = options?.pageSize ?? 12
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (options?.category) {
      query = query.eq('category', options.category)
    }
    if (options?.featured) {
      query = query.eq('is_featured', true)
    }
    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`)
    }

    const { data: rows, error, count } = await query
    if (error) throw error

    const products = await Promise.all(
      (rows ?? []).map(async (row) => {
        const { data: images } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', row.id)
          .order('is_primary', { ascending: false })
        return mapRowToProduct(row as Record<string, unknown>, (images ?? []) as Array<Record<string, unknown>>)
      })
    )

    return {
      data: products,
      total: count ?? 0,
      page,
      pageSize,
      hasMore: (count ?? 0) > to + 1,
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data: row, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    const { data: images } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', row.id)
      .order('is_primary', { ascending: false })

    return mapRowToProduct(row as Record<string, unknown>, (images ?? []) as Array<Record<string, unknown>>)
  },

  // Admin only
  async getAllProducts(): Promise<Product[]> {
    const { data: rows, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Promise.all(
      (rows ?? []).map(async (row) => {
        const { data: images } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', row.id)
          .order('is_primary', { ascending: false })
        return mapRowToProduct(row as Record<string, unknown>, (images ?? []) as Array<Record<string, unknown>>)
      })
    )
  },

  async createProduct(data: ProductFormData): Promise<ApiResponse<Product>> {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data: row, error } = await supabase
      .from('products')
      .insert({
        name: data.name,
        slug,
        description: data.description,
        short_description: data.shortDescription,
        price: data.price,
        compare_at_price: data.compareAtPrice ?? null,
        category: data.category,
        tags: data.tags,
        stock: data.stock,
        is_sold_out: data.stock === 0,
        is_active: data.isActive,
        is_featured: data.isFeatured,
        discount_percent: data.discountPercent ?? null,
        weight: data.weight ?? null,
      })
      .select()
      .single()

    if (error) return { data: null, error: error.message }

    return {
      data: mapRowToProduct(row as Record<string, unknown>, []),
      error: null,
    }
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    const updates: Record<string, unknown> = {}
    if (data.name !== undefined) {
      updates.name = data.name
      updates.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (data.description !== undefined) updates.description = data.description
    if (data.shortDescription !== undefined) updates.short_description = data.shortDescription
    if (data.price !== undefined) updates.price = data.price
    if (data.compareAtPrice !== undefined) updates.compare_at_price = data.compareAtPrice
    if (data.category !== undefined) updates.category = data.category
    if (data.tags !== undefined) updates.tags = data.tags
    if (data.stock !== undefined) {
      updates.stock = data.stock
      updates.is_sold_out = data.stock === 0
    }
    if (data.isActive !== undefined) updates.is_active = data.isActive
    if (data.isFeatured !== undefined) updates.is_featured = data.isFeatured
    if (data.discountPercent !== undefined) updates.discount_percent = data.discountPercent
    if (data.weight !== undefined) updates.weight = data.weight

    const { data: row, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }

    const { data: images } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', id)

    return {
      data: mapRowToProduct(row as Record<string, unknown>, (images ?? []) as Array<Record<string, unknown>>),
      error: null,
    }
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { data: null, error: error.message }
    return { data: null, error: null }
  },

  async uploadProductImage(
    productId: string,
    file: File,
    isPrimary: boolean
  ): Promise<ApiResponse<string>> {
    const ext = file.name.split('.').pop()
    const path = `products/${productId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: false })

    if (uploadError) return { data: null, error: uploadError.message }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(path)

    const { error: dbError } = await supabase.from('product_images').insert({
      product_id: productId,
      url: urlData.publicUrl,
      alt: `${productId} image`,
      is_primary: isPrimary,
    })

    if (dbError) return { data: null, error: dbError.message }

    return { data: urlData.publicUrl, error: null }
  },
}
