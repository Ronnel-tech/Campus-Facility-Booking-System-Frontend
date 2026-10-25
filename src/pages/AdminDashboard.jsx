import { useState } from 'react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function AdminDashboard() {
  const [reservations] = useState([
    {
      id: 1,
      requester: 'John Doe',
      facility: 'Computer Lab A',
      date: 'Oct 25, 2026',
      time: '2:00 PM - 4:00 PM',
      status: 'pending'
    },
    {
      id: 2,
      requester: 'Jane Smith',
      facility: 'Meeting Room B',
      date: 'Oct 26, 2026',
      time: '10:00 AM - 11:30 AM',
      status: 'approved'
    }
  ]);

  const [activity] = useState([
    { type: 'approved', message: 'Reservation approved for Lab A', time: '10 minutes ago' },
    { type: 'returned', message: 'Asset returned: Canon EOS R5', time: '25 minutes ago' },
    { type: 'requested', message: 'New reservation request received', time: '1 hour ago' }
  ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking - Admin</h1>
          <div className="flex gap-4">
            <button className="text-neutral-600 hover:text-neutral-900">Settings</button>
            <button className="text-neutral-600 hover:text-neutral-900">Logout</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h2>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-4xl mb-3">⏳</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">12</div>
            <div className="text-sm font-medium text-neutral-600">Pending Requests</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">8</div>
            <div className="text-sm font-medium text-neutral-600">Asset Requests</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">🔄</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">34</div>
            <div className="text-sm font-medium text-neutral-600">Items Checked Out</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <div className="text-3xl font-bold text-error mb-1">2</div>
            <div className="text-sm font-medium text-neutral-600">Overdue Returns</div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Pending Reservations */}
          <div className="col-span-2">
            <Card>
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Pending Reservation Requests</h3>

              <div className="space-y-4">
                {reservations
                  .filter((r) => r.status === 'pending')
                  .map((res) => (
                    <div
                      key={res.id}
                      className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-neutral-900">{res.facility}</h4>
                        <p className="text-sm text-neutral-600">By: {res.requester}</p>
                        <p className="text-sm text-neutral-600">
                          {res.date} | {res.time}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm font-medium">
                          Approve
                        </button>
                        <button className="px-4 py-2 bg-error text-white rounded hover:bg-red-600 text-sm font-medium">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Activity</h3>

              <div className="space-y-4">
                {activity.map((item, idx) => (
                  <div key={idx} className="pb-3 border-b border-neutral-200 last:border-b-0">
                    <div className="flex gap-2 mb-1">
                      <span className="text-lg">
                        {item.type === 'approved' && '✅'}
                        {item.type === 'returned' && '📦'}
                        {item.type === 'requested' && '⏳'}
                      </span>
                      <p className="text-sm font-medium text-neutral-900">{item.message}</p>
                    </div>
                    <p className="text-xs text-neutral-500">{item.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
