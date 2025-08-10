import { Link } from 'react-router-dom'
import { BanknotesIcon, CalculatorIcon } from '@heroicons/react/24/outline'

const PayrollPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage employee salaries and payroll</p>
        </div>
        <Link
          to="/payroll/salaries"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <CalculatorIcon className="h-4 w-4 mr-2" />
          Process Payroll
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payroll records</h3>
          <p className="mt-1 text-sm text-gray-500">Payroll processing will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default PayrollPage