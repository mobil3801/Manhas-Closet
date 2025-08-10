import { create } from 'zustand'
import { supabase } from '../config/supabase'

export interface SalesReport {
  period: string
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topProducts: {
    productId: string
    productName: string
    unitsSold: number
    revenue: number
  }[]
  salesByDay: {
    date: string
    sales: number
    orders: number
  }[]
  salesByCategory: {
    category: string
    sales: number
    percentage: number
  }[]
}

export interface InventoryReport {
  period: string
  totalProducts: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  topMovingProducts: {
    productId: string
    productName: string
    movementType: 'in' | 'out'
    quantity: number
  }[]
  stockValueByCategory: {
    category: string
    value: number
    percentage: number
  }[]
  stockMovements: {
    date: string
    inbound: number
    outbound: number
    net: number
  }[]
}

export interface FinancialReport {
  period: string
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  grossMargin: number
  paymentMethodBreakdown: {
    method: string
    amount: number
    percentage: number
  }[]
  monthlyTrends: {
    month: string
    revenue: number
    expenses: number
    profit: number
  }[]
}

export interface EmployeeReport {
  period: string
  totalEmployees: number
  totalSalaries: number
  attendanceRate: number
  overtimeHours: number
  departmentBreakdown: {
    department: string
    employees: number
    totalSalary: number
  }[]
  attendanceData: {
    date: string
    present: number
    absent: number
    late: number
  }[]
}

interface ReportsStore {
  salesReport: SalesReport | null
  inventoryReport: InventoryReport | null
  financialReport: FinancialReport | null
  employeeReport: EmployeeReport | null
  isLoading: boolean
  error: string | null

  // Sales Report Actions
  generateSalesReport: (dateRange: { start: string; end: string }) => Promise<void>
  
  // Inventory Report Actions
  generateInventoryReport: (dateRange: { start: string; end: string }) => Promise<void>
  
  // Financial Report Actions
  generateFinancialReport: (dateRange: { start: string; end: string }) => Promise<void>
  
  // Employee Report Actions
  generateEmployeeReport: (dateRange: { start: string; end: string }) => Promise<void>
  
  // Export Actions
  exportReport: (reportType: 'sales' | 'inventory' | 'financial' | 'employee', format: 'csv' | 'pdf') => Promise<void>
  
  // Utility Actions
  clearReports: () => void
  clearError: () => void
}

export const useReportsStore = create<ReportsStore>((set, get) => ({
  salesReport: null,
  inventoryReport: null,
  financialReport: null,
  employeeReport: null,
  isLoading: false,
  error: null,

  generateSalesReport: async (dateRange) => {
    set({ isLoading: true, error: null })
    try {
      // Fetch sales data from multiple tables
      const [ordersData, productsData, paymentsData] = await Promise.all([
        supabase
          .from('invoices')
          .select('*')
          .gte('createdAt', dateRange.start)
          .lte('createdAt', dateRange.end)
          .eq('status', 'paid'),
        
        supabase
          .from('products')
          .select('*'),
        
        supabase
          .from('payments')
          .select('*')
          .gte('paymentDate', dateRange.start)
          .lte('paymentDate', dateRange.end)
          .eq('status', 'completed')
      ])

      if (ordersData.error || productsData.error || paymentsData.error) {
        throw new Error('Failed to fetch sales data')
      }

      const orders = ordersData.data || []
      const products = productsData.data || []
      const payments = paymentsData.data || []

      // Calculate metrics
      const totalSales = payments.reduce((sum, payment) => sum + payment.amount, 0)
      const totalOrders = orders.length
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

      // Generate mock data for demonstration
      const salesReport: SalesReport = {
        period: `${dateRange.start} to ${dateRange.end}`,
        totalSales,
        totalOrders,
        averageOrderValue,
        topProducts: products.slice(0, 5).map((product, index) => ({
          productId: product.id,
          productName: product.name,
          unitsSold: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 10000) + 5000
        })),
        salesByDay: [],
        salesByCategory: []
      }

      set({ salesReport, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate sales report',
        isLoading: false 
      })
    }
  },

  generateInventoryReport: async (dateRange) => {
    set({ isLoading: true, error: null })
    try {
      // Fetch inventory data
      const [productsData, categoriesData, movementsData] = await Promise.all([
        supabase
          .from('products')
          .select('*'),
        
        supabase
          .from('categories')
          .select('*'),
        
        supabase
          .from('stock_movements')
          .select('*')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
      ])

      if (productsData.error || categoriesData.error || movementsData.error) {
        throw new Error('Failed to fetch inventory data')
      }

      const products = productsData.data || []
      const categories = categoriesData.data || []
      const movements = movementsData.data || []

      // Calculate metrics
      const totalProducts = products.length
      const totalValue = products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0)
      const lowStockItems = products.filter(product => product.stockQuantity <= product.minStockLevel).length
      const outOfStockItems = products.filter(product => product.stockQuantity === 0).length

      const inventoryReport: InventoryReport = {
        period: `${dateRange.start} to ${dateRange.end}`,
        totalProducts,
        totalValue,
        lowStockItems,
        outOfStockItems,
        topMovingProducts: movements.slice(0, 10).map(movement => ({
          productId: movement.productId,
          productName: movement.productName || 'Unknown Product',
          movementType: movement.type,
          quantity: movement.quantity
        })),
        stockValueByCategory: categories.map(category => ({
          category: category.name,
          value: Math.floor(Math.random() * 50000) + 10000,
          percentage: Math.floor(Math.random() * 30) + 10
        })),
        stockMovements: []
      }

      set({ inventoryReport, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate inventory report',
        isLoading: false 
      })
    }
  },

  generateFinancialReport: async (dateRange) => {
    set({ isLoading: true, error: null })
    try {
      // Fetch financial data
      const [paymentsData, expensesData] = await Promise.all([
        supabase
          .from('payments')
          .select('*')
          .gte('paymentDate', dateRange.start)
          .lte('paymentDate', dateRange.end)
          .eq('status', 'completed'),
        
        // Mock expenses query - would be from an expenses table
        Promise.resolve({ data: [], error: null })
      ])

      if (paymentsData.error || expensesData.error) {
        throw new Error('Failed to fetch financial data')
      }

      const payments = paymentsData.data || []
      const expenses = expensesData.data || []

      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)
      const totalExpenses = 15000 // Mock data
      const netProfit = totalRevenue - totalExpenses
      const grossMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0

      const financialReport: FinancialReport = {
        period: `${dateRange.start} to ${dateRange.end}`,
        totalRevenue,
        totalExpenses,
        netProfit,
        grossMargin,
        paymentMethodBreakdown: [
          { method: 'Cash', amount: totalRevenue * 0.6, percentage: 60 },
          { method: 'Bank Transfer', amount: totalRevenue * 0.25, percentage: 25 },
          { method: 'Mobile Banking', amount: totalRevenue * 0.15, percentage: 15 }
        ],
        monthlyTrends: []
      }

      set({ financialReport, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate financial report',
        isLoading: false 
      })
    }
  },

  generateEmployeeReport: async (dateRange) => {
    set({ isLoading: true, error: null })
    try {
      // Fetch employee data
      const [employeesData, attendanceData] = await Promise.all([
        supabase
          .from('employees')
          .select('*')
          .eq('status', 'active'),
        
        supabase
          .from('attendance')
          .select('*')
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
      ])

      if (employeesData.error || attendanceData.error) {
        throw new Error('Failed to fetch employee data')
      }

      const employees = employeesData.data || []
      const attendance = attendanceData.data || []

      const totalEmployees = employees.length
      const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0)
      const presentDays = attendance.filter(record => record.status === 'present').length
      const totalWorkDays = attendance.length
      const attendanceRate = totalWorkDays > 0 ? (presentDays / totalWorkDays) * 100 : 0

      const employeeReport: EmployeeReport = {
        period: `${dateRange.start} to ${dateRange.end}`,
        totalEmployees,
        totalSalaries,
        attendanceRate,
        overtimeHours: 45, // Mock data
        departmentBreakdown: [
          { department: 'Sales', employees: 5, totalSalary: 75000 },
          { department: 'Management', employees: 2, totalSalary: 80000 },
          { department: 'Operations', employees: 3, totalSalary: 45000 }
        ],
        attendanceData: []
      }

      set({ employeeReport, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate employee report',
        isLoading: false 
      })
    }
  },

  exportReport: async (reportType, format) => {
    set({ isLoading: true, error: null })
    try {
      // Mock export functionality
      const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`
      
      // In a real implementation, this would generate and download the file
      console.log(`Exporting ${reportType} report as ${format}: ${fileName}`)
      
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set({ isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to export report',
        isLoading: false 
      })
    }
  },

  clearReports: () => {
    set({
      salesReport: null,
      inventoryReport: null,
      financialReport: null,
      employeeReport: null
    })
  },

  clearError: () => set({ error: null })
}))