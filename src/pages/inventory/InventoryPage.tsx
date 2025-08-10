import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useInventoryStore } from '@/stores'
import { APP_CONFIG } from '@/constants'
import { 
  ShoppingBagIcon, 
  CubeIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  PlusIcon 
} from '@heroicons/react/24/outline'

const InventoryPage = () => {
  const { products, categories, fetchProducts, fetchCategories, getLowStockProducts, loading } = useInventoryStore()
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    categoriesCount: 0
  })

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    try {
      await fetchProducts()
      await fetchCategories()
      const lowStock = await getLowStockProducts()
      setLowStockProducts(lowStock)
      
      // Calculate inventory stats
      const totalProducts = products.length
      const totalValue = products.reduce((sum, product) => 
        sum + (product.price * product.stock_quantity), 0
      )
      const lowStockCount = lowStock.length
      const categoriesCount = categories.length

      setInventoryStats({
        totalProducts,
        totalValue,
        lowStockCount,
        categoriesCount
      })
    } catch (error) {
      console.error('Error loading inventory data:', error)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color = 'blue', linkTo }: {
    title: string
    value: string | number
    icon: any
    color?: 'blue' | 'green' | 'yellow' | 'red'
    linkTo?: string
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      yellow: 'bg-yellow-50 text-yellow-700',
      red: 'bg-red-50 text-red-700'
    }

    const content = (
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="text-lg font-medium text-gray-900">{value}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )

    return linkTo ? <Link to={linkTo}>{content}</Link> : content
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-5 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your products, categories, and stock levels
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/inventory/categories"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Categories
          </Link>
          <Link
            to="/inventory/products"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={inventoryStats.totalProducts}
          icon={ShoppingBagIcon}
          color="blue"
          linkTo="/inventory/products"
        />
        <StatCard
          title="Total Value"
          value={`${APP_CONFIG.CURRENCY_SYMBOL}${inventoryStats.totalValue.toLocaleString()}`}
          icon={ArrowTrendingUpIcon}
          color="green"
        />
        <StatCard
          title="Categories"
          value={inventoryStats.categoriesCount}
          icon={CubeIcon}
          color="blue"
          linkTo="/inventory/categories"
        />
        <StatCard
          title="Low Stock Items"
          value={inventoryStats.lowStockCount}
          icon={ExclamationTriangleIcon}
          color={inventoryStats.lowStockCount > 0 ? "red" : "green"}
        />
      </div>

      {/* Low Stock Alert */}
      {inventoryStats.lowStockCount > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Low Stock Alert
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {inventoryStats.lowStockCount} products are running low on stock. 
                  <Link to="/inventory/products" className="font-medium underline ml-1">
                    Review inventory levels
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/inventory/products"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBagIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Manage Products</h4>
                <p className="text-sm text-gray-500">Add, edit, and view products</p>
              </div>
            </Link>

            <Link
              to="/inventory/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CubeIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Categories</h4>
                <p className="text-sm text-gray-500">Organize product categories</p>
              </div>
            </Link>

            <Link
              to="/inventory/movements"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Stock Movements</h4>
                <p className="text-sm text-gray-500">Track inventory changes</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Products Requiring Attention
            </h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockProducts.slice(0, 5).map((product: any) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.min_stock_level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPage