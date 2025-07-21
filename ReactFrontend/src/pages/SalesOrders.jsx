import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { bitrixAPI } from '../services/api'

// Modal component for creating sales orders
const CreateSalesOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    taxRegistration: '',
    contract: false,
    paid: false
  })
  const [loading, setLoading] = useState(false)

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' },
    { value: 'AED', label: 'AED - UAE Dirham' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Sales order title is required')
      return
    }

    setLoading(true)
    try {
      // Prepare deal data with all fields
      const dealData = {
        title: formData.title,
        amount: parseFloat(formData.amount) || 0,
        currency: formData.currency,
        taxRegistration: formData.taxRegistration,
        contract: formData.contract,
        paid: formData.paid,
        responsibleId: 1 // Default responsible user
      }
      
      // Create the deal
      const dealResult = await bitrixAPI.createDeal(dealData)
      const dealId = dealResult.result || dealResult.ID || dealResult
      
      toast.success('Sales order created successfully!')

      // If marked as paid, create a task for the deal
      if (formData.paid && dealId) {
        try {
          const taskData = {
            title: formData.title,
            dealId: dealId,
            taxRegistration: formData.taxRegistration,
            contract: formData.contract
          }
          
          await bitrixAPI.createTask(taskData)
          toast.success('Task created for the paid order!')
        } catch (taskError) {
          console.error('Error creating task:', taskError)
          toast.error('Deal created but failed to create task')
        }
      }

      // Reset form and close modal
      setFormData({
        title: '',
        amount: '',
        currency: 'USD',
        taxRegistration: '',
        contract: false,
        paid: false
      })
      
      onOrderCreated()
      onClose()
    } catch (error) {
      console.error('Error creating sales order:', error)
      toast.error(error.message || 'Failed to create sales order')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Sales Order
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Sales Order Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter sales order title"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount (optional)"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="taxRegistration" className="block text-sm font-medium text-gray-700 mb-2">
              Tax Registration
            </label>
            <input
              type="text"
              id="taxRegistration"
              name="taxRegistration"
              value={formData.taxRegistration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tax registration number"
            />
          </div>

          <div className="mb-4 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="contract"
                name="contract"
                checked={formData.contract}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="contract" className="ml-2 block text-sm text-gray-700">
                Contract Signed
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="paid"
                name="paid"
                checked={formData.paid}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="paid" className="ml-2 block text-sm text-gray-700">
                <span className="font-medium">Mark as Paid</span>
                <span className="text-gray-500 block text-xs">
                  Will create a task and mark deal as WON
                </span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Sales Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Deal Card component
const DealCard = ({ deal, onRefresh }) => {
  const [isPaid, setIsPaid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleMarkAsPaid = async (checked) => {
    if (!checked) return // Only handle checking, not unchecking

    setIsProcessing(true)
    try {
      // First, update the deal status to "WON"
      await bitrixAPI.markDealAsPaid(deal.ID)
      toast.success('Deal marked as paid successfully!')

      // Then create a task for the paid deal
      const taskData = {
        title: deal.TITLE || `Task for Deal ${deal.ID}`,
        dealId: deal.ID,
        taxRegistration: '', // Default empty since not available in deal data
        contract: false // Default false since not available in deal data
      }
      
      await bitrixAPI.createTask(taskData)
      toast.success('Task created for the paid deal!')
      
      setIsPaid(true)
      
      // Refresh the deals list to reflect the changes
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error marking deal as paid:', error)
      toast.error(error.message || 'Failed to mark deal as paid')
      setIsPaid(false) // Reset if failed
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {deal.TITLE || 'Untitled Deal'}
          </h3>
          <p className="text-sm text-gray-500">ID: {deal.ID}</p>
        </div>
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Waiting for Payment
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(deal.OPPORTUNITY, deal.CURRENCY_ID)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Created:</span>
          <span className="text-sm text-gray-900">
            {formatDate(deal.DATE_CREATE)}
          </span>
        </div>
        {deal.DATE_MODIFY && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Modified:</span>
            <span className="text-sm text-gray-900">
              {formatDate(deal.DATE_MODIFY)}
            </span>
          </div>
        )}
      </div>

      {/* Paid Checkbox */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`paid-${deal.ID}`}
              checked={isPaid}
              onChange={(e) => handleMarkAsPaid(e.target.checked)}
              disabled={isPaid || isProcessing}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor={`paid-${deal.ID}`} className="ml-2 text-sm text-gray-700">
              <span className="font-medium">Mark as Paid</span>
              {isPaid && (
                <span className="ml-2 text-green-600 text-xs">✓ Completed</span>
              )}
            </label>
          </div>
          {isProcessing && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
              Processing...
            </div>
          )}
        </div>
        {isPaid && (
          <p className="text-xs text-green-600 mt-1 ml-6">
            Deal marked as WON and task created
          </p>
        )}
      </div>
    </div>
  )
}

// Main SalesOrders component
const SalesOrders = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await bitrixAPI.getDeals('UC_3MCI1C')
      setDeals(data)
    } catch (err) {
      console.error('Error fetching deals:', err)
      setError('Failed to fetch sales orders. Please try again.')
      toast.error('Failed to fetch sales orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSalesOrder = () => {
    setIsSalesOrderModalOpen(true)
  }

  const handleSalesOrderCreated = () => {
    // Refresh deals to show the new sales order
    fetchDeals()
  }

  const handleCloseSalesOrderModal = () => {
    setIsSalesOrderModalOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sales orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Sales Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDeals}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
            <p className="text-gray-600 mt-1">
              Deals waiting for payment - {deals.length} order(s) found
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateSalesOrder}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Sales Order</span>
            </button>
            <button
              onClick={fetchDeals}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sales Orders Found</h3>
          <p className="text-gray-600 mb-4">
            There are no deals waiting for payment at the moment.
          </p>
          <button
            onClick={handleCreateSalesOrder}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center space-x-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Your First Sales Order</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.ID}
              deal={deal}
              onRefresh={fetchDeals}
            />
          ))}
        </div>
      )}

      <CreateSalesOrderModal
        isOpen={isSalesOrderModalOpen}
        onClose={handleCloseSalesOrderModal}
        onOrderCreated={handleSalesOrderCreated}
      />
    </div>
  )
}

export default SalesOrders
