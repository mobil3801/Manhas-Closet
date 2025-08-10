// Export all stores
export { useAuthStore } from './authStore'
export { useInventoryStore } from './inventoryStore'
export { useInvoiceStore } from './invoiceStore'
export { useEmployeeStore } from './employeeStore'
export { 
  useUIStore, 
  showSuccessNotification, 
  showErrorNotification, 
  showWarningNotification, 
  showInfoNotification 
} from './uiStore'

// Store cleanup function
export const cleanupStores = () => {
  // Reset all stores to initial state
  const { useAuthStore } = require('./authStore')
  const { useInventoryStore } = require('./inventoryStore')
  const { useInvoiceStore } = require('./invoiceStore')
  const { useEmployeeStore } = require('./employeeStore')
  const { useUIStore } = require('./uiStore')

  useAuthStore.setState({
    user: null,
    session: null,
    loading: false,
    error: null,
  })

  useInventoryStore.setState({
    products: [],
    categories: [],
    loading: false,
    error: null,
    selectedProduct: null,
  })

  useInvoiceStore.setState({
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
  })

  useEmployeeStore.setState({
    employees: [],
    attendance: [],
    salaries: [],
    loading: false,
    error: null,
  })

  useUIStore.getState().clearNotifications()
}