import { useState, useEffect } from 'react'
import { useInventoryStore } from '@/stores'
import { APP_CONFIG } from '@/constants'
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

const StockMovementsPage = () => {
  const { products, getStockMovements, loading } = useInventoryStore()
  const [movements, setMovements] = useState([])
  const [filteredMovements, setFilteredMovements] = useState([])
  const [filters, setFilters] = useState({
    product_id: '',
    movement_type: '',
    date_from: '',
    date_to: '',
    search: ''
  })

  useEffect(() => {
    loadMovements()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [movements, filters])

  const loadMovements = async () => {
    try {
      const data = await getStockMovements()
      setMovements(data)
    } catch (error) {
      console.error('Error loading stock movements:', error)
    }
  }

  const applyFilters = () => {
    let filtered = [...movements]

    // Filter by product
    if (filters.product_id) {
      filtered = filtered.filter(movement => movement.product_id === filters.product_id)
    }

    // Filter by movement type
    if (filters.movement_type) {
      filtered = filtered.filter(movement => movement.movement_type === filters.movement_type)
    }

    // Filter by date range
    if (filters.date_from) {
      filtered = filtered.filter(movement => 
        new Date(movement.created_at) >= new Date(filters.date_from)
      )
    }
    if (filters.date_to) {
      filtered = filtered.filter(movement => 
        new Date(movement.created_at) <= new Date(filters.date_to)
      )
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(movement =>
        movement.reason.toLowerCase().includes(searchLower) ||
        movement.notes?.toLowerCase().includes(searchLower) ||
        movement.product?.name.toLowerCase().includes(searchLower)
      )
    }

    setFilteredMovements(filtered)
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />
      case 'out':
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />
      case 'adjustment':
        return <AdjustmentsHorizontalIcon className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-green-100 text-green-800'
      case 'out':
        return 'bg-red-100 text-red-800'
      case 'adjustment':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatMovementType = (type: string) => {
    switch (type) {
      case 'in':
        return 'Stock In'
      case 'out':
        return 'Stock Out'
      case 'adjustment':
        return 'Adjustment'
      default:
        return type
    }
  }

  const clearFilters = () => {
    setFilters({
      product_id: '',
      movement_type: '',
      date_from: '',
      date_to: '',
      search: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track all inventory changes and movements
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search movements..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>
            <select
              value={filters.product_id}
              onChange={(e) => setFilters({...filters, product_id: e.target.value})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movement Type
            </label>
            <select
              value={filters.movement_type}
              onChange={(e) => setFilters({...filters, movement_type: e.target.value})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({...filters, date_from: e.target.value})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({...filters, date_to: e.target.value})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Stock In</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredMovements.filter(m => m.movement_type === 'in').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Stock Out</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredMovements.filter(m => m.movement_type === 'out').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Adjustments</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredMovements.filter(m => m.movement_type === 'adjustment').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement: any) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div>{new Date(movement.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(movement.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {movement.product?.name || 'Unknown Product'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {movement.product?.sku || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getMovementColor(movement.movement_type)}`}>
                      {getMovementIcon(movement.movement_type)}
                      <span className="ml-1">{formatMovementType(movement.movement_type)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-medium ${
                      movement.movement_type === 'in' ? 'text-green-600' :
                      movement.movement_type === 'out' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {movement.movement_type === 'out' ? '-' : '+'}
                      {movement.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {movement.reason}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {movement.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {!loading && filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center">
              <AdjustmentsHorizontalIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stock movements</h3>
            <p className="mt-1 text-sm text-gray-500">
              {movements.length === 0 
                ? "No stock movements have been recorded yet."
                : "No movements match your current filters."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockMovementsPage