import { create } from 'zustand'
import { supabase } from '../config/supabase'

export interface Payment {
  id: string
  invoiceId?: string
  invoiceNumber?: string
  customerId?: string
  customerName: string
  amount: number
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_banking' | 'card'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  reference?: string
  notes?: string
  paymentDate: string
  createdAt: string
  updatedAt: string
}

export interface CashRegisterSession {
  id: string
  employeeId: string
  employeeName: string
  startTime: string
  endTime?: string
  openingBalance: number
  closingBalance?: number
  totalSales: number
  totalCash: number
  totalOtherPayments: number
  status: 'open' | 'closed'
  notes?: string
  createdAt: string
}

export interface PaymentSummary {
  totalPayments: number
  totalAmount: number
  cashPayments: number
  bankTransfers: number
  mobilePayments: number
  cardPayments: number
  pendingPayments: number
  completedPayments: number
}

interface PaymentStore {
  payments: Payment[]
  cashSessions: CashRegisterSession[]
  currentSession: CashRegisterSession | null
  paymentSummary: PaymentSummary
  isLoading: boolean
  error: string | null

  // Payment Actions
  fetchPayments: (dateRange?: { start: string; end: string }) => Promise<void>
  createPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>
  deletePayment: (id: string) => Promise<void>
  processRefund: (paymentId: string, refundAmount: number, reason?: string) => Promise<void>

  // Cash Register Actions
  fetchCashSessions: () => Promise<void>
  openCashRegister: (employeeId: string, employeeName: string, openingBalance: number) => Promise<void>
  closeCashRegister: (sessionId: string, closingBalance: number, notes?: string) => Promise<void>
  getCurrentSession: () => Promise<void>

  // Analytics Actions
  generatePaymentSummary: (dateRange?: { start: string; end: string }) => Promise<void>
  getPaymentsByMethod: () => { method: string; count: number; amount: number }[]

  // Utility Actions
  clearError: () => void
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  cashSessions: [],
  currentSession: null,
  paymentSummary: {
    totalPayments: 0,
    totalAmount: 0,
    cashPayments: 0,
    bankTransfers: 0,
    mobilePayments: 0,
    cardPayments: 0,
    pendingPayments: 0,
    completedPayments: 0
  },
  isLoading: false,
  error: null,

  fetchPayments: async (dateRange) => {
    set({ isLoading: true, error: null })
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('paymentDate', { ascending: false })

      if (dateRange) {
        query = query
          .gte('paymentDate', dateRange.start)
          .lte('paymentDate', dateRange.end)
      }

      const { data, error } = await query

      if (error) throw error

      set({ payments: data || [], isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
        isLoading: false 
      })
    }
  },

  createPayment: async (paymentData) => {
    set({ isLoading: true, error: null })
    try {
      const newPayment = {
        ...paymentData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('payments')
        .insert([newPayment])

      if (error) throw error

      const { payments } = get()
      set({ 
        payments: [newPayment, ...payments],
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create payment',
        isLoading: false 
      })
    }
  },

  updatePayment: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('payments')
        .update(updatedData)
        .eq('id', id)

      if (error) throw error

      const { payments } = get()
      set({ 
        payments: payments.map(payment => 
          payment.id === id ? { ...payment, ...updatedData } : payment
        ),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update payment',
        isLoading: false 
      })
    }
  },

  deletePayment: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id)

      if (error) throw error

      const { payments } = get()
      set({ 
        payments: payments.filter(payment => payment.id !== id),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete payment',
        isLoading: false 
      })
    }
  },

  processRefund: async (paymentId, refundAmount, reason) => {
    set({ isLoading: true, error: null })
    try {
      // Create refund record
      const refundPayment = {
        id: crypto.randomUUID(),
        invoiceId: undefined,
        customerId: undefined,
        customerName: 'Refund',
        amount: -refundAmount,
        paymentMethod: 'cash' as const,
        status: 'completed' as const,
        reference: `Refund for payment ${paymentId}`,
        notes: reason,
        paymentDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const { error: refundError } = await supabase
        .from('payments')
        .insert([refundPayment])

      if (refundError) throw refundError

      // Update original payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({ 
          status: 'refunded',
          updatedAt: new Date().toISOString()
        })
        .eq('id', paymentId)

      if (updateError) throw updateError

      const { payments } = get()
      set({ 
        payments: [
          refundPayment,
          ...payments.map(payment => 
            payment.id === paymentId 
              ? { ...payment, status: 'refunded' as const, updatedAt: new Date().toISOString() }
              : payment
          )
        ],
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to process refund',
        isLoading: false 
      })
    }
  },

  fetchCashSessions: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .order('startTime', { ascending: false })

      if (error) throw error

      set({ cashSessions: data || [], isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cash sessions',
        isLoading: false 
      })
    }
  },

  openCashRegister: async (employeeId, employeeName, openingBalance) => {
    set({ isLoading: true, error: null })
    try {
      const newSession = {
        id: crypto.randomUUID(),
        employeeId,
        employeeName,
        startTime: new Date().toISOString(),
        openingBalance,
        totalSales: 0,
        totalCash: 0,
        totalOtherPayments: 0,
        status: 'open' as const,
        createdAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('cash_sessions')
        .insert([newSession])

      if (error) throw error

      const { cashSessions } = get()
      set({ 
        cashSessions: [newSession, ...cashSessions],
        currentSession: newSession,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to open cash register',
        isLoading: false 
      })
    }
  },

  closeCashRegister: async (sessionId, closingBalance, notes) => {
    set({ isLoading: true, error: null })
    try {
      const updateData = {
        endTime: new Date().toISOString(),
        closingBalance,
        status: 'closed' as const,
        notes
      }

      const { error } = await supabase
        .from('cash_sessions')
        .update(updateData)
        .eq('id', sessionId)

      if (error) throw error

      const { cashSessions } = get()
      set({ 
        cashSessions: cashSessions.map(session => 
          session.id === sessionId ? { ...session, ...updateData } : session
        ),
        currentSession: null,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to close cash register',
        isLoading: false 
      })
    }
  },

  getCurrentSession: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('status', 'open')
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"

      set({ currentSession: data || null, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch current session',
        isLoading: false 
      })
    }
  },

  generatePaymentSummary: async (dateRange) => {
    const { payments } = get()
    
    let filteredPayments = payments
    if (dateRange) {
      filteredPayments = payments.filter(payment => 
        payment.paymentDate >= dateRange.start && payment.paymentDate <= dateRange.end
      )
    }

    const summary = filteredPayments.reduce((acc, payment) => {
      acc.totalPayments++
      acc.totalAmount += payment.amount

      switch (payment.paymentMethod) {
        case 'cash':
          acc.cashPayments++
          break
        case 'bank_transfer':
          acc.bankTransfers++
          break
        case 'mobile_banking':
          acc.mobilePayments++
          break
        case 'card':
          acc.cardPayments++
          break
      }

      if (payment.status === 'pending') {
        acc.pendingPayments++
      } else if (payment.status === 'completed') {
        acc.completedPayments++
      }

      return acc
    }, {
      totalPayments: 0,
      totalAmount: 0,
      cashPayments: 0,
      bankTransfers: 0,
      mobilePayments: 0,
      cardPayments: 0,
      pendingPayments: 0,
      completedPayments: 0
    })

    set({ paymentSummary: summary })
  },

  getPaymentsByMethod: () => {
    const { payments } = get()
    const methodStats = payments.reduce((acc, payment) => {
      const existing = acc.find(item => item.method === payment.paymentMethod)
      if (existing) {
        existing.count++
        existing.amount += payment.amount
      } else {
        acc.push({
          method: payment.paymentMethod,
          count: 1,
          amount: payment.amount
        })
      }
      return acc
    }, [] as { method: string; count: number; amount: number }[])

    return methodStats
  },

  clearError: () => set({ error: null })
}))