import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Invoice, InvoiceItem, Payment, InvoiceState } from '@/types'
import { generateInvoiceNumber } from '@/lib/utils'

interface InvoiceStore extends InvoiceState {
  // Actions
  fetchInvoices: (params?: { search?: string; status?: string; page?: number; limit?: number }) => Promise<void>
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'>) => Promise<Invoice>
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  addInvoiceItem: (invoiceId: string, item: Omit<InvoiceItem, 'id' | 'invoice_id'>) => Promise<void>
  updateInvoiceItem: (itemId: string, updates: Partial<InvoiceItem>) => Promise<void>
  removeInvoiceItem: (itemId: string) => Promise<void>
  completeInvoice: (id: string) => Promise<void>
  voidInvoice: (id: string) => Promise<void>
  addPayment: (payment: Omit<Payment, 'id' | 'created_at'>) => Promise<void>
  generatePDF: (invoiceId: string) => Promise<Blob>
  setCurrentInvoice: (invoice: Invoice | null) => void
  clearError: () => void
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  // Initial state
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,

  // Actions
  fetchInvoices: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      
      let query = supabase
        .from('invoices')
        .select(`
          *,
          items:invoice_items(*,
            product:products(name, sku),
            variant:product_variants(size, color)
          ),
          payments:payments(*)
        `)
        .order('created_at', { ascending: false })

      // Apply search filter
      if (params.search) {
        query = query.or(`invoice_number.ilike.%${params.search}%,customer_name.ilike.%${params.search}%`)
      }

      // Apply status filter
      if (params.status) {
        query = query.eq('status', params.status)
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
        invoices: data || [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch invoices',
      })
      throw error
    }
  },

  createInvoice: async (invoiceData) => {
    try {
      set({ loading: true, error: null })

      const invoiceNumber = generateInvoiceNumber()
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          ...invoiceData,
          invoice_number: invoiceNumber,
        }])
        .select(`
          *,
          items:invoice_items(*,
            product:products(name, sku),
            variant:product_variants(size, color)
          ),
          payments:payments(*)
        `)
        .single()

      if (error) throw error

      const { invoices } = get()
      set({
        invoices: [data, ...invoices],
        currentInvoice: data,
        loading: false,
        error: null,
      })

      return data
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to create invoice',
      })
      throw error
    }
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          items:invoice_items(*,
            product:products(name, sku),
            variant:product_variants(size, color)
          ),
          payments:payments(*)
        `)
        .single()

      if (error) throw error

      const { invoices } = get()
      set({
        invoices: invoices.map(inv => inv.id === id ? data : inv),
        currentInvoice: data,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update invoice',
      })
      throw error
    }
  },

  deleteInvoice: async (id: string) => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error

      const { invoices } = get()
      set({
        invoices: invoices.filter(inv => inv.id !== id),
        currentInvoice: null,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to delete invoice',
      })
      throw error
    }
  },

  addInvoiceItem: async (invoiceId: string, itemData) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('invoice_items')
        .insert([{
          ...itemData,
          invoice_id: invoiceId,
        }])
        .select(`
          *,
          product:products(name, sku),
          variant:product_variants(size, color)
        `)
        .single()

      if (error) throw error

      const { currentInvoice, invoices } = get()
      if (currentInvoice && currentInvoice.id === invoiceId) {
        const updatedInvoice = {
          ...currentInvoice,
          items: [...(currentInvoice.items || []), data],
        }
        
        set({
          currentInvoice: updatedInvoice,
          invoices: invoices.map(inv => inv.id === invoiceId ? updatedInvoice : inv),
          loading: false,
          error: null,
        })
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to add invoice item',
      })
      throw error
    }
  },

  updateInvoiceItem: async (itemId: string, updates: Partial<InvoiceItem>) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('invoice_items')
        .update(updates)
        .eq('id', itemId)
        .select(`
          *,
          product:products(name, sku),
          variant:product_variants(size, color)
        `)
        .single()

      if (error) throw error

      const { currentInvoice, invoices } = get()
      if (currentInvoice) {
        const updatedInvoice = {
          ...currentInvoice,
          items: currentInvoice.items?.map(item => item.id === itemId ? data : item) || [],
        }
        
        set({
          currentInvoice: updatedInvoice,
          invoices: invoices.map(inv => inv.id === currentInvoice.id ? updatedInvoice : inv),
          loading: false,
          error: null,
        })
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update invoice item',
      })
      throw error
    }
  },

  removeInvoiceItem: async (itemId: string) => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase
        .from('invoice_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      const { currentInvoice, invoices } = get()
      if (currentInvoice) {
        const updatedInvoice = {
          ...currentInvoice,
          items: currentInvoice.items?.filter(item => item.id !== itemId) || [],
        }
        
        set({
          currentInvoice: updatedInvoice,
          invoices: invoices.map(inv => inv.id === currentInvoice.id ? updatedInvoice : inv),
          loading: false,
          error: null,
        })
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to remove invoice item',
      })
      throw error
    }
  },

  completeInvoice: async (id: string) => {
    try {
      await get().updateInvoice(id, { status: 'completed' })
    } catch (error) {
      throw error
    }
  },

  voidInvoice: async (id: string) => {
    try {
      await get().updateInvoice(id, { status: 'voided' })
    } catch (error) {
      throw error
    }
  },

  addPayment: async (paymentData) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single()

      if (error) throw error

      // Update invoice payment status if needed
      if (paymentData.invoice_id) {
        const { data: invoice } = await supabase
          .from('invoices')
          .select('total_amount, payments(amount)')
          .eq('id', paymentData.invoice_id)
          .single()

        if (invoice) {
          const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
          const paymentStatus = totalPaid >= invoice.total_amount ? 'paid' : 
                              totalPaid > 0 ? 'partial' : 'pending'

          await get().updateInvoice(paymentData.invoice_id, { payment_status: paymentStatus })
        }
      }

      set({
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to add payment',
      })
      throw error
    }
  },

  generatePDF: async (invoiceId: string) => {
    try {
      set({ loading: true, error: null })

      // This would integrate with a PDF generation service
      // For now, we'll return a placeholder
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)
      
      if (!response.ok) throw new Error('Failed to generate PDF')

      const blob = await response.blob()
      
      set({
        loading: false,
        error: null,
      })

      return blob
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to generate PDF',
      })
      throw error
    }
  },

  setCurrentInvoice: (invoice: Invoice | null) => {
    set({ currentInvoice: invoice })
  },

  clearError: () => {
    set({ error: null })
  },
}))