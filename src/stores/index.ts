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

// Store initialization function
export const initializeStores = async () => {
  // Initialize auth store
  const { checkAuth } = useAuthStore.getState()
  await checkAuth()

  // Initialize other stores if needed
  // This can be expanded to include other initialization logic
}

// Store cleanup function
export const cleanupStores = () => {
  // Reset all stores to initial state
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