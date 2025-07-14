import { useState } from 'react'
import { bitrixAPI } from '../services/api'
import toast from 'react-hot-toast'

const ContactForm = ({ onContactCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'First name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await bitrixAPI.createContact(formData)
      toast.success('Contact added and synced with Bitrix24!')
      
      // Reset form
      setFormData({
        name: '',
        last_name: '',
        email: '',
        phone: ''
      })
      
      // Notify parent component
      if (onContactCreated) {
        onContactCreated()
      }
    } catch (error) {
      console.error('Error creating contact:', error)
      
      // Handle validation errors from backend
      if (error.email) {
        setErrors({ email: error.email[0] || 'Email already exists' })
        toast.error('A contact with this email already exists')
      } else {
        toast.error(error.message || 'Failed to create contact')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Add New Contact</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter first name"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter last name"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter email address"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter phone number"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Contact'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
