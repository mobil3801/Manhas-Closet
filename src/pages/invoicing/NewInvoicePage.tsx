import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const NewInvoicePage = () => {
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    items: [{ product_id: '', quantity: 1, unit_price: 0, total: 0 }],
    notes: ''
  })

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { product_id: '', quantity: 1, unit_price: 0, total: 0 }]
    })
  }

  const removeItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index)
    setInvoice({ ...invoice, items: newItems })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...invoice.items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price
    }
    setInvoice({ ...invoice, items: newItems })
  }

  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.15 // 15% tax
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/invoicing')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Save Invoice
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
            <input
              type="text"
              required
              value={invoice.customer_name}
              onChange={(e) => setInvoice({ ...invoice, customer_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={invoice.customer_phone}
              onChange={(e) => setInvoice({ ...invoice, customer_phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={invoice.customer_email}
              onChange={(e) => setInvoice({ ...invoice, customer_email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              rows={2}
              value={invoice.customer_address}
              onChange={(e) => setInvoice({ ...invoice, customer_address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
          <button
            onClick={addItem}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Product</option>
                      <option value="1">Sample Product 1</option>
                      <option value="2">Sample Product 2</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ৳{item.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-900"
                      disabled={invoice.items.length === 1}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium">৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax (15%):</span>
              <span className="text-sm font-medium">৳{tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-base font-medium">Total:</span>
              <span className="text-base font-bold">৳{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
        <textarea
          rows={3}
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add any additional notes here..."
        />
      </div>
    </div>
  )
}

export default NewInvoicePage