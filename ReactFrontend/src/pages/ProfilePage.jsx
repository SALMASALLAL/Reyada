import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import toast from 'react-hot-toast'

const profileSchema = yup.object({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  bio: yup.string(),
  phone: yup.string(),
  birth_date: yup.string()
})

const passwordSchema = yup.object({
  old_password: yup.string().required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters'),
  new_password_confirm: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('new_password')], 'Passwords must match')
})

const ProfilePage = () => {
  const { user, updateUserProfile, refreshUserProfile, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    reset: resetProfile,
    setValue
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      bio: user?.profile?.bio || '',
      phone: user?.profile?.phone || '',
      birth_date: user?.profile?.birth_date || ''
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPassword
  } = useForm({
    resolver: yupResolver(passwordSchema)
  })

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setValue('first_name', user.first_name || '')
      setValue('last_name', user.last_name || '')
      setValue('bio', user.profile?.bio || '')
      setValue('phone', user.profile?.phone || '')
      setValue('birth_date', user.profile?.birth_date || '')
    }
  }, [user, setValue])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const onSubmitProfile = async (data) => {
    const formData = {
      ...data,
      profile_image: selectedFile
    }

    const result = await updateUserProfile(formData)
    if (result.success) {
      setIsEditing(false)
      setPreviewImage(null)
      setSelectedFile(null)
      await refreshUserProfile()
    }
  }

  const onSubmitPassword = async (data) => {
    try {
      const { authAPI } = await import('../services/api')
      await authAPI.changePassword(data)
      toast.success('Password changed successfully!')
      setShowPasswordForm(false)
      resetPassword()
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString()
  }

  const getProfileImageUrl = () => {
    if (previewImage) return previewImage
    if (user?.profile?.profile_image) {
      // If it's a relative URL, prepend the base URL
      if (user.profile.profile_image.startsWith('/')) {
        return `http://localhost:8000${user.profile.profile_image}`
      }
      return user.profile.profile_image
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="relative inline-block">
                {getProfileImageUrl() ? (
                  <img
                    src={getProfileImageUrl()}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mx-auto border-4 border-gray-200">
                    <span className="text-gray-600 text-2xl font-bold">
                      {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mt-4">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Member since {formatDate(user?.date_joined)}
              </p>
              
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full btn-primary"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full btn-secondary"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details & Edit Form */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h3>
              
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="first_name"
                    register={registerProfile('first_name')}
                    error={profileErrors.first_name}
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    register={registerProfile('last_name')}
                    error={profileErrors.last_name}
                  />
                </div>

                <Input
                  label="Phone"
                  name="phone"
                  register={registerProfile('phone')}
                  error={profileErrors.phone}
                  placeholder="e.g., +1 (555) 123-4567"
                />

                <Input
                  label="Birth Date"
                  name="birth_date"
                  type="date"
                  register={registerProfile('birth_date')}
                  error={profileErrors.birth_date}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    {...registerProfile('bio')}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="input-field resize-none"
                  />
                  {profileErrors.bio && <p className="error-text">{profileErrors.bio.message}</p>}
                </div>

                <Input
                  label="Profile Image"
                  name="profile_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setPreviewImage(null)
                      setSelectedFile(null)
                      resetProfile()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-gray-900">{user?.first_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-gray-900">{user?.last_name || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{user?.profile?.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                  <p className="mt-1 text-gray-900">{formatDate(user?.profile?.birth_date)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <p className="mt-1 text-gray-900">{user?.profile?.bio || 'No bio provided'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Password Change Form */}
          {showPasswordForm && (
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
              
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                <Input
                  label="Current Password"
                  name="old_password"
                  type="password"
                  register={registerPassword('old_password')}
                  error={passwordErrors.old_password}
                />

                <Input
                  label="New Password"
                  name="new_password"
                  type="password"
                  register={registerPassword('new_password')}
                  error={passwordErrors.new_password}
                />

                <Input
                  label="Confirm New Password"
                  name="new_password_confirm"
                  type="password"
                  register={registerPassword('new_password_confirm')}
                  error={passwordErrors.new_password_confirm}
                />

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={passwordSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordSubmitting ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      resetPassword()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
