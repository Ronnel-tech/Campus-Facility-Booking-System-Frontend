import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import apiService from '../services/apiService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [stats, setStats] = useState({});
  const [pendingReservations, setPendingReservations] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!['admin', 'faculty', 'staff'].includes(user?.role)) {
      navigate('/unauthorized');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, reservationsRes, activityRes] = await Promise.all([
          apiService.get('/admin/dashboard'),
          apiService.get('/admin/reservations?status=pending&limit=5'),
          apiService.get('/admin/reports/recent-activity?limit=10'),
        ]);

        setStats(statsRes.data || {});
        setPendingReservations(reservationsRes.data?.reservations || []);
        setRecentActivity(activityRes.data?.activity || []);
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
  }, [authLoading, isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking - Admin</h1>
            <div className="flex gap-4">
              <Link to="/admin/facilities" className="text-neutral-600 hover:text-neutral-900">Facilities</Link>
              <Link to="/admin/assets" className="text-neutral-600 hover:text-neutral-900">Assets</Link>
              <Link to="/admin/users" className="text-neutral-600 hover:text-neutral-900">Users</Link>
              <Link to="/admin/reports" className="text-neutral-600 hover:text-neutral-900">Reports</Link>
              <button onClick={handleLogout} className="text-neutral-600 hover:text-neutral-900">Logout</button>
            </div>
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

  const handleApprove = async (id) => {
    try {
      await apiService.post(`/admin/reservations/${id}/approve`, {});
      const res = await apiService.get('/admin/reservations?status=pending&limit=5');
      setPendingReservations(res.data?.reservations || []);
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleReject = async (id) => {
    const remarks = prompt('Rejection reason (optional):');
    try {
      await apiService.post(`/admin/reservations/${id}/reject`, { remarks: remarks || '' });
      const res = await apiService.get('/admin/reservations?status=pending&limit=5');
      setPendingReservations(res.data?.reservations || []);
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking - Admin</h1>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Card className="p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-neutral-600 mb-4">{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const userName = user?.name || user?.email || 'Admin';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking - Admin</h1>
          <div className="flex gap-4">
            <Link to="/admin/facilities" className="text-neutral-600 hover:text-neutral-900">Facilities</Link>
            <Link to="/admin/assets" className="text-neutral-600 hover:text-neutral-900">Assets</Link>
            <Link to="/admin/users" className="text-neutral-600 hover:text-neutral-900">Users</Link>
            <Link to="/admin/reports" className="text-neutral-600 hover:text-neutral-900">Reports</Link>
            <button onClick={handleLogout} className="text-neutral-600 hover:text-neutral-900">Logout</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h2>
          <p className="text-neutral-600 mt-1">Welcome, {userName}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-4xl mb-3">⏳</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.pending_reservations || 0}</div>
            <div className="text-sm font-medium text-neutral-600">Pending Requests</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.pending_assets || 0}</div>
            <div className="text-sm font-medium text-neutral-600">Asset Requests</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">🔄</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{stats.checked_out_items || 0}</div>
            <div className="text-sm font-medium text-neutral-600">Items Checked Out</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <div className="text-3xl font-bold text-error mb-1">{stats.overdue_returns || 0}</div>
            <div className="text-sm font-medium text-neutral-600">Overdue Returns</div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Pending Reservations */}
          <div className="col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Pending Reservation Requests</h3>
                <Link
                  to="/admin/reservations"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {pendingReservations.length > 0 ? (
                <div className="space-y-4">
                  {pendingReservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-neutral-900">{res.facility?.name || res.facility_name || 'Facility'}</h4>
                        <p className="text-sm text-neutral-600">By: {res.user?.name || res.requester || 'Unknown'}</p>
                        <p className="text-sm text-neutral-600">
                          {new Date(res.start_date).toLocaleDateString()} | {res.start_time} - {res.end_time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(res.id)}
                          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(res.id)}
                          className="px-4 py-2 bg-error text-white rounded hover:bg-red-600 text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-neutral-600">No pending requests</p>
              )}
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Activity</h3>

              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-neutral-200 last:border-b-0">
                      <div className="flex gap-2 mb-1">
                        <span className="text-lg">
                          {item.type === 'approved' && '✅'}
                          {item.type === 'returned' && '📦'}
                          {item.type === 'requested' && '⏳'}
                          {item.type === 'rejected' && '❌'}
                          {item.type === 'created' && '📝'}
                        </span>
                        <p className="text-sm font-medium text-neutral-900">{item.message}</p>
                      </div>
                      <p className="text-xs text-neutral-500">{item.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-neutral-600">No recent activity</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}