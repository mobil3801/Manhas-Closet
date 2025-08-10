import { Link } from 'react-router-dom'
import { ChartBarIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline'

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">View business insights and analytics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/reports/sales"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <ChartBarIcon className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-medium text-gray-900">Sales Reports</h3>
          <p className="text-sm text-gray-500">Track sales performance</p>
        </Link>

        <Link
          to="/reports/inventory"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <DocumentChartBarIcon className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-medium text-gray-900">Inventory Reports</h3>
          <p className="text-sm text-gray-500">Analyze inventory data</p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow">
          <ChartBarIcon className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-medium text-gray-900">Financial Reports</h3>
          <p className="text-sm text-gray-500">Coming soon</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports available</h3>
          <p className="mt-1 text-sm text-gray-500">Reports will be generated based on your data.</p>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage