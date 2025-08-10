import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Product, Category, ProductVariant, StockMovement, ProductState, PaginatedResponse } from '@/types'

interface InventoryStore extends ProductState {
  // Actions
  fetchProducts: (params?: { search?: string; category?: string; page?: number; limit?: number }) => Promise<void>
  fetchCategories: () => Promise<void>
  createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  createCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<Category>
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  adjustStock: (productId: string, variantId: string | null, quantity: number, reason: string, notes?: string) => Promise<void>
  getStockMovements: (productId?: string) => Promise<StockMovement[]>
  getLowStockProducts: () => Promise<Product[]>
  setSelectedProduct: (product: Product | null) => void
  clearError: () => void
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  loading: false,
  error: null,
  selectedProduct: null,

  // Actions
  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      // Apply search filter
      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,sku.ilike.%${params.search}%`)
      }

      // Apply category filter
      if (params.category) {
        query = query.eq('category_id', params.category)
      }

      // Apply pagination
      const page = params.page || 1
      const limit = params.limit || 20
      const from = (page - 1) * limit
      const to = from + limit - 1
      
      query = query.range(from, to)

      const { data, error } = await query

      if (error) throw error

      set({
        products: data || [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch products',
      })
      throw error
    }
  },

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      set({
        categories: data || [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch categories',
      })
      throw error
    }
  },

  createProduct: async (productData) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .single()

      if (error) throw error

      const { products } = get()
      set({
        products: [data, ...products],
        loading: false,
        error: null,
      })

      return data
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to create product',
      })
      throw error
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .single()

      if (error) throw error

      const { products } = get()
      set({
        products: products.map(p => p.id === id ? data : p),
        selectedProduct: data,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update product',
      })
      throw error
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      const { products } = get()
      set({
        products: products.filter(p => p.id !== id),
        selectedProduct: null,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to delete product',
      })
      throw error
    }
  },

  createCategory: async (categoryData) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single()

      if (error) throw error

      const { categories } = get()
      set({
        categories: [data, ...categories],
        loading: false,
        error: null,
      })

      return data
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to create category',
      })
      throw error
    }
  },

  updateCategory: async (id: string, updates: Partial<Category>) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const { categories } = get()
      set({
        categories: categories.map(c => c.id === id ? data : c),
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update category',
      })
      throw error
    }
  },

  deleteCategory: async (id: string) => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase
        .from('categories')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      const { categories } = get()
      set({
        categories: categories.filter(c => c.id !== id),
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to delete category',
      })
      throw error
    }
  },

  adjustStock: async (productId: string, variantId: string | null, quantity: number, reason: string, notes?: string) => {
    try {
      set({ loading: true, error: null })

      // Create stock movement record
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert([{
          product_id: productId,
          variant_id: variantId,
          movement_type: quantity > 0 ? 'in' : 'out',
          quantity: Math.abs(quantity),
          reason,
          notes,
        }])

      if (movementError) throw movementError

      // Update product stock
      if (variantId) {
        const { error: variantError } = await supabase
          .from('product_variants')
          .update({ 
            stock_quantity: supabase.raw(`stock_quantity + ${quantity}`)
          })
          .eq('id', variantId)

        if (variantError) throw variantError
      } else {
        const { error: productError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: supabase.raw(`stock_quantity + ${quantity}`)
          })
          .eq('id', productId)

        if (productError) throw productError
      }

      // Refresh products
      await get().fetchProducts()

      set({
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to adjust stock',
      })
      throw error
    }
  },

  getStockMovements: async (productId?: string) => {
    try {
      let query = supabase
        .from('stock_movements')
        .select(`
          *,
          product:products(name, sku),
          variant:product_variants(size, color)
        `)
        .order('created_at', { ascending: false })

      if (productId) {
        query = query.eq('product_id', productId)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch stock movements',
      })
      throw error
    }
  },

  getLowStockProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .lt('stock_quantity', supabase.raw('min_stock_level'))
        .eq('is_active', true)
        .order('stock_quantity')

      if (error) throw error

      return data || []
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch low stock products',
      })
      throw error
    }
  },

  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product })
  },

  clearError: () => {
    set({ error: null })
  },
}))