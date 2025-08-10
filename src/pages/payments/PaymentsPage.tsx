import { Link } from 'react-router-dom'
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline'

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">Track all payment transactions</p>
        </div>
        <Link
          to="/payments/cash-register"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <BanknotesIcon className="h-4 w-4 mr-2" />
          Cash Register
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payments yet</h3>
          <p className="mt-1 text-sm text-gray-500">Payment transactions will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentsPage