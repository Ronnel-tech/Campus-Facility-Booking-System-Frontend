import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import {
  formatErrorMessage,
  validateEmail,
  validatePassword,
  validateUsername,
} from '../lib/validation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      errors.username = 'Username must be 3-20 characters, alphanumeric and underscores only';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password =
        'Password must be at least 8 characters with uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    const validRoles = ['student', 'faculty', 'staff'];
    if (!validRoles.includes(formData.role)) {
      errors.role = 'Invalid role selected';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email.toLowerCase().trim(),
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role,
      });
      navigate('/login', {
        state: { message: 'Account created. Sign in to continue.' },
      });
    } catch (err) {
      setError(formatErrorMessage(err));
      if (err.details?.errors) {
        if (Array.isArray(err.details.errors)) {
          const firstError = err.details.errors[0] || err.message;
          setError(firstError);
        } else if (typeof err.details.errors === 'object') {
          const errorEntries = Object.entries(err.details.errors);
          if (errorEntries.length > 0) {
            const [field, message] = errorEntries[0];
            setFieldErrors((prev) => ({
              ...prev,
              [field]: Array.isArray(message) ? message[0] : message,
            }));
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2 text-neutral-900">Create Account</h1>
          <p className="text-neutral-600 mb-8">Join Campus Facility Booking System</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Username"
                type="text"
                placeholder="your_username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={fieldErrors.username}
                required
              />
            </div>

            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@school.edu"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
                required
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars, uppercase, lowercase, number"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                required
              />
            </div>

            <div>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={fieldErrors.confirmPassword}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
              </select>
              {fieldErrors.role && <p className="text-error text-sm mt-1">{fieldErrors.role}</p>}
            </div>

            {error && (
              <div className="p-4 bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            <Button
              variant="primary"
              size="full"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-neutral-600">
            <p>
              Already have an account?{' '}
              <a href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="w-1/2 bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-primary-500">Get Started</h2>
          <p className="text-neutral-600 mt-2">Manage your facility bookings</p>
        </div>
      </div>
    </div>
  );
}
