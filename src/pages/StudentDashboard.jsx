import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function StudentDashboard() {
  const [reservations] = useState([
    {
      id: 1,
      name: 'Computer Lab A',
      date: 'Oct 25, 2026',
      time: '2:00 PM - 4:00 PM',
      status: 'approved',
      attendees: 25
    },
    {
      id: 2,
      name: 'Meeting Room B',
      date: 'Oct 26, 2026',
      time: '10:00 AM - 11:30 AM',
      status: 'approved',
      attendees: 8
    }
  ]);

  const [pendingRequests] = useState([
    {
      id: 1,
      name: 'Lab Equipment Set',
      date: 'Oct 27, 2026',
      status: 'pending'
    }
  ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <div className="flex gap-4 items-center">
            <Link to="/profile">
              <button className="text-neutral-600 hover:text-neutral-900">Profile</button>
            </Link>
            <button className="text-neutral-600 hover:text-neutral-900">Notifications</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back, John Doe!</h2>
          <p className="text-neutral-600">Monday, October 25, 2026</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-4xl mb-3">🏛️</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">24</div>
            <div className="text-sm font-medium text-neutral-600">Available Facilities</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">12</div>
            <div className="text-sm font-medium text-neutral-600">Available Assets</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-4xl mb-3">📅</div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">3</div>
            <div className="text-sm font-medium text-neutral-600">Upcoming Reservations</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-4xl mb-3">⏳</div>
            <div className="text-3xl font-bold text-warning mb-1">1</div>
            <div className="text-sm font-medium text-neutral-600">Pending Requests</div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          {/* Upcoming Reservations */}
          <div className="col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-neutral-900">Your Upcoming Reservations</h3>
                <Link to="/reservations" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🏛️</div>
                      <div>
                        <h4 className="font-semibold text-neutral-900">{res.name}</h4>
                        <p className="text-sm text-neutral-600">{res.date} | {res.time}</p>
                        <p className="text-xs text-neutral-500 mt-1">Attendees: {res.attendees}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="approved">{res.status}</Badge>
                      <Link to={`/reservations/${res.id}`} className="text-primary-500 hover:text-primary-600 text-sm">
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/new-reservation" className="mt-6 block">
                <Button variant="primary" size="full">
                  New Reservation
                </Button>
              </Link>
            </Card>
          </div>

          {/* Pending Requests & Notifications */}
          <div className="space-y-6">
            {/* Pending Requests */}
            <Card>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Pending Requests</h3>
              
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="bg-warning bg-opacity-10 border border-warning border-opacity-30 p-3 rounded-lg">
                    <p className="font-semibold text-neutral-900 text-sm">{req.name}</p>
                    <p className="text-xs text-neutral-600 mt-1">{req.date}</p>
                    <Badge variant="pending" className="mt-2">Pending</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Recent Notifications</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2 pb-3 border-b border-neutral-200">
                  <div className="text-lg">✅</div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Reservation Approved</p>
                    <p className="text-xs text-neutral-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="text-lg">🔔</div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Pickup Reminder</p>
                    <p className="text-xs text-neutral-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
