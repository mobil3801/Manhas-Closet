import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface InvoiceItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId?: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  status: 'draft' | 'pending' | 'paid' | 'cancelled'
  paymentMethod?: string
  notes?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}

interface InvoiceStore {
  invoices: Invoice[]
  currentInvoice: Invoice | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchInvoices: () => Promise<void>
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  getInvoiceById: (id: string) => Promise<void>
  generateInvoiceNumber: () => string
  calculateInvoiceTotals: (items: InvoiceItem[], taxRate: number, discountAmount: number) => {
    subtotal: number
    taxAmount: number
    totalAmount: number
  }
  clearError: () => void
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error

      set({ invoices: data || [], isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch invoices',
        isLoading: false 
      })
    }
  },

  createInvoice: async (invoiceData) => {
    set({ isLoading: true, error: null })
    try {
      const newInvoice = {
        ...invoiceData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('invoices')
        .insert([newInvoice])

      if (error) throw error

      const { invoices } = get()
      set({ 
        invoices: [newInvoice, ...invoices],
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create invoice',
        isLoading: false 
      })
    }
  },

  updateInvoice: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('invoices')
        .update(updatedData)
        .eq('id', id)

      if (error) throw error

      const { invoices } = get()
      set({ 
        invoices: invoices.map(invoice => 
          invoice.id === id ? { ...invoice, ...updatedData } : invoice
        ),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update invoice',
        isLoading: false 
      })
    }
  },

  deleteInvoice: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error

      const { invoices } = get()
      set({ 
        invoices: invoices.filter(invoice => invoice.id !== id),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete invoice',
        isLoading: false 
      })
    }
  },

  getInvoiceById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      set({ currentInvoice: data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch invoice',
        isLoading: false 
      })
    }
  },

  generateInvoiceNumber: () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const timestamp = Date.now().toString().slice(-4)
    
    return `INV-${year}${month}${day}-${timestamp}`
  },

  calculateInvoiceTotals: (items, taxRate, discountAmount) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxAmount = (subtotal - discountAmount) * (taxRate / 100)
    const totalAmount = subtotal + taxAmount - discountAmount
    
    return {
      subtotal,
      taxAmount,
      totalAmount
    }
  },

  clearError: () => set({ error: null })
}))