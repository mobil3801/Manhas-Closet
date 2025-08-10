import { Link } from 'react-router-dom'
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline'

const EmployeesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your team and attendance</p>
        </div>
        <Link
          to="/employees/list"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Employee
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/employees/list"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <UsersIcon className="h-8 w-8 text-indigo-600 mb-3" />
          <h3 className="font-medium text-gray-900">Employee List</h3>
          <p className="text-sm text-gray-500">Manage all employees</p>
        </Link>

        <Link
          to="/employees/attendance"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <UsersIcon className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-medium text-gray-900">Attendance</h3>
          <p className="text-sm text-gray-500">Track attendance</p>
        </Link>

        <Link
          to="/payroll"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <UsersIcon className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-medium text-gray-900">Payroll</h3>
          <p className="text-sm text-gray-500">Manage salaries</p>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first employee.</p>
        </div>
      </div>
    </div>
  )
}

export default EmployeesPage