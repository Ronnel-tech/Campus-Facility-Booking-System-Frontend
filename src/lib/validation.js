/**
 * Form Validation Utilities
 * - Input sanitization
 * - Data validation
 * - Error message formatting
 */

// Sanitize string to prevent XSS
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000);
};

// Email validation
export const validateEmail = (email) => {
  const sanitized = sanitizeString(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized);
};

// Password validation - min 8 chars, uppercase, lowercase, number
export const validatePassword = (password) => {
  if (typeof password !== 'string') return false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Username validation - 3-20 alphanumeric + underscore
export const validateUsername = (username) => {
  const sanitized = sanitizeString(username).toLowerCase();
  const usernameRegex = /^[a-z0-9_]{3,20}$/;
  return usernameRegex.test(sanitized);
};

// Phone validation
export const validatePhone = (phone) => {
  const sanitized = sanitizeString(phone).replace(/\D/g, '');
  return sanitized.length >= 10;
};

// Date validation
export const validateDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};

// Time slot validation (HH:MM format)
export const validateTimeSlot = (time) => {
  const sanitized = sanitizeString(time);
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(sanitized);
};

// Number validation with range
export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Form field validator
export const validateField = (fieldName, value, rules = {}) => {
  const sanitized = typeof value === 'string' ? sanitizeString(value) : value;

  const errors = [];

  if (rules.required && (!sanitized || (typeof sanitized === 'string' && sanitized.length === 0))) {
    errors.push(`${fieldName} is required`);
  }

  if (rules.minLength && typeof sanitized === 'string' && sanitized.length < rules.minLength) {
    errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && typeof sanitized === 'string' && sanitized.length > rules.maxLength) {
    errors.push(`${fieldName} must not exceed ${rules.maxLength} characters`);
  }

  if (rules.email && sanitized && !validateEmail(sanitized)) {
    errors.push(`${fieldName} must be a valid email`);
  }

  if (rules.password && sanitized && !validatePassword(sanitized)) {
    errors.push(
      `${fieldName} must be at least 8 characters with uppercase, lowercase, and numbers`
    );
  }

  if (rules.username && sanitized && !validateUsername(sanitized)) {
    errors.push(`${fieldName} must be 3-20 characters, alphanumeric and underscores only`);
  }

  if (rules.phone && sanitized && !validatePhone(sanitized)) {
    errors.push(`${fieldName} must be a valid phone number`);
  }

  if (rules.match && value !== rules.match) {
    errors.push(`${fieldName} does not match`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};

// Validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const validation = validateField(fieldName, formData[fieldName], validationRules[fieldName]);
    if (!validation.isValid) {
      errors[fieldName] = validation.errors[0];
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Format error message for display
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && error.message) {
    return error.message;
  }

  if (error && error.details && error.details.errors) {
    const errorList = Array.isArray(error.details.errors)
      ? error.details.errors
      : Object.values(error.details.errors).flat();
    return errorList[0] || 'An error occurred';
  }

  return 'An unexpected error occurred';
};

// Format validation errors for form display
export const formatValidationErrors = (error) => {
  if (!error || !error.details) {
    return {};
  }

  const errors = error.details.errors || {};

  if (Array.isArray(errors)) {
    return { general: errors[0] };
  }

  return errors;
};

export default {
  sanitizeString,
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateDate,
  validateTimeSlot,
  validateNumber,
  validateField,
  validateForm,
  formatErrorMessage,
  formatValidationErrors,
};
