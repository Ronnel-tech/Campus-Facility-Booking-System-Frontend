import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import apiService from '../services/apiService';
import reservationsService from '../services/reservationsService';
import notificationsService from '../services/notificationsService';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, reservationsRes, notificationsRes] = await Promise.all([
          apiService.get('/users/profile'),
          reservationsService.getAll(1, 5),
          notificationsService.getUnreadCount(),
        ]);

        setUserProfile(profileRes.data || {});
        setReservations(reservationsRes.data?.reservations || []);
        setNotificationsCount(notificationsRes.data?.count || 0);
      } catch (err) {
        if (err.status === 401) {
          navigate('/login');
        } else if (err.status === 403) {
          navigate('/unauthorized');
        } else {
          setError(formatErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Card className="p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-neutral-600 mb-4">{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Retry
                        </Button>
                      </div>
                    </Card>
        </div>
      </div>
    );
  }

  const userName = user?.name || userProfile?.name || user?.email || 'Guest';
  const upcomingReservations = reservations.filter(r => 
    ['pending', 'approved', 'confirmed'].includes(r.status) && 
    new Date(r.end_date) >= new Date()
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <div className="flex gap-4 items-center">
            <Link to="/profile" className="text-neutral-600 hover:text-neutral-900">
              Profile
            </Link>
            <Link to="/facilities" className="text-neutral-600 hover:text-neutral-900">
              Facilities
            </Link>
            <Link to="/assets" className="text-neutral-600 hover:text-neutral-900">
              Assets
            </Link>
            {notificationsCount > 0 && (
              <Link to="/notifications" className="relative text-neutral-600 hover:text-neutral-900">
                🔔 <span className="absolute -top-2 -right-2 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notificationsCount}</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-neutral-600 hover:text-neutral-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back, {userName}!</h2>
          <p className="text-neutral-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Link to="/facilities" className="block">
            <Card className="text-center hover:bg-primary-50 transition-colors">
              <div className="text-4xl mb-3">🏛️</div>
              <div className="text-xl font-bold text-neutral-900 mb-1">Browse Facilities</div>
              <div className="text-sm font-medium text-neutral-600">Find available spaces</div>
            </Card>
          </Link>

          <Link to="/assets" className="block">
            <Card className="text-center hover:bg-primary-50 transition-colors">
              <div className="text-4xl mb-3">📦</div>
              <div className="text-xl font-bold text-neutral-900 mb-1">Browse Assets</div>
              <div className="text-sm font-medium text-neutral-600">Check equipment</div>
            </Card>
          </Link>

          <Link to="/new-reservation" className="block">
            <Card className="text-center hover:bg-primary-50 transition-colors">
              <div className="text-4xl mb-3">📅</div>
              <div className="text-xl font-bold text-neutral-900 mb-1">New Reservation</div>
              <div className="text-sm font-medium text-neutral-600">Book a facility</div>
            </Card>
          </Link>

          <Link to="/reservations" className="block">
            <Card className="text-center hover:bg-primary-50 transition-colors">
              <div className="text-4xl mb-3">📋</div>
              <div className="text-xl font-bold text-neutral-900 mb-1">My Reservations</div>
              <div className="text-sm font-medium text-neutral-600">View all bookings</div>
            </Card>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Upcoming Reservations */}
          <div className="col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Your Upcoming Reservations</h3>
                <Link
                  to="/reservations"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {upcomingReservations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingReservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">🏛️</div>
                        <div>
                          <h4 className="font-semibold text-neutral-900">{res.facility_name || res.facility?.name || 'Facility'}</h4>
                          <p className="text-sm text-neutral-600">
                            {new Date(res.start_date).toLocaleDateString()} |{' '}
                            {res.start_time} - {res.end_time}
                          </p>
                          {res.attendees && (
                            <p className="text-xs text-neutral-500 mt-1">Attendees: {res.attendees}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={res.status === 'approved' ? 'approved' : 'pending'}>
                          {res.status}
                        </Badge>
                        <Link
                          to={`/reservations/${res.id}`}
                          className="text-primary-500 hover:text-primary-600 text-sm"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-600">
                  <p>No upcoming reservations</p>
                  <Link to="/new-reservation" className="mt-4 inline-block">
                    <Button variant="primary" size="sm">Create One</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Notifications & Quick Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Reservations</span>
                  <span className="font-semibold text-neutral-900">{reservations.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Upcoming</span>
                  <span className="font-semibold text-primary-500">{upcomingReservations.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Unread Notifications</span>
                  <span className="font-semibold text-warning">{notificationsCount}</span>
                </div>
              </div>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900">Recent Notifications</h3>
                <Link
                  to="/notifications"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                <p className="text-center text-neutral-600 text-sm py-4">
                  No recent notifications
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
