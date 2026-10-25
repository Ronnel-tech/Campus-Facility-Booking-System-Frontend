import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import reservationsService from '../services/reservationsService';

export default function ReservationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      setError('Reservation ID is required');
      setLoading(false);
      return;
    }

    const fetchReservation = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reservationsService.getById(id);
        setReservation(response.data);
      } catch (err) {
        if (err.status === 401) {
          navigate('/login');
        } else if (err.status === 403) {
          navigate('/unauthorized');
        } else if (err.status === 404) {
          setError('Reservation not found');
        } else {
          setError(formatErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, isAuthenticated, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await reservationsService.cancel(id);
      setReservation((prev) => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      setError(formatErrorMessage(err));
    }
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
            <p className="text-neutral-600">Loading reservation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
            <Link to="/reservations" className="text-primary-500 hover:text-primary-600">
              ← Back to Reservations
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Card className="p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-neutral-600 mb-4">{error || 'Reservation not found'}</p>
              <Link to="/reservations">
                <Button variant="primary">Back to Reservations</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const statusVariants = {
    pending: 'pending',
    approved: 'approved',
    confirmed: 'approved',
    rejected: 'error',
    cancelled: 'error',
    completed: 'info',
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <Link to="/reservations" className="text-primary-500 hover:text-primary-600">
            ← Back to Reservations
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {reservation.facility?.name || reservation.asset?.name || 'Reservation'}
              </h1>
              <p className="text-neutral-600">
                Confirmation ID: {reservation.confirmation_id || reservation.confirmationId || `RES-${id}`}
              </p>
            </div>
            <Badge variant={statusVariants[reservation.status] || 'pending'} className="text-lg px-6 py-2">
              {reservation.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Reservation Details */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Reservation Details</h2>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Facility/Asset</p>
              <p className="font-semibold text-neutral-900 text-lg">
                {reservation.facility?.name || reservation.asset?.name || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 mb-1">Type</p>
              <p className="font-semibold text-neutral-900 text-lg">
                {reservation.facility ? 'Facility' : reservation.asset ? 'Asset' : 'Unknown'}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 mb-1">Date & Time</p>
              <p className="font-semibold text-neutral-900 text-lg">
                {new Date(reservation.start_date).toLocaleDateString()} |
                {reservation.start_time} - {reservation.end_time}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-600 mb-1">Purpose</p>
              <p className="font-semibold text-neutral-900 text-lg">{reservation.purpose || 'Not specified'}</p>
            </div>

            {reservation.attendee_count && (
              <div>
                <p className="text-sm text-neutral-600 mb-1">Attendees</p>
                <p className="font-semibold text-neutral-900 text-lg">{reservation.attendee_count}</p>
              </div>
            )}

            {reservation.requester && (
              <div className="col-span-2">
                <p className="text-sm text-neutral-600 mb-1">Requester</p>
                <p className="font-semibold text-neutral-900 text-lg">
                  {reservation.requester.name || reservation.requester.email}
                </p>
              </div>
            )}

            {reservation.status === 'approved' && reservation.approved_by && (
              <div>
                <p className="text-sm text-neutral-600 mb-1">Approved By</p>
                <p className="font-semibold text-neutral-900 text-lg">
                  {reservation.approved_by.name || reservation.approved_by}
                </p>
              </div>
            )}

            {reservation.status === 'approved' && reservation.approved_at && (
              <div>
                <p className="text-sm text-neutral-600 mb-1">Approved On</p>
                <p className="font-semibold text-neutral-900 text-lg">
                  {new Date(reservation.approved_at).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="col-span-2">
              <p className="text-sm text-neutral-600 mb-1">Requested On</p>
              <p className="font-semibold text-neutral-900 text-lg">
                {new Date(reservation.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {reservation.notes && (
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Notes</p>
              <p className="text-neutral-900">{reservation.notes}</p>
            </div>
          )}
        </Card>

        {/* Timeline */}
        {reservation.timeline && reservation.timeline.length > 0 && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Timeline</h2>
            <div className="space-y-4">
              {reservation.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-2xl">{item.icon || '📝'}</div>
                  <div>
                    <p className="font-medium text-neutral-900">{item.status}</p>
                    <p className="text-sm text-neutral-500">{item.date || item.timestamp}</p>
                    {item.by && <p className="text-xs text-neutral-400">By {item.by}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <div className="flex flex-wrap gap-4">
            {reservation.status === 'pending' && (
              <Button variant="secondary" onClick={handleCancel} className="text-error hover:bg-red-50">
                Cancel Request
              </Button>
            )}
            {reservation.status === 'approved' && (
              <Button variant="secondary" onClick={handleCancel} className="text-error hover:bg-red-50">
                Cancel Reservation
              </Button>
            )}
            <Link to="/reservations">
              <Button variant="secondary">Back to Reservations</Button>
            </Link>
          </div>
        </Card>
              </div>
            </div>
          );
        }
