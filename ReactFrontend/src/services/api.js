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

export default api
