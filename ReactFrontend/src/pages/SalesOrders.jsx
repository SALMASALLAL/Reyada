import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { bitrixAPI } from '../services/api'

// Modal component for creating tasks
const CreateTaskModal = ({ isOpen, onClose, deal, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    taxRegistration: '',
    contract: false,
    markAsPaid: false
  })
  const [loading, setLoading] = useState(false)

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
      toast.error('Task title is required')
      return
    }

    setLoading(true)
    try {
      // Create task
      const taskData = {
        title: formData.title,
        dealId: deal.ID,
        taxRegistration: formData.taxRegistration,
        contract: formData.contract
      }
      
      await bitrixAPI.createTask(taskData)
      toast.success('Task created successfully!')

      // Mark as paid if requested
      if (formData.markAsPaid) {
        await bitrixAPI.markDealAsPaid(deal.ID)
        toast.success('Deal marked as paid!')
      }

      // Reset form and close modal
      setFormData({
        title: '',
        taxRegistration: '',
        contract: false,
        markAsPaid: false
      })
      
      onTaskCreated()
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error(error.message || 'Failed to create task')
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
            Create Task for Deal: {deal?.TITLE}
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
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
              required
            />
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
              placeholder="Enter tax registration details"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="contract"
                checked={formData.contract}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Contract Status</span>
            </label>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="markAsPaid"
                checked={formData.markAsPaid}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Mark as Paid</span>
            </label>
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
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Deal Card component
const DealCard = ({ deal, onCreateTask }) => {
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

      <button
        onClick={() => onCreateTask(deal)}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Create Task
      </button>
    </div>
  )
}

// Main SalesOrders component
const SalesOrders = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleCreateTask = (deal) => {
    setSelectedDeal(deal)
    setIsModalOpen(true)
  }

  const handleTaskCreated = () => {
    // Refresh deals to update any status changes
    fetchDeals()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDeal(null)
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
          <button
            onClick={fetchDeals}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sales Orders Found</h3>
          <p className="text-gray-600">
            There are no deals waiting for payment at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.ID}
              deal={deal}
              onCreateTask={handleCreateTask}
            />
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        deal={selectedDeal}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  )
}

export default SalesOrders
