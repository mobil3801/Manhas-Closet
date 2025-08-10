import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const EmployeeListPage = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Employee List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first employee.</p>
        </div>
      </div>
    </div>
  )
}

export default EmployeeListPage