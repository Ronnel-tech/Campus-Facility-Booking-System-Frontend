import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Access Denied</h1>
        <p className="text-neutral-600 mb-8">
          You do not have permission to access this resource. Please contact an administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
