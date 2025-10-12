import i18n from '@/i18n'

// Helper function to get translations
const t = (key: string, params?: Record<string, any>) => {
  let message = i18n.global.t(key)
  if (params) {
    Object.keys(params).forEach(param => {
      message = message.replace(`{${param}}`, params[param])
    })
  }
  return message
}

// Validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{7,15}$/,
  name: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
  roleName: /^[a-zA-Z\u0600-\u06FF\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).+$/
}

// Validation limits
const limits = {
  name: { min: 2, max: 100 },
  email: { max: 100 },
  phone: { min: 7, max: 15 },
  password: { min: 8, max: 25 },
  roleName: { min: 2, max: 100 }
}

// Validation functions
export const validate = {
  required: (value: any) => !value ? t('validation.required', { field: 'Field' }) : null,
  
  email: (value: string) => {
    if (!value) return t('validation.email.required')
    if (value.length > limits.email.max) return t('validation.email.maxLength')
    if (!patterns.email.test(value)) return t('validation.email.invalid')
    return null
  },
  
  name: (value: string) => {
    if (!value) return t('validation.name.required')
    if (value.length < limits.name.min) return t('validation.name.minLength')
    if (value.length > limits.name.max) return t('validation.name.maxLength')
    if (!patterns.name.test(value)) return t('validation.name.invalid')
    return null
  },
  
  phone: (value: string) => {
    if (!value) return t('validation.phone.required')
    const cleanPhone = value.replace(/\D/g, '')
    if (cleanPhone.length < limits.phone.min || cleanPhone.length > limits.phone.max) {
      return t('validation.phone.invalid')
    }
    if (!patterns.phone.test(cleanPhone)) return t('validation.phone.invalid')
    return null
  },
  
  password: (value: string) => {
    if (!value) return t('validation.password.required')
    if (value.length < limits.password.min) return t('validation.password.minLength')
    if (value.length > limits.password.max) return t('validation.password.maxLength')
    if (!patterns.password.test(value)) return t('validation.password.pattern')
    return null
  },
  
  confirmPassword: (value: string, originalPassword: string) => {
    if (!value) return t('validation.confirmPassword.required')
    if (value !== originalPassword) return t('validation.confirmPassword.mismatch')
    return null
  },
  
  role: (value: any) => !value ? t('validation.role.required') : null,
  
  status: (value: any) => !value ? t('validation.status.required') : null,
  
  roleName: (value: string) => {
    if (!value) return t('validation.roleName.required')
    if (value.length < limits.roleName.min) return t('validation.roleName.minLength')
    if (value.length > limits.roleName.max) return t('validation.roleName.maxLength')
    if (!patterns.roleName.test(value)) return t('validation.roleName.invalid')
    return null
  },
  
  permissions: (value: any[]) => {
    if (!value || value.length === 0) return t('validation.permissions.required')
    return null
  }
}

// Create validation rules for Element Plus forms
export const createRules = {
  name: () => [
    { validator: (_rule: any, value: string, callback: Function) => {
      const error = validate.name(value)
      callback(error ? new Error(error) : undefined)
    }, trigger: 'blur' }
  ],
  
  email: () => [
    { required: true, message: t('validation.email.required'), trigger: 'blur' },
    { max: limits.email.max, message: t('validation.email.maxLength'), trigger: 'blur' },
    { pattern: patterns.email, message: t('validation.email.invalid'), trigger: 'blur' }
  ],
  
  phone: () => [
    { validator: (_rule: any, value: string, callback: Function) => {
      const error = validate.phone(value)
      callback(error ? new Error(error) : undefined)
    }, trigger: 'blur' }
  ],
  
  password: () => [
    { validator: (_rule: any, value: string, callback: Function) => {
      const error = validate.password(value)
      callback(error ? new Error(error) : undefined)
    }, trigger: 'blur' }
  ],
  
  confirmPassword: (originalPassword: () => string) => [
    { validator: (_rule: any, value: string, callback: Function) => {
      const error = validate.confirmPassword(value, originalPassword())
      callback(error ? new Error(error) : undefined)
    }, trigger: 'blur' }
  ],
  
  role: () => [
    { validator: (_rule: any, value: any, callback: Function) => {
      const error = validate.role(value)
      callback(error ? new Error(error) : undefined)
    }, trigger: 'change' }
  ],
  
  status: () => [
    { validator: (_rule: any, value: any, callback: Function) => {
      const error = validate.status(value)
      callback(error ? new Error(error) : undefined)
    }, trigger: 'change' }
  ],
  
  roleName: () => [
    { validator: (_rule: any, value: string, callback: Function) => {
      const error = validate.roleName(value)
      callback(error ? new Error(error) : undefined)
    }, trigger: 'blur' }
  ],
  
  permissions: () => [
    { validator: (_rule: any, value: any[], callback: Function) => {
      const error = validate.permissions(value)
      callback(error ? new Error(error) : undefined)
    }, trigger: 'change' }
  ]
}
