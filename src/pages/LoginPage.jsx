import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-neutral-900">Sign In</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-neutral-300"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-neutral-600">
                Remember me
              </label>
            </div>

            {error && <p className="text-error text-sm">{error}</p>}

            <Button variant="primary" size="full" type="submit">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#forgot" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="w-1/2 bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">🏛️</div>
          <h2 className="text-2xl font-bold text-primary-500">Facility Booking</h2>
        </div>
      </div>
    </div>
  );
}
