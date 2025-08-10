import { useEffect } from 'react'
import { useInventoryStore } from '../../stores/inventoryStore'
import { usePaymentStore } from '../../store/paymentStore'
import { useEmployeeStore } from '../../store/employeeStore'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'
import {
  CubeIcon,
  BanknotesIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const DashboardPage = () => {
  const { 
    products, 
    fetchProducts, 
    isLoading: inventoryLoading, 
    error: inventoryError,
    clearError: clearInventoryError 
  } = useInventoryStore()
  
  const { 
    payments, 
    fetchPayments, 
    paymentSummary,
    generatePaymentSummary,
    isLoading: paymentsLoading, 
    error: paymentsError,
    clearError: clearPaymentsError 
  } = usePaymentStore()
  
  const { 
    employees, 
    fetchEmployees, 
    isLoading: employeesLoading, 
    error: employeesError,
    clearError: clearEmployeesError 
  } = useEmployeeStore()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchPayments(),
          fetchEmployees()
        ])
        
        // Generate payment summary after fetching payments
        await generatePaymentSummary()
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    loadDashboardData()
  }, [fetchProducts, fetchPayments, fetchEmployees, generatePaymentSummary])

  // Calculate dashboard metrics
  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockLevel).length
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
  
  const todaysSales = paymentSummary.totalAmount || 0
  const totalEmployees = employees.filter(e => e.status === 'active').length

  const isLoading = inventoryLoading || paymentsLoading || employeesLoading
  const hasErrors = inventoryError || paymentsError || employeesError

  if (isLoading && (!products.length && !payments.length && !employees.length)) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome to Manhas Closet Management System</p>
        </div>
        {isLoading && (
          <LoadingSpinner size="sm" />
        )}
      </div>

      {/* Error Messages */}
      {hasErrors && (
        <div className="space-y-4">
          {inventoryError && (
            <ErrorMessage
              title="Inventory Error"
              message={inventoryError}
              onDismiss={clearInventoryError}
              actions={
                <button
                  onClick={() => fetchProducts()}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              }
            />
          )}
          {paymentsError && (
            <ErrorMessage
              title="Payments Error"
              message={paymentsError}
              onDismiss={clearPaymentsError}
              actions={
                <button
                  onClick={() => fetchPayments()}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              }
            />
          )}
          {employeesError && (
            <ErrorMessage
              title="Employees Error"
              message={employeesError}
              onDismiss={clearEmployeesError}
              actions={
                <button
                  onClick={() => fetchEmployees()}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              }
            />
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Sales</dt>
                  <dd className="text-lg font-medium text-gray-900">৳{todaysSales.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Employees</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalEmployees}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCartIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inventory Value</dt>
                  <dd className="text-lg font-medium text-gray-900">৳{totalInventoryValue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {(lowStockProducts > 0 || outOfStockProducts > 0) && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Stock Alerts</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {lowStockProducts > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ArrowTrendingDownIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Low Stock Items</p>
                      <p className="text-sm text-yellow-700">{lowStockProducts} products need restocking</p>
                    </div>
                  </div>
                </div>
              )}
              {outOfStockProducts > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Out of Stock</p>
                      <p className="text-sm text-red-700">{outOfStockProducts} products are out of stock</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-2" />
              System started successfully with all modules loaded
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CubeIcon className="h-4 w-4 text-blue-500 mr-2" />
              {totalProducts} products loaded from inventory
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 text-purple-500 mr-2" />
              {totalEmployees} active employees in the system
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage