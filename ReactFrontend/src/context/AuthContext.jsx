import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error parsing user data:', error)
          logout()
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.login(email, password)
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
      
      // Get user profile after login
      const profileData = await authAPI.getProfile()
      localStorage.setItem('user', JSON.stringify(profileData))
      
      setUser(profileData)
      setIsAuthenticated(true)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
      return { success: false, error: error.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      
      // Create FormData if profile_image is included
      let formData
      if (userData.profile_image && userData.profile_image[0]) {
        formData = new FormData()
        formData.append('first_name', userData.first_name)
        formData.append('last_name', userData.last_name)
        formData.append('email', userData.email)
        formData.append('password', userData.password)
        formData.append('password_confirm', userData.password_confirm)
        formData.append('profile_image', userData.profile_image[0])
      } else {
        formData = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          password_confirm: userData.password_confirm
        }
      }
      
      const response = await authAPI.register(formData)
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.tokens.access)
      localStorage.setItem('refresh_token', response.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.message || 'Registration failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authAPI.logout()
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if API call fails
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true)
      const response = await authAPI.updateProfile(profileData)
      
      // Update local user data
      const updatedUser = { ...user, ...response.user }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast.success('Profile updated successfully!')
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = error.message || 'Failed to update profile'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const refreshUserProfile = async () => {
    try {
      const profileData = await authAPI.getProfile()
      localStorage.setItem('user', JSON.stringify(profileData))
      setUser(profileData)
      return profileData
    } catch (error) {
      console.error('Error refreshing profile:', error)
      return null
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    refreshUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
