import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import reservationsService from '../services/reservationsService';

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [reservations, setReservations] = useState({
    upcoming: [],
    pending: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const upcomingRes = await reservationsService.getAll(1, 100, 'approved');
        const pendingRes = await reservationsService.getAll(1, 100, 'pending');
        const pastRes = await reservationsService.getAll(1, 100, 'completed');

        setReservations({
          upcoming: upcomingRes.data?.reservations || [],
          pending: pendingRes.data?.reservations || [],
          past: pastRes.data?.reservations || [],
        });
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

    fetchReservations();
  }, [isAuthenticated, navigate]);

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
            <p className="text-neutral-600">Loading reservations...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = ['upcoming', 'pending', 'past'];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-neutral-600 hover:text-neutral-900">
              Dashboard
            </Link>
            <Link to="/facilities" className="text-neutral-600 hover:text-neutral-900">
              Facilities
            </Link>
            <Link to="/new-reservation" className="text-neutral-600 hover:text-neutral-900">
              New Booking
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900">My Reservations</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {error && (
          <Card className="mb-8 p-4 bg-error bg-opacity-10 border border-error border-opacity-30">
            <p className="text-error text-sm">{error}</p>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-8 border-b-2 border-neutral-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold capitalize transition ${
                activeTab === tab
                  ? 'text-primary-500 border-b-4 border-primary-500'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'upcoming' ? 'Upcoming' : tab === 'pending' ? 'Pending' : 'Past'}
            </button>
          ))}
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {reservations[activeTab].length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-neutral-600 mb-4">No {activeTab} reservations</p>
              <Link to="/new-reservation">
                <Button variant="primary">Create New Reservation</Button>
              </Link>
            </Card>
          ) : (
            reservations[activeTab].map((res) => (
              <Card key={res.id} hoverable>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">🏛️</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 text-lg">
                        {res.facility_name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {new Date(res.start_date).toLocaleDateString()} |{' '}
                        {res.start_time} - {res.end_time}
                      </p>
                      {res.attendees && (
                        <p className="text-xs text-neutral-500 mt-1">Attendees: {res.attendees}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        res.status === 'approved'
                          ? 'approved'
                          : res.status === 'pending'
                            ? 'pending'
                            : 'neutral'
                      }
                    >
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </Badge>

                    <div className="flex gap-2">
                      <Link to={`/reservations/${res.id}`}>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
                      {activeTab !== 'past' && (
                        <Button variant="danger" size="sm">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
