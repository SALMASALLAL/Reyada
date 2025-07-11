import React from 'react'

const Input = ({ 
  label, 
  name, 
  type = 'text', 
  register, 
  error, 
  placeholder, 
  accept,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        accept={accept}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        {...register}
        {...props}
      />
      {error && <p className="error-text">{error.message}</p>}
    </div>
  )
}

export default Input
