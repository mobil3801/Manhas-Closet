import { BanknotesIcon } from '@heroicons/react/24/outline'

const SalaryManagementPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
        <p className="mt-1 text-sm text-gray-500">Process and manage employee salaries</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No salary records</h3>
          <p className="mt-1 text-sm text-gray-500">Salary processing will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default SalaryManagementPage