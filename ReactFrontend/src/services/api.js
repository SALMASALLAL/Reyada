import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:8000/api/auth'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
    }

    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login/', { email, password })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' }
    }
  },

  register: async (userData) => {
    try {
      const isFormData = userData instanceof FormData
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : {}
      
      const response = await api.post('/users/', userData, config)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' }
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await api.post('/users/logout/', { refresh: refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile/')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' }
    }
  },

  updateProfile: async (profileData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData()
      
      // Add text fields
      if (profileData.first_name) formData.append('first_name', profileData.first_name)
      if (profileData.last_name) formData.append('last_name', profileData.last_name)
      if (profileData.bio) formData.append('bio', profileData.bio)
      if (profileData.phone) formData.append('phone', profileData.phone)
      if (profileData.birth_date) formData.append('birth_date', profileData.birth_date)
      
      // Add file if present
      if (profileData.profile_image && profileData.profile_image instanceof File) {
        formData.append('profile_image', profileData.profile_image)
      }

      const response = await api.patch('/users/update_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' }
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change_password/', passwordData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' }
    }
  }
}

// Create a separate axios instance for Bitrix API calls
const bitrixApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to bitrixApi for auth token
bitrixApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to bitrixApi for token refresh
bitrixApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return bitrixApi(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
    }

    return Promise.reject(error)
  }
)

// Create a direct axios instance for Bitrix24 API calls (bypassing Django backend)
const bitrix24DirectApi = axios.create({
  baseURL: 'https://b24-0r8mng.bitrix24.com/rest/1/iolappou7w3kdu2w',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Bitrix API calls
export const bitrixAPI = {
  getContacts: async () => {
    try {
      const response = await bitrixApi.get('/bitrix-contacts/')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch Bitrix contacts' }
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await bitrixApi.post('/bitrix-contacts/', contactData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create contact' }
    }
  },

  // Sales Orders / Deals API
  getDeals: async (stageId = 'UC_3MCI1C') => {
    try {
      const response = await bitrix24DirectApi.get('/crm.deal.list', {
        params: {
          'filter[STAGE_ID]': stageId,
          'select': ['ID', 'TITLE', 'STAGE_ID', 'OPPORTUNITY', 'CURRENCY_ID', 'CONTACT_ID', 'COMPANY_ID', 'DATE_CREATE', 'DATE_MODIFY']
        }
      })
      return response.data.result || []
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch deals' }
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await bitrix24DirectApi.post('/tasks.task.add', {
        fields: {
          TITLE: taskData.title,
          UF_CRM_TASK: [`D_${taskData.dealId}`],
          UF_CRM_TAX: taskData.taxRegistration,
          UF_CRM_CONTRACT: taskData.contract ? 'Y' : 'N',
          RESPONSIBLE_ID: 1, // Default responsible user
          DESCRIPTION: `Task created for deal: ${taskData.dealId}`
        }
      })
      return response.data.result || {}
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create task' }
    }
  },

  updateDeal: async (dealId, updateData) => {
    try {
      const response = await bitrix24DirectApi.post('/crm.deal.update', {
        id: dealId,
        fields: updateData
      })
      return response.data.result || {}
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update deal' }
    }
  },

  markDealAsPaid: async (dealId) => {
    try {
      return await bitrixAPI.updateDeal(dealId, { STAGE_ID: 'WON' })
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark deal as paid' }
    }
  },

  createDeal: async (dealData) => {
    try {
      // Determine stage based on paid status
      const stageId = dealData.paid ? 'WON' : 'UC_3MCI1C'
      
      const response = await bitrix24DirectApi.post('/crm.deal.add', {
        fields: {
          TITLE: dealData.title,
          STAGE_ID: stageId, // 'WON' if paid, otherwise 'UC_3MCI1C' (Waiting for payment)
          OPPORTUNITY: dealData.amount,
          CURRENCY_ID: dealData.currency || 'USD',
          RESPONSIBLE_ID: dealData.responsibleId || 1, // Default responsible user
          CONTACT_ID: dealData.contactId || null, // Optional contact
          COMPANY_ID: dealData.companyId || null, // Optional company
          CATEGORY_ID: dealData.categoryId || 0, // Default category
          UF_CRM_TAX: dealData.taxRegistration || '', // Custom field for tax registration
          UF_CRM_CONTRACT: dealData.contract ? 'Y' : 'N', // Custom field for contract status
          COMMENTS: dealData.comments || `Sales order created: ${dealData.title}`
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create deal' }
    }
  }
}

export default api
