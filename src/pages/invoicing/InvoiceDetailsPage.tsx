import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

const InvoiceDetailsPage = () => {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/invoicing/invoices"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          Download PDF
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Invoice #{id}</h3>
          <p className="mt-2 text-sm text-gray-500">Invoice details will be displayed here</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetailsPage