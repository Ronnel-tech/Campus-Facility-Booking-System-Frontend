import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import { formatLabel } from '../lib/utils';
import apiService from '../services/apiService';

export default function AdminReservationsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState('pending');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = status === 'all' ? '' : `&status=${status}`;
      const response = await apiService.get(`/admin/reservations?page=1&limit=100${query}`);
      const data = Array.isArray(response.data) ? response.data : response.data?.data;
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 401) navigate('/login');
      else if (err.status === 403) navigate('/unauthorized');
      else setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/unauthorized');
      return;
    }
    fetchReservations();
  }, [isAuthenticated, user, navigate, status]);

  const updateReservation = async (id, action) => {
    try {
      setProcessingId(id);
      setError(null);
      await apiService.post(`/admin/reservations/${id}/${action}`, action === 'reject' ? { remarks: '' } : {});
      await fetchReservations();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Admin Panel</h1>
          <Link to="/admin" className="text-neutral-600 hover:text-neutral-900">Back to Admin</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Reservation Requests</h2>
            <p className="text-neutral-600">Review and manage facility and asset reservations</p>
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="px-4 py-2 border-2 border-neutral-200 rounded-lg"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All Statuses</option>
          </select>
        </div>

        {error && <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-error">{error}</div>}

        <Card>
          {loading ? (
            <p className="p-8 text-center text-neutral-600">Loading reservations...</p>
          ) : reservations.length === 0 ? (
            <p className="p-8 text-center text-neutral-600">No reservations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Requester</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Resource</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4">
                        {reservation.user?.username || reservation.user?.email || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        {reservation.facility?.name || reservation.asset?.name || 'Reservation'}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {reservation.start_date ? new Date(reservation.start_date).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={reservation.status === 'approved' ? 'approved' : reservation.status === 'rejected' ? 'rejected' : 'pending'}>
                          {formatLabel(reservation.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {reservation.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="primary" disabled={processingId === reservation.id} onClick={() => updateReservation(reservation.id, 'approve')}>Approve</Button>
                            <Button size="sm" variant="secondary" disabled={processingId === reservation.id} onClick={() => updateReservation(reservation.id, 'reject')}>Reject</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
