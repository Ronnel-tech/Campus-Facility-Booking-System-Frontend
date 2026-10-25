import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage, validateEmail } from '../lib/validation';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 1) {
      errors.password = 'Password is required';
    }

    return errors;
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
      await login({
        email: email.toLowerCase().trim(),
        password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(formatErrorMessage(err));
      if (err.status === 401) {
        setError('Invalid email or password. Please try again.');
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
          <h1 className="text-4xl font-bold mb-2 text-neutral-900">Sign In</h1>
          <p className="text-neutral-600 mb-8">Welcome back to Campus Facility Booking</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors({ ...fieldErrors, email: '' });
                }}
                error={fieldErrors.email}
                required
              />
            </div>
            
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors({ ...fieldErrors, password: '' });
                }}
                error={fieldErrors.password}
                required
              />
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
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-neutral-600">
            <p>Don't have an account? <a href="/register" className="text-primary-500 hover:text-primary-600 font-medium">Create one</a></p>
          </div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="w-1/2 bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">🏛️</div>
          <h2 className="text-2xl font-bold text-primary-500">Facility Booking</h2>
          <p className="text-neutral-600 mt-2">Manage campus facilities efficiently</p>
        </div>
      </div>
    </div>
  );
}
