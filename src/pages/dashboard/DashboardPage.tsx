import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores'
import { supabase } from '@/lib/supabase'
import { APP_CONFIG } from '@/constants'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalSales: number
  todaySales: number
  totalProducts: number
  lowStockProducts: number
  totalEmployees: number
  activeEmployees: number
  pendingInvoices: number
  overDuePayments: number
}

interface RecentActivity {
  id: string
  type: 'sale' | 'inventory' | 'employee'
  description: string
  timestamp: string
  amount?: number
}

const DashboardPage = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    todaySales: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    pendingInvoices: 0,
    overDuePayments: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch sales data
      const today = new Date().toISOString().split('T')[0]
      const { data: salesData } = await supabase
        .from('invoices')
        .select('total_amount, created_at')
        .eq('status', 'completed')

      const totalSales = salesData?.reduce((sum, invoice) => sum + invoice.total_amount, 0) || 0
      const todaySales = salesData?.filter(invoice => 
        invoice.created_at.startsWith(today)
      ).reduce((sum, invoice) => sum + invoice.total_amount, 0) || 0

      // Fetch product data
      const { data: productsData } = await supabase
        .from('products')
        .select('stock_quantity, min_stock_level')
        .eq('is_active', true)

      const totalProducts = productsData?.length || 0
      const lowStockProducts = productsData?.filter(product => 
        product.stock_quantity <= product.min_stock_level
      ).length || 0

      // Fetch employee data
      const { data: employeesData } = await supabase
        .from('employees')
        .select('status')

      const totalEmployees = employeesData?.length || 0
      const activeEmployees = employeesData?.filter(emp => emp.status === 'active').length || 0

      // Fetch invoice data
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('payment_status')

      const pendingInvoices = invoicesData?.filter(inv => inv.payment_status === 'pending').length || 0
      const overDuePayments = invoicesData?.filter(inv => inv.payment_status === 'overdue').length || 0

      setStats({
        totalSales,
        todaySales,
        totalProducts,
        lowStockProducts,
        totalEmployees,
        activeEmployees,
        pendingInvoices,
        overDuePayments
      })

      // Fetch recent activity (mock data for now - would be real queries in production)
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'sale',
          description: 'New sale completed',
          timestamp: new Date().toISOString(),
          amount: 15000
        },
        {
          id: '2',
          type: 'inventory',
          description: 'Low stock alert: Saree - Red Silk',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'employee',
          description: 'Employee check-in: Fatima Rahman',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]
      setRecentActivity(mockActivity)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `${APP_CONFIG.CURRENCY_SYMBOL}${amount.toLocaleString()}`
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    changeType = 'positive',
    loading: cardLoading = false 
  }: {
    title: string
    value: string | number
    icon: any
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    loading?: boolean
  }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                {cardLoading ? (
                  <div className="animate-pulse h-6 bg-gray-200 rounded w-20"></div>
                ) : (
                  <div className="text-lg font-medium text-gray-900">{value}</div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`font-medium ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {changeType === 'positive' && <TrendingUpIcon className="inline h-4 w-4 mr-1" />}
              {changeType === 'negative' && <TrendingDownIcon className="inline h-4 w-4 mr-1" />}
              {change}
            </span>
            <span className="text-gray-500"> from yesterday</span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(stats.todaySales)}
          icon={CurrencyDollarIcon}
          change="+12%"
          changeType="positive"
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBagIcon}
          change="+5%"
          changeType="positive"
          loading={loading}
        />
        <StatCard
          title="Active Employees"
          value={`${stats.activeEmployees}/${stats.totalEmployees}`}
          icon={UsersIcon}
          loading={loading}
        />
        <StatCard
          title="Pending Invoices"
          value={stats.pendingInvoices}
          icon={ChartBarIcon}
          change="-2%"
          changeType="negative"
          loading={loading}
        />
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.overDuePayments > 0) && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul role="list" className="list-disc space-y-1 pl-5">
                  {stats.lowStockProducts > 0 && (
                    <li>{stats.lowStockProducts} products are running low on stock</li>
                  )}
                  {stats.overDuePayments > 0 && (
                    <li>{stats.overDuePayments} payments are overdue</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-5">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {recentActivity.map((activity) => (
                      <li key={activity.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              activity.type === 'sale' ? 'bg-green-100' :
                              activity.type === 'inventory' ? 'bg-yellow-100' :
                              'bg-blue-100'
                            }`}>
                              {activity.type === 'sale' && <CurrencyDollarIcon className="h-4 w-4 text-green-600" />}
                              {activity.type === 'inventory' && <ShoppingBagIcon className="h-4 w-4 text-yellow-600" />}
                              {activity.type === 'employee' && <UsersIcon className="h-4 w-4 text-blue-600" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(activity.timestamp).toLocaleTimeString()}
                              {activity.amount && ` • ${formatCurrency(activity.amount)}`}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Business Overview</h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Sales (All Time)</span>
                <span className="text-lg font-medium text-gray-900">
                  {loading ? (
                    <div className="animate-pulse h-5 bg-gray-200 rounded w-16"></div>
                  ) : (
                    formatCurrency(stats.totalSales)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Low Stock Alert</span>
                <span className={`text-lg font-medium ${stats.lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {loading ? (
                    <div className="animate-pulse h-5 bg-gray-200 rounded w-8"></div>
                  ) : (
                    stats.lowStockProducts
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Employee Attendance</span>
                <span className="text-lg font-medium text-gray-900">
                  {loading ? (
                    <div className="animate-pulse h-5 bg-gray-200 rounded w-12"></div>
                  ) : (
                    `${((stats.activeEmployees / Math.max(stats.totalEmployees, 1)) * 100).toFixed(0)}%`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage